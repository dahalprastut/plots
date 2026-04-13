'use client'
import { ResponsiveBar } from '@nivo/bar'
import { forestData } from '@/lib/chart-data'

const data = forestData.map(d => ({
  variable: d.variable,
  base: +d.ci_lower.toFixed(3),
  range: +(d.ci_upper - d.ci_lower).toFixed(3),
  hr: d.hr,
  ci_lower: d.ci_lower,
  ci_upper: d.ci_upper,
  p_value: d.p_value,
}))

export function ForestPlot() {
  return (
    <ResponsiveBar
      data={data}
      keys={['base', 'range']}
      indexBy="variable"
      layout="horizontal"
      groupMode="stacked"
      margin={{ top: 20, right: 80, bottom: 55, left: 140 }}
      valueScale={{ type: 'linear' } as any}
      colors={({ id }: any) => (id === 'base' ? 'transparent' : 'rgba(79,134,198,0.4)')}
      borderRadius={2}
      axisBottom={{ legend: 'Hazard Ratio', legendPosition: 'middle', legendOffset: 40 }}
      axisLeft={{ tickSize: 0, tickPadding: 8 }}
      enableLabel={false}
      tooltip={({ data: d }: any) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <p className="font-bold">{d.variable}</p>
          <p>HR: {d.hr.toFixed(2)} [{d.ci_lower.toFixed(2)}, {d.ci_upper.toFixed(2)}]</p>
          <p>p = {d.p_value}</p>
        </div>
      )}
      layers={['grid', 'axes', 'bars', 'markers', (ctx: any) => (
        <g>
          <line
            x1={ctx.xScale(1)} x2={ctx.xScale(1)}
            y1={0} y2={ctx.innerHeight}
            stroke="#374151" strokeDasharray="4,4" strokeWidth={1.5}
          />
          {ctx.bars
            .filter((b: any) => b.data.id === 'range')
            .map((b: any) => (
              <circle
                key={b.key}
                cx={ctx.xScale((b.data.data as any).hr)}
                cy={b.y + b.height / 2}
                r={5} fill="#4F86C6"
              />
            ))}
        </g>
      )]}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151', fontSize: 11 } } } }}
    />
  )
}
