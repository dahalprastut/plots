'use client'
import { ResponsiveLine } from '@nivo/line'
import { kmData } from '@/lib/chart-data'

const data = [
  { id: 'Survival', color: '#4F86C6', data: kmData.map(d => ({ x: d.time, y: d.survival })) },
  { id: 'CI Upper', color: 'rgba(79,134,198,0.4)', data: kmData.map(d => ({ x: d.time, y: d.ci_upper })) },
  { id: 'CI Lower', color: 'rgba(79,134,198,0.4)', data: kmData.map(d => ({ x: d.time, y: d.ci_lower })) },
]

export function KaplanMeier() {
  return (
    <ResponsiveLine
      data={data}
      curve="stepAfter"
      margin={{ top: 20, right: 30, bottom: 55, left: 65 }}
      xScale={{ type: 'linear', min: 0, max: 36 }}
      yScale={{ type: 'linear', min: 0.5, max: 1.05 }}
      yFormat=".1%"
      axisBottom={{ legend: 'Time (months)', legendOffset: 40, legendPosition: 'middle' }}
      axisLeft={{ legend: 'Survival Probability', legendOffset: -55, legendPosition: 'middle', format: '.0%' }}
      colors={['#4F86C6', 'rgba(79,134,198,0.5)', 'rgba(79,134,198,0.5)']}
      lineWidth={2.5}
      enablePoints={false}
      useMesh
      enableArea={false}
      tooltip={({ point }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <span className="font-bold">{point.seriesId}</span>: {String(point.data.yFormatted)}
        </div>
      )}
      legends={[{ anchor: 'top-right', direction: 'column', itemWidth: 80, itemHeight: 18, translateX: -10, translateY: 0 }]}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
