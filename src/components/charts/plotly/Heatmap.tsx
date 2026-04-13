'use client'
import dynamic from 'next/dynamic'
import { heatmapData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

const ROWS = ['Age', 'Smoking', 'Diabetes']
const COLS = ['Reintervention', 'Amputation', 'Death']

const z = ROWS.map(row =>
  COLS.map(col => heatmapData.find(d => d.row === row && d.col === col)?.value ?? 0)
)

export function Heatmap() {
  return (
    <Plot
      data={[{
        z, x: COLS, y: ROWS,
        type: 'heatmap',
        colorscale: [[0, 'rgba(79,134,198,0.1)'], [1, '#4F86C6']],
        showscale: true,
        text: z.map(row => row.map(v => v.toFixed(2))),
        texttemplate: '%{text}',
        hovertemplate: '<b>%{y} × %{x}</b><br>r = %{z:.2f}<extra></extra>',
        zmin: 0, zmax: 0.6,
      }]}
      layout={{
        xaxis: { side: 'bottom' },
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 80, r: 60, t: 20, b: 80 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
