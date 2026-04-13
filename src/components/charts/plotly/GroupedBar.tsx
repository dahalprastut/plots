'use client'
import dynamic from 'next/dynamic'
import { groupedBarData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any

export function GroupedBar() {
  return (
    <Plot
      data={[
        {
          x: groupedBarData.map(d => d.artery),
          y: groupedBarData.map(d => d.reintervention_rate),
          type: 'bar', name: 'Reintervention', marker: { color: '#E07B54' },
          hovertemplate: '%{y}%<extra>Reintervention</extra>',
        },
        {
          x: groupedBarData.map(d => d.artery),
          y: groupedBarData.map(d => d.no_reintervention_rate),
          type: 'bar', name: 'No Reintervention', marker: { color: '#4F86C6' },
          hovertemplate: '%{y}%<extra>No Reintervention</extra>',
        },
      ]}
      layout={{
        barmode: 'group',
        xaxis: { title: 'Artery Type', gridcolor: '#E5E7EB' },
        yaxis: { title: 'Rate (%)', ticksuffix: '%', gridcolor: '#E5E7EB' },
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
