'use client'
import dynamic from 'next/dynamic'
import { stackedBarData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function StackedBar() {
  return (
    <Plot
      data={[
        {
          x: stackedBarData.map(d => d.period),
          y: stackedBarData.map(d => d.current_smoker),
          type: 'bar', name: 'Current Smoker', marker: { color: '#E07B54' },
          hovertemplate: '%{y}%<extra>Current Smoker</extra>',
        },
        {
          x: stackedBarData.map(d => d.period),
          y: stackedBarData.map(d => d.former_smoker),
          type: 'bar', name: 'Former Smoker', marker: { color: '#4F86C6' },
          hovertemplate: '%{y}%<extra>Former Smoker</extra>',
        },
        {
          x: stackedBarData.map(d => d.period),
          y: stackedBarData.map(d => d.never_smoker),
          type: 'bar', name: 'Never Smoker', marker: { color: '#5BAD6F' },
          hovertemplate: '%{y}%<extra>Never Smoker</extra>',
        },
      ]}
      layout={{
        barmode: 'stack',
        xaxis: { title: 'Year', gridcolor: '#E5E7EB' },
        yaxis: { title: 'Proportion (%)', ticksuffix: '%', gridcolor: '#E5E7EB' },
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 60, r: 20, t: 20, b: 60 },
        legend: { orientation: 'h', y: -0.2 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
