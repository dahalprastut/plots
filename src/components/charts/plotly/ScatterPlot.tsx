'use client'
import dynamic from 'next/dynamic'
import { scatterData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function ScatterPlot() {
  return (
    <Plot
      data={[{
        x: scatterData.map(d => d.x),
        y: scatterData.map(d => d.y),
        text: scatterData.map(d => d.label),
        type: 'scatter', mode: 'markers',
        marker: { color: '#4F86C6', size: 8, opacity: 0.7 },
        hovertemplate: '<b>%{text}</b><br>Age: %{x}yr<br>Follow-up: %{y}mo<extra></extra>',
        name: 'Patients',
      }]}
      layout={{
        xaxis: { title: 'Age (years)', range: [44, 88], gridcolor: '#E5E7EB' },
        yaxis: { title: 'Follow-up (months)', gridcolor: '#E5E7EB' },
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 60, r: 20, t: 20, b: 60 },
        showlegend: false,
        hovermode: 'closest',
      }}
      config={{ responsive: true, displayModeBar: true, displaylogo: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
