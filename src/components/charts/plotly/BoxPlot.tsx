'use client'
import dynamic from 'next/dynamic'
import { boxPlotData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function BoxPlot() {
  return (
    <Plot
      data={boxPlotData.map(d => ({
        type: 'box',
        name: d.group,
        q1: [d.q1], median: [d.median], q3: [d.q3],
        lowerfence: [d.min], upperfence: [d.max],
        marker: { color: '#4F86C6' },
        fillcolor: 'rgba(79,134,198,0.3)',
        line: { color: '#4F86C6' },
      }))}
      layout={{
        yaxis: { title: 'Follow-up Duration (months)', gridcolor: '#E5E7EB' },
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
