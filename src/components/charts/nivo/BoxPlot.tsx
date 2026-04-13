'use client'
import { ResponsiveBar } from '@nivo/bar'
import { boxPlotData } from '@/lib/chart-data'

const data = boxPlotData.map(d => ({
  group: d.group,
  floor: d.min,
  lowerWhisker: d.q1 - d.min,
  lowerBox: d.median - d.q1,
  upperBox: d.q3 - d.median,
  upperWhisker: d.max - d.q3,
  min: d.min, q1: d.q1, median: d.median, q3: d.q3, max: d.max,
}))

export function BoxPlot() {
  return (
    <ResponsiveBar
      data={data}
      keys={['floor', 'lowerWhisker', 'lowerBox', 'upperBox', 'upperWhisker']}
      indexBy="group"
      groupMode="stacked"
      padding={0.4}
      margin={{ top: 20, right: 30, bottom: 55, left: 65 }}
      colors={['transparent', '#93C5FD', '#4F86C6', '#4F86C6', '#93C5FD']}
      axisLeft={{ legend: 'Months', legendPosition: 'middle', legendOffset: -55 }}
      axisBottom={{ legend: 'Procedure Group', legendPosition: 'middle', legendOffset: 40 }}
      enableLabel={false}
      tooltip={({ data: d }: any) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <p className="font-bold">{d.group}</p>
          <p>Max: {d.max} | Q3: {d.q3}</p>
          <p>Median: {d.median}</p>
          <p>Q1: {d.q1} | Min: {d.min}</p>
        </div>
      )}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
