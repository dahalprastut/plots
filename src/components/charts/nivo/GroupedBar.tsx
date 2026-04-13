'use client'
import { ResponsiveBar } from '@nivo/bar'
import { groupedBarData } from '@/lib/chart-data'

export function GroupedBar() {
  return (
    <ResponsiveBar
      data={groupedBarData}
      keys={['reintervention_rate', 'no_reintervention_rate']}
      indexBy="artery"
      groupMode="grouped"
      margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
      padding={0.3}
      valueFormat=".1f"
      colors={['#E07B54', '#4F86C6']}
      axisBottom={{ legend: 'Artery Type', legendPosition: 'middle', legendOffset: 42 }}
      axisLeft={{ legend: 'Rate (%)', legendPosition: 'middle', legendOffset: -50, format: (v) => `${v}%` }}
      enableLabel={false}
      tooltip={({ id, value, indexValue }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <span className="font-bold">{indexValue}</span> — {id === 'reintervention_rate' ? 'Reintervention' : 'No Reintervention'}: {value}%
        </div>
      )}
      legends={[{
        dataFrom: 'keys',
        anchor: 'bottom',
        direction: 'row',
        translateY: 55,
        itemWidth: 140,
        itemHeight: 18,
        data: [
          { id: 'reintervention_rate', label: 'Reintervention', color: '#E07B54' },
          { id: 'no_reintervention_rate', label: 'No Reintervention', color: '#4F86C6' },
        ],
      }]}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
