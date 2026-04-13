'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { kmData, KmDatum } from '@/lib/chart-data'

const MARGIN = { top: 20, right: 20, bottom: 40, left: 65 }
const RISK_TABLE_HEIGHT = 52
const COLOR = '#4F86C6'
const TOOLTIP_CLASS = 'km-d3-tooltip'

function approximateCensored(data: KmDatum[]): number[] {
  return data.map((d, i) => {
    if (i === 0) return 0
    const prev = data[i - 1]
    const expectedEvents = Math.round(prev.at_risk * (prev.survival - d.survival))
    return Math.max(0, prev.at_risk - d.at_risk - expectedEvents)
  })
}

export function KaplanMeier() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    if (!container || !svgEl) return

    function draw() {
      const { width, height } = container!.getBoundingClientRect()
      if (width === 0 || height === 0) return

      // Remove previous tooltip
      d3.select(container).selectAll(`.${TOOLTIP_CLASS}`).remove()

      const innerWidth = width - MARGIN.left - MARGIN.right
      const innerHeight = height - MARGIN.top - MARGIN.bottom - RISK_TABLE_HEIGHT

      const svg = d3.select(svgEl).attr('width', width).attr('height', height)
      svg.selectAll('*').remove()

      const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

      // ── Scales ──────────────────────────────────────────────────────────────────
      const maxTime = kmData[kmData.length - 1].time
      const x = d3.scaleLinear([0, maxTime], [0, innerWidth])
      const y = d3.scaleLinear([0, 1], [innerHeight, 0])

      // ── Grid ────────────────────────────────────────────────────────────────────
      g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(() => ''))
        .call(ag => ag.select('.domain').remove())
        .call(ag => ag.selectAll('.tick line')
          .attr('stroke', '#E5E7EB').attr('stroke-dasharray', '3,3'))

      // ── Axes ────────────────────────────────────────────────────────────────────
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}mo`))
        .call(ag => ag.select('.domain').attr('stroke', '#E5E7EB'))
        .call(ag => ag.selectAll('.tick line').attr('stroke', '#E5E7EB'))
        .call(ag => ag.selectAll('text').attr('fill', '#6B7280').attr('font-size', 11))

      g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')))
        .call(ag => ag.select('.domain').attr('stroke', '#E5E7EB'))
        .call(ag => ag.selectAll('.tick line').attr('stroke', '#E5E7EB'))
        .call(ag => ag.selectAll('text').attr('fill', '#6B7280').attr('font-size', 11))

      // Axis labels
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -55).attr('x', -(innerHeight / 2))
        .attr('text-anchor', 'middle').attr('fill', '#374151').attr('font-size', 11)
        .text('Survival Probability')

      g.append('text')
        .attr('x', innerWidth / 2).attr('y', innerHeight + 35)
        .attr('text-anchor', 'middle').attr('fill', '#374151').attr('font-size', 11)
        .text('Time (months)')

      // ── CI band ─────────────────────────────────────────────────────────────────
      const area = d3.area<KmDatum>()
        .x(d => x(d.time))
        .y0(d => y(d.ci_lower))
        .y1(d => y(d.ci_upper))
        .curve(d3.curveStepAfter)

      g.append('path')
        .datum(kmData)
        .attr('d', area)
        .attr('fill', 'rgba(79,134,198,0.15)')
        .attr('stroke', 'none')

      // ── Survival line (animated) ─────────────────────────────────────────────────
      const line = d3.line<KmDatum>()
        .x(d => x(d.time))
        .y(d => y(d.survival))
        .curve(d3.curveStepAfter)

      const path = g.append('path')
        .datum(kmData)
        .attr('d', line)
        .attr('stroke', COLOR)
        .attr('stroke-width', 2.5)
        .attr('fill', 'none')

      const totalLength = (path.node() as SVGPathElement).getTotalLength()
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition().duration(1500).ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)

      // ── Censoring tick marks ────────────────────────────────────────────────────
      const censored = approximateCensored(kmData)
      kmData.forEach((d, i) => {
        if (i === 0 || censored[i] === 0) return
        g.append('line')
          .attr('x1', x(d.time)).attr('x2', x(d.time))
          .attr('y1', y(d.survival) - 5).attr('y2', y(d.survival) + 5)
          .attr('stroke', COLOR).attr('stroke-width', 1.5)
      })

      // ── At-risk table ───────────────────────────────────────────────────────────
      const riskY = innerHeight + MARGIN.bottom
      const riskG = g.append('g').attr('transform', `translate(0,${riskY})`)

      riskG.append('line')
        .attr('x1', 0).attr('x2', innerWidth)
        .attr('stroke', '#E5E7EB').attr('stroke-width', 1)

      riskG.append('text')
        .attr('x', -5).attr('y', 18)
        .attr('text-anchor', 'end').attr('font-size', 11).attr('fill', '#6B7280')
        .text('At risk')

      kmData.forEach(d => {
        riskG.append('text')
          .attr('x', x(d.time)).attr('y', 18)
          .attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#374151')
          .attr('class', `risk-t${d.time}`)
          .text(d.at_risk)
      })

      // ── Hover crosshair ─────────────────────────────────────────────────────────
      const bisect = d3.bisector<KmDatum, number>(d => d.time).right

      const crosshair = g.append('line')
        .attr('y1', 0).attr('y2', innerHeight)
        .attr('stroke', '#9CA3AF').attr('stroke-width', 1).attr('stroke-dasharray', '4,3')
        .attr('display', 'none')

      const tooltip = d3.select(container!)
        .append('div')
        .attr('class', `${TOOLTIP_CLASS} pointer-events-none absolute z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs text-gray-700 whitespace-nowrap`)
        .style('display', 'none')

      g.append('rect')
        .attr('width', innerWidth).attr('height', innerHeight)
        .attr('fill', 'none').attr('pointer-events', 'all')
        .on('mousemove', function(event: MouseEvent) {
          const [mx] = d3.pointer(event)
          const t = x.invert(mx)
          const idx = Math.min(bisect(kmData, t), kmData.length - 1)
          const d = kmData[idx]

          crosshair.attr('display', null)
            .attr('x1', x(d.time)).attr('x2', x(d.time))

          // Highlight at-risk column
          riskG.selectAll('text').attr('font-weight', 'normal').attr('fill', '#374151')
          riskG.select(`.risk-t${d.time}`)
            .attr('font-weight', '600').attr('fill', COLOR)

          const tx = Math.min(x(d.time) + MARGIN.left + 10, width - 155)
          const ty = Math.max(y(d.survival) + MARGIN.top - 10, 4)
          tooltip.style('display', 'block')
            .style('left', `${tx}px`).style('top', `${ty}px`)
            .html(`Time: ${d.time} mo<br>Survival: ${(d.survival * 100).toFixed(1)}%<br>At risk: ${d.at_risk}`)
        })
        .on('mouseleave', () => {
          crosshair.attr('display', 'none')
          tooltip.style('display', 'none')
          riskG.selectAll('text').attr('font-weight', 'normal').attr('fill', '#374151')
        })
    }

    draw()

    const ro = new ResizeObserver(draw)
    ro.observe(container)
    return () => {
      ro.disconnect()
      d3.select(container).selectAll(`.${TOOLTIP_CLASS}`).remove()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full overflow-visible" />
    </div>
  )
}
