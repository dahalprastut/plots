'use client'
import { ResponsiveLine } from '@nivo/line'
import { cumulativeIncidenceData } from '@/lib/chart-data'

const data = [
  { id: 'Reintervention', color: '#4F86C6', data: cumulativeIncidenceData.map(d => ({ x: d.time, y: d.incidence })) },
  { id: 'Amputation (competing)', color: '#E07B54', data: cumulativeIncidenceData.map(d => ({ x: d.time, y: d.competing })) },
]

export function CumulativeIncidence() {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 20, right: 20, bottom: 60, left: 65 }}
      xScale={{ type: 'linear', min: 0, max: 36 }}
      yScale={{ type: 'linear', min: 0, max: 0.35 }}
      yFormat=".1%"
      axisBottom={{ legend: 'Time (months)', legendPosition: 'middle', legendOffset: 42 }}
      axisLeft={{ legend: 'Cumulative Incidence', legendPosition: 'middle', legendOffset: -55, format: (v) => `${(Number(v) * 100).toFixed(0)}%` }}
      colors={['#4F86C6', '#E07B54']}
      lineWidth={2.5}
      enableArea
      areaOpacity={0.2}
      pointSize={6}
      useMesh
      tooltip={({ point }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <span className="font-bold">{point.seriesId}</span> @ {point.data.x}mo: {String(point.data.yFormatted)}
        </div>
      )}
      legends={[{ anchor: 'top-left', direction: 'column', translateX: 10, translateY: 10, itemWidth: 160, itemHeight: 18 }]}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
