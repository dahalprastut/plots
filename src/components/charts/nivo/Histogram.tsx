'use client'
import { ResponsiveBar } from '@nivo/bar'
import { histogramData } from '@/lib/chart-data'

export function Histogram() {
  return (
    <ResponsiveBar
      data={histogramData}
      keys={['count']}
      indexBy="bin"
      padding={0.05}
      margin={{ top: 20, right: 20, bottom: 60, left: 65 }}
      colors={['#4F86C6']}
      axisBottom={{ legend: 'Age Group (years)', legendPosition: 'middle', legendOffset: 42 }}
      axisLeft={{ legend: 'Patient Count', legendPosition: 'middle', legendOffset: -55 }}
      enableLabel={false}
      tooltip={({ indexValue, value }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          Age {indexValue}: <span className="font-bold">{value}</span> patients
        </div>
      )}
      theme={{ grid: { line: { stroke: '#E5E7EB' } }, axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
