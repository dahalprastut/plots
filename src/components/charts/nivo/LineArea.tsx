'use client'
import { ResponsiveLine } from '@nivo/line'
import { lineData } from '@/lib/chart-data'

const data = [{ id: 'Amputation Rate', color: '#4F86C6', data: lineData.map(d => ({ x: d.date, y: d.value })) }]

export function LineArea() {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 20, right: 20, bottom: 70, left: 65 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 5, max: 9 }}
      yFormat=".1f"
      axisBottom={{ legend: 'Quarter', legendPosition: 'middle', legendOffset: 60, tickRotation: -35 }}
      axisLeft={{ legend: 'Amputation Rate (%)', legendPosition: 'middle', legendOffset: -55, format: (v) => `${v}%` }}
      colors={['#4F86C6']}
      lineWidth={2.5}
      enableArea
      areaOpacity={0.12}
      pointSize={7}
      pointColor="#4F86C6"
      pointBorderWidth={2}
      pointBorderColor="white"
      useMesh
      tooltip={({ point }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          {String(point.data.x)}: <span className="font-bold">{String(point.data.yFormatted)}%</span>
        </div>
      )}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
