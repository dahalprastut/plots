'use client'
import dynamic from 'next/dynamic'
import { lineData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function LineArea() {
  return (
    <Plot
      data={[{
        x: lineData.map(d => d.date),
        y: lineData.map(d => d.value),
        type: 'scatter', mode: 'lines+markers',
        fill: 'tozeroy', fillcolor: 'rgba(79,134,198,0.12)',
        line: { color: '#4F86C6', width: 2.5 },
        marker: { color: '#4F86C6', size: 7 },
        hovertemplate: '%{x}<br>Rate: %{y}%<extra></extra>',
        name: 'Amputation Rate',
      }]}
      layout={{
        xaxis: { title: 'Quarter', gridcolor: '#E5E7EB', tickangle: -35 },
        yaxis: { title: 'Amputation Rate (%)', ticksuffix: '%', range: [4, 10], gridcolor: '#E5E7EB' },
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 60, r: 20, t: 20, b: 80 },
        showlegend: false,
        hovermode: 'x unified',
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
