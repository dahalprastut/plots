// src/components/charts/d3/FreedomFromReintervention.tsx
'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { FreedomFromReinterventionData, KmDatum } from '@/lib/chart-data'

const MARGIN = { top: 20, right: 20, bottom: 40, left: 65 }
const RISK_HEADER_HEIGHT = 26
const RISK_ROW_HEIGHT = 20
const TOOLTIP_CLASS = 'ffr-d3-tooltip'

export function FreedomFromReintervention({
  arms,
  logRankP,
  timeUnit = 'months',
}: FreedomFromReinterventionData) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    if (!container || !svgEl || !arms.length) return

    function draw() {
      const { width, height } = container!.getBoundingClientRect()
      if (width === 0 || height === 0) return

      d3.select(container).selectAll(`.${TOOLTIP_CLASS}`).remove()

      const riskTableHeight = RISK_HEADER_HEIGHT + arms.length * RISK_ROW_HEIGHT + 6
      const innerWidth = width - MARGIN.left - MARGIN.right
      const innerHeight = height - MARGIN.top - MARGIN.bottom - riskTableHeight

      const svg = d3.select(svgEl).attr('width', width).attr('height', height)
      svg.selectAll('*').remove()

      const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

      // ── Scales ──────────────────────────────────────────────────────────────────
      const timePoints = arms[0].data.map(d => d.time)
      const maxTime = timePoints[timePoints.length - 1]
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

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -55).attr('x', -(innerHeight / 2))
        .attr('text-anchor', 'middle').attr('fill', '#374151').attr('font-size', 11)
        .text('Freedom from Reintervention')

      g.append('text')
        .attr('x', innerWidth / 2).attr('y', innerHeight + 35)
        .attr('text-anchor', 'middle').attr('fill', '#374151').attr('font-size', 11)
        .text(`Time (${timeUnit})`)

      // ── CI bands + survival lines per arm ────────────────────────────────────────
      const areaGen = (armData: KmDatum[]) =>
        d3.area<KmDatum>()
          .x(d => x(d.time)).y0(d => y(d.ci_lower)).y1(d => y(d.ci_upper))
          .curve(d3.curveStepAfter)(armData)

      const lineGen = (armData: KmDatum[]) =>
        d3.line<KmDatum>()
          .x(d => x(d.time)).y(d => y(d.survival))
          .curve(d3.curveStepAfter)(armData)

      arms.forEach(arm => {
        // CI band
        g.append('path')
          .attr('d', areaGen(arm.data) ?? '')
          .attr('fill', arm.color).attr('opacity', 0.12).attr('stroke', 'none')

        // Survival line (animated)
        const path = g.append('path')
          .attr('d', lineGen(arm.data) ?? '')
          .attr('stroke', arm.color).attr('stroke-width', 2)
          .attr('fill', 'none')

        const len = (path.node() as SVGPathElement).getTotalLength()
        path
          .attr('stroke-dasharray', `${len} ${len}`)
          .attr('stroke-dashoffset', len)
          .transition().duration(1400).ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
      })

      // ── Legend (top-right) ──────────────────────────────────────────────────────
      const legendX = innerWidth - 10
      arms.forEach((arm, i) => {
        const ly = 6 + i * 18
        g.append('line')
          .attr('x1', legendX - 18).attr('x2', legendX)
          .attr('y1', ly + 5).attr('y2', ly + 5)
          .attr('stroke', arm.color).attr('stroke-width', 2)
        g.append('text')
          .attr('x', legendX - 22).attr('y', ly + 9)
          .attr('text-anchor', 'end').attr('font-size', 11).attr('fill', '#374151')
          .text(arm.label)
      })

      // ── Log-rank p annotation (bottom-right) ────────────────────────────────────
      const pText = logRankP < 0.001
        ? 'Log-rank p < 0.001'
        : `Log-rank p = ${logRankP.toFixed(3)}`
      g.append('text')
        .attr('x', innerWidth - 4).attr('y', innerHeight - 6)
        .attr('text-anchor', 'end').attr('font-size', 10).attr('fill', '#374151')
        .attr('font-style', 'italic')
        .text(pText)

      // ── At-risk table ───────────────────────────────────────────────────────────
      const riskY = innerHeight + MARGIN.bottom
      const riskG = g.append('g').attr('transform', `translate(0,${riskY})`)

      riskG.append('line')
        .attr('x1', 0).attr('x2', innerWidth)
        .attr('stroke', '#E5E7EB').attr('stroke-width', 1)

      // Header: time point labels
      riskG.append('text')
        .attr('x', -5).attr('y', RISK_HEADER_HEIGHT - 6)
        .attr('text-anchor', 'end').attr('font-size', 10).attr('fill', '#6B7280')
        .text(`At risk (${timeUnit})`)

      timePoints.forEach(t => {
        riskG.append('text')
          .attr('x', x(t)).attr('y', RISK_HEADER_HEIGHT - 6)
          .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', '#6B7280')
          .text(t)
      })

      // Rows: one per arm
      arms.forEach((arm, armIdx) => {
        const rowY = RISK_HEADER_HEIGHT + armIdx * RISK_ROW_HEIGHT

        riskG.append('text')
          .attr('x', -5).attr('y', rowY + 14)
          .attr('text-anchor', 'end').attr('font-size', 10).attr('font-weight', '500')
          .attr('fill', arm.color)
          .text(arm.label)

        arm.data.forEach((d, ti) => {
          riskG.append('text')
            .attr('x', x(timePoints[ti])).attr('y', rowY + 14)
            .attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#374151')
            .attr('class', `risk-a${armIdx}-t${timePoints[ti]}`)
            .text(d.at_risk)
        })
      })

      // ── Hover crosshair ─────────────────────────────────────────────────────────
      const bisect = d3.bisector<KmDatum, number>(d => d.time).left

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
          const idx = Math.min(bisect(arms[0].data, t), arms[0].data.length - 1)
          const nearestT = timePoints[idx]

          crosshair.attr('display', null)
            .attr('x1', x(nearestT)).attr('x2', x(nearestT))

          // Highlight corresponding column in every arm's row
          arms.forEach((_, ai) => {
            riskG.selectAll(`[class^="risk-a${ai}"]`)
              .attr('font-weight', 'normal').attr('fill', '#374151')
            riskG.select(`.risk-a${ai}-t${nearestT}`)
              .attr('font-weight', '600').attr('fill', arms[ai].color)
          })

          const lines = arms.map(arm => {
            const d = arm.data[idx]
            return `<span style="color:${arm.color}">${arm.label}</span>: ${(d.survival * 100).toFixed(1)}%`
          }).join('<br>')

          const tx = Math.min(x(nearestT) + MARGIN.left + 10, width - 180)
          const ty = Math.max(MARGIN.top, y(arms[0].data[idx].survival) + MARGIN.top - 30)
          tooltip.style('display', 'block')
            .style('left', `${tx}px`).style('top', `${ty}px`)
            .html(`Time: ${nearestT} ${timeUnit}<br>${lines}`)
        })
        .on('mouseleave', () => {
          crosshair.attr('display', 'none')
          tooltip.style('display', 'none')
          arms.forEach((_, ai) => {
            riskG.selectAll(`[class^="risk-a${ai}"]`)
              .attr('font-weight', 'normal').attr('fill', '#374151')
          })
        })
    }

    draw()

    const ro = new ResizeObserver(draw)
    ro.observe(container)
    return () => {
      ro.disconnect()
      d3.select(container).selectAll(`.${TOOLTIP_CLASS}`).remove()
    }
  }, [arms, logRankP, timeUnit])

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full overflow-visible" />
    </div>
  )
}
