'use client'
import { ResponsivePie } from '@nivo/pie'
import { donutData } from '@/lib/chart-data'

const data = donutData.map(d => ({ id: d.label, label: d.label, value: d.value }))

export function Donut() {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 30, right: 80, bottom: 50, left: 80 }}
      innerRadius={0.55}
      padAngle={2}
      cornerRadius={3}
      colors={['#4F86C6', '#E07B54', '#5BAD6F', '#9B6DD6']}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#374151"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor="white"
      tooltip={({ datum }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <span className="font-bold">{datum.label}</span>: {datum.value}%
        </div>
      )}
      legends={[{
        anchor: 'bottom', direction: 'row', translateY: 46,
        itemWidth: 80, itemHeight: 18, symbolSize: 12, symbolShape: 'circle',
      }]}
      theme={{ labels: { text: { fill: '#374151' } } }}
    />
  )
}
