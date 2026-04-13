'use client'
import dynamic from 'next/dynamic'
import { histogramData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function Histogram() {
  return (
    <Plot
      data={[{
        x: histogramData.map(d => d.bin),
        y: histogramData.map(d => d.count),
        type: 'bar',
        marker: { color: '#4F86C6', line: { color: 'white', width: 1 } },
        hovertemplate: 'Age %{x}: %{y} patients<extra></extra>',
        name: 'Patients',
      }]}
      layout={{
        xaxis: { title: 'Age Group (years)', gridcolor: '#E5E7EB' },
        yaxis: { title: 'Patient Count', gridcolor: '#E5E7EB' },
        bargap: 0.05,
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 60, r: 20, t: 20, b: 60 },
        showlegend: false,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
