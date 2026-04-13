// src/components/charts/d3/CumulativeIncidence.tsx
'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { cumulativeIncidenceData, CumulativeIncidenceDatum } from '@/lib/chart-data'

const MARGIN = { top: 20, right: 20, bottom: 40, left: 65 }
const TOOLTIP_CLASS = 'ci-d3-tooltip'

const SERIES = [
  { key: 'incidence' as const, label: 'Reintervention',        color: '#4F86C6' },
  { key: 'competing' as const, label: 'Amputation (competing)', color: '#E07B54' },
]

export function CumulativeIncidence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    if (!container || !svgEl) return

    function draw() {
      const { width, height } = container!.getBoundingClientRect()
      if (width === 0 || height === 0) return

      d3.select(container).selectAll(`.${TOOLTIP_CLASS}`).remove()

      const innerWidth = width - MARGIN.left - MARGIN.right
      const innerHeight = height - MARGIN.top - MARGIN.bottom

      const svg = d3.select(svgEl).attr('width', width).attr('height', height)
      svg.selectAll('*').remove()

      const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

      // ── Scales ──────────────────────────────────────────────────────────────────
      const x = d3.scaleLinear([0, 36], [0, innerWidth])
      const y = d3.scaleLinear([0, 0.35], [innerHeight, 0])

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
        .text('Cumulative Incidence')

      g.append('text')
        .attr('x', innerWidth / 2).attr('y', innerHeight + 35)
        .attr('text-anchor', 'middle').attr('fill', '#374151').attr('font-size', 11)
        .text('Time (months)')

      // ── Filled areas + animated lines ────────────────────────────────────────────
      SERIES.forEach(({ key, color }) => {
        // Filled area from y=0 up to curve
        g.append('path')
          .datum(cumulativeIncidenceData)
          .attr('d', d3.area<CumulativeIncidenceDatum>()
            .x(d => x(d.time))
            .y0(y(0))
            .y1(d => y(d[key]))
            .curve(d3.curveStepAfter))
          .attr('fill', color).attr('opacity', 0.2).attr('stroke', 'none')

        // Animated line
        const path = g.append('path')
          .datum(cumulativeIncidenceData)
          .attr('d', d3.line<CumulativeIncidenceDatum>()
            .x(d => x(d.time))
            .y(d => y(d[key]))
            .curve(d3.curveStepAfter))
          .attr('stroke', color).attr('stroke-width', 2.5)
          .attr('fill', 'none')

        const len = (path.node() as SVGPathElement).getTotalLength()
        path
          .attr('stroke-dasharray', `${len} ${len}`)
          .attr('stroke-dashoffset', len)
          .transition().duration(1500).ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
      })

      // ── Legend (top-left) ───────────────────────────────────────────────────────
      SERIES.forEach(({ label, color }, i) => {
        const ly = 8 + i * 18
        g.append('line')
          .attr('x1', 8).attr('x2', 26).attr('y1', ly + 5).attr('y2', ly + 5)
          .attr('stroke', color).attr('stroke-width', 2)
        g.append('text')
          .attr('x', 30).attr('y', ly + 9)
          .attr('font-size', 11).attr('fill', '#374151')
          .text(label)
      })

      // ── Hover crosshair ─────────────────────────────────────────────────────────
      const bisect = d3.bisector<CumulativeIncidenceDatum, number>(d => d.time).left

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
          const idx = Math.min(bisect(cumulativeIncidenceData, t), cumulativeIncidenceData.length - 1)
          const d = cumulativeIncidenceData[idx]

          crosshair.attr('display', null)
            .attr('x1', x(d.time)).attr('x2', x(d.time))

          const tx = Math.min(x(d.time) + MARGIN.left + 10, width - 200)
          const ty = Math.max(MARGIN.top, y(Math.max(d.incidence, d.competing)) + MARGIN.top - 30)
          tooltip.style('display', 'block')
            .style('left', `${tx}px`).style('top', `${ty}px`)
            .html(`Time: ${d.time} mo<br><span style="color:#4F86C6">Reintervention: ${(d.incidence * 100).toFixed(1)}%</span><br><span style="color:#E07B54">Amputation: ${(d.competing * 100).toFixed(1)}%</span>`)
        })
        .on('mouseleave', () => {
          crosshair.attr('display', 'none')
          tooltip.style('display', 'none')
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
