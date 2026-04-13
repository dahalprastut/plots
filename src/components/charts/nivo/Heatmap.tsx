'use client'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { heatmapData } from '@/lib/chart-data'

const ROWS = ['Age', 'Smoking', 'Diabetes']
const COLS = ['Reintervention', 'Amputation', 'Death']

const data = ROWS.map(row => ({
  id: row,
  data: COLS.map(col => ({
    x: col,
    y: heatmapData.find(d => d.row === row && d.col === col)?.value ?? 0,
  })),
}))

export function Heatmap() {
  return (
    <ResponsiveHeatMap
      data={data}
      margin={{ top: 30, right: 30, bottom: 60, left: 80 }}
      valueFormat=".2f"
      axisTop={null}
      axisLeft={{ tickSize: 0, tickPadding: 10 }}
      axisBottom={{ legend: 'Outcome', legendPosition: 'middle', legendOffset: 46 }}
      colors={{ type: 'sequential', scheme: 'blues', minValue: 0, maxValue: 0.6 }}
      emptyColor="#f0f4f8"
      borderRadius={4}
      labelTextColor="white"
      tooltip={({ cell }) => (
        <div className="rounded border bg-white p-2 text-xs shadow">
          <span className="font-bold">{cell.serieId} × {cell.data.x}</span>: r = {Number(cell.value).toFixed(2)}
        </div>
      )}
      theme={{ axis: { ticks: { text: { fill: '#374151' } } } }}
    />
  )
}
