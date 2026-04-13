'use client'
import dynamic from 'next/dynamic'
import { forestData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function ForestPlot() {
  return (
    <Plot
      data={[
        {
          x: forestData.map(d => d.hr),
          y: forestData.map(d => d.variable),
          type: 'scatter', mode: 'markers',
          marker: { color: '#4F86C6', size: 10, symbol: 'diamond' },
          error_x: {
            type: 'data',
            symmetric: false,
            array: forestData.map(d => d.ci_upper - d.hr),
            arrayminus: forestData.map(d => d.hr - d.ci_lower),
            color: '#4F86C6', thickness: 2, width: 6,
          },
          hovertemplate: '<b>%{y}</b><br>HR: %{x:.2f}<extra></extra>',
          name: 'HR (95% CI)',
        },
      ]}
      layout={{
        xaxis: { title: 'Hazard Ratio', range: [0.4, 2.4], gridcolor: '#E5E7EB', zeroline: false },
        yaxis: { autorange: 'reversed', gridcolor: '#E5E7EB' },
        shapes: [{
          type: 'line', x0: 1, x1: 1, y0: -0.5, y1: forestData.length - 0.5,
          line: { color: '#374151', dash: 'dash', width: 1.5 },
        }],
        annotations: [{ x: 1, y: -0.5, text: 'HR=1', showarrow: false, yanchor: 'bottom', font: { size: 10 } }],
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 160, r: 60, t: 20, b: 60 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
