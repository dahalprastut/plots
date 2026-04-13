'use client'
import { ResponsiveBar } from '@nivo/bar'
import { horizontalBarData } from '@/lib/chart-data'

export function HorizontalBar() {
  return (
    <ResponsiveBar
      data={horizontalBarData}
      keys={['rate']}
      indexBy="site"
      layout="horizontal"
      padding={0.3}
      margin={{ top: 20, right: 60, bottom: 55, left: 80 }}
      colors={({ data }: any) => data.site === 'Your Site' ? '#E07B54' : '#4F86C6'}
      axisBottom={{ legend: 'Reintervention Rate (%)', legendPosition: 'middle', legendOffset: 40, format: (v) => `${v}%` }}
      axisLeft={{ tickSize: 0, tickPadding: 8 }}
      enableLabel
      label={(d) => `${d.value}%`}
      labelSkipWidth={12}
      tooltip={({ indexValue, value }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <span className="font-bold">{indexValue}</span>: {value}%
        </div>
      )}
      markers={[{ axis: 'x', value: 13.5, lineStyle: { stroke: '#374151', strokeDasharray: '4,4', strokeWidth: 1.5 } }]}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
