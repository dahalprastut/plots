'use client'
import dynamic from 'next/dynamic'
import { kmData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function KaplanMeier() {
  return (
    <Plot
      data={[
        {
          x: kmData.map(d => d.time), y: kmData.map(d => d.ci_upper),
          type: 'scatter', mode: 'lines',
          line: { color: 'rgba(79,134,198,0)', shape: 'hv' },
          showlegend: false, name: 'CI Upper', hoverinfo: 'skip',
        },
        {
          x: kmData.map(d => d.time), y: kmData.map(d => d.ci_lower),
          type: 'scatter', mode: 'lines',
          line: { color: 'rgba(79,134,198,0)', shape: 'hv' },
          fill: 'tonexty', fillcolor: 'rgba(79,134,198,0.15)',
          name: '95% CI', hoverinfo: 'skip',
        },
        {
          x: kmData.map(d => d.time), y: kmData.map(d => d.survival),
          type: 'scatter', mode: 'lines',
          line: { color: '#4F86C6', width: 2.5, shape: 'hv' },
          name: 'Survival',
          text: kmData.map(d => `At risk: ${d.at_risk}`),
          hovertemplate: 'Time: %{x}mo<br>Survival: %{y:.1%}<br>%{text}<extra></extra>',
        },
      ]}
      layout={{
        xaxis: { title: 'Time (months)', gridcolor: '#E5E7EB', zeroline: false },
        yaxis: { title: 'Survival Probability', tickformat: '.0%', range: [0.5, 1.05], gridcolor: '#E5E7EB' },
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 60, r: 20, t: 20, b: 50 },
        legend: { x: 0.65, y: 0.98 },
        hovermode: 'x unified',
      }}
      config={{ responsive: true, displayModeBar: true, displaylogo: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
