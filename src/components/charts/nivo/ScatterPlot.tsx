'use client'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { scatterData } from '@/lib/chart-data'

const data = [{ id: 'Patients', data: scatterData.map(d => ({ x: d.x, y: d.y, label: d.label })) }]

export function ScatterPlot() {
  return (
    <ResponsiveScatterPlot
      data={data}
      margin={{ top: 20, right: 30, bottom: 60, left: 65 }}
      xScale={{ type: 'linear', min: 44, max: 88 }}
      yScale={{ type: 'linear', min: 0, max: 65 }}
      axisBottom={{ legend: 'Age (years)', legendPosition: 'middle', legendOffset: 42 }}
      axisLeft={{ legend: 'Follow-up (months)', legendPosition: 'middle', legendOffset: -55 }}
      colors={['#4F86C6']}
      nodeSize={8}
      useMesh={false}
      tooltip={({ node }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <p className="font-bold">{(node.data as any).label}</p>
          <p>Age: {node.data.x}yr — Follow-up: {node.data.y}mo</p>
        </div>
      )}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
