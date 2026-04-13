'use client'
import dynamic from 'next/dynamic'
import { cumulativeIncidenceData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function CumulativeIncidence() {
  return (
    <Plot
      data={[
        {
          x: cumulativeIncidenceData.map(d => d.time),
          y: cumulativeIncidenceData.map(d => d.incidence),
          type: 'scatter', mode: 'lines',
          fill: 'tozeroy', fillcolor: 'rgba(79,134,198,0.2)',
          line: { color: '#4F86C6', width: 2.5 },
          name: 'Reintervention',
          hovertemplate: 'Time: %{x}mo<br>CIF: %{y:.1%}<extra>Reintervention</extra>',
        },
        {
          x: cumulativeIncidenceData.map(d => d.time),
          y: cumulativeIncidenceData.map(d => d.competing),
          type: 'scatter', mode: 'lines',
          fill: 'tozeroy', fillcolor: 'rgba(224,123,84,0.2)',
          line: { color: '#E07B54', width: 2.5 },
          name: 'Amputation (competing)',
          hovertemplate: 'Time: %{x}mo<br>CIF: %{y:.1%}<extra>Amputation</extra>',
        },
      ]}
      layout={{
        xaxis: { title: 'Time (months)', gridcolor: '#E5E7EB' },
        yaxis: { title: 'Cumulative Incidence', tickformat: '.0%', range: [0, 0.35], gridcolor: '#E5E7EB' },
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 70, r: 20, t: 20, b: 60 },
        legend: { x: 0.02, y: 0.98 },
        hovermode: 'x unified',
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
