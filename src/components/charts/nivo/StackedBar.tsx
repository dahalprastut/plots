'use client'
import { ResponsiveBar } from '@nivo/bar'
import { stackedBarData } from '@/lib/chart-data'

export function StackedBar() {
  return (
    <ResponsiveBar
      data={stackedBarData}
      keys={['current_smoker', 'former_smoker', 'never_smoker']}
      indexBy="period"
      groupMode="stacked"
      padding={0.3}
      margin={{ top: 20, right: 20, bottom: 70, left: 60 }}
      colors={['#E07B54', '#4F86C6', '#5BAD6F']}
      axisBottom={{ legend: 'Year', legendPosition: 'middle', legendOffset: 42 }}
      axisLeft={{ legend: '(%)', legendPosition: 'middle', legendOffset: -50, format: (v) => `${v}%` }}
      enableLabel={false}
      valueFormat=".0f"
      tooltip={({ id, value, indexValue }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          {indexValue} — {String(id).replace(/_/g, ' ')}: <span className="font-bold">{value}%</span>
        </div>
      )}
      legends={[{
        dataFrom: 'keys',
        anchor: 'bottom', direction: 'row', translateY: 65,
        itemWidth: 110, itemHeight: 18, symbolSize: 12,
        data: [
          { id: 'current_smoker', label: 'Current Smoker', color: '#E07B54' },
          { id: 'former_smoker', label: 'Former Smoker', color: '#4F86C6' },
          { id: 'never_smoker', label: 'Never Smoker', color: '#5BAD6F' },
        ],
      }]}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
