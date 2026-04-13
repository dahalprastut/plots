'use client'
import dynamic from 'next/dynamic'
import { horizontalBarData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function HorizontalBar() {
  const colors = horizontalBarData.map(d => d.site === 'Your Site' ? '#E07B54' : '#4F86C6')
  return (
    <Plot
      data={[{
        x: horizontalBarData.map(d => d.rate),
        y: horizontalBarData.map(d => d.site),
        type: 'bar', orientation: 'h',
        marker: { color: colors },
        hovertemplate: '%{y}: %{x}%<extra></extra>',
        name: 'Reintervention Rate',
      }]}
      layout={{
        xaxis: { title: 'Reintervention Rate (%)', ticksuffix: '%', gridcolor: '#E5E7EB' },
        yaxis: { gridcolor: '#E5E7EB', autorange: 'reversed' },
        shapes: [{
          type: 'line', x0: 13.5, x1: 13.5, y0: -0.5, y1: horizontalBarData.length - 0.5,
          line: { color: '#374151', dash: 'dash', width: 1.5 },
        }],
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 90, r: 30, t: 20, b: 60 },
        showlegend: false,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
