'use client'
import dynamic from 'next/dynamic'
import { donutData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function Donut() {
  return (
    <Plot
      data={[{
        labels: donutData.map(d => d.label),
        values: donutData.map(d => d.value),
        type: 'pie', hole: 0.5,
        marker: { colors: ['#4F86C6', '#E07B54', '#5BAD6F', '#9B6DD6'] },
        textinfo: 'label+percent',
        hovertemplate: '<b>%{label}</b><br>%{value}%<br>%{percent}<extra></extra>',
      }]}
      layout={{
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 20, r: 20, t: 20, b: 20 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.1 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
