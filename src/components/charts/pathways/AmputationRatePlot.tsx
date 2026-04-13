'use client'
import dynamic from 'next/dynamic'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { AmputationKmData, AmputationBarData } from '@/lib/chart-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded bg-gray-100" />,
}) as any

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function AmputationKm({ arms, logRankP }: AmputationKmData) {
  if (!arms.length) return null

  const pText = logRankP != null && logRankP < 0.001
    ? 'Log-rank p < 0.001'
    : logRankP != null
      ? `Log-rank p = ${logRankP.toFixed(3)}`
      : null

  const kmTraces = arms.flatMap((arm) => [
    {
      x: arm.data.map((d) => d.time),
      y: arm.data.map((d) => d.ci_upper),
      type: 'scatter', mode: 'lines',
      line: { color: 'rgba(0,0,0,0)', shape: 'hv' },
      showlegend: false, hoverinfo: 'skip',
    },
    {
      x: arm.data.map((d) => d.time),
      y: arm.data.map((d) => d.ci_lower),
      type: 'scatter', mode: 'lines',
      fill: 'tonexty',
      fillcolor: hexToRgba(arm.color, 0.15),
      line: { color: 'rgba(0,0,0,0)', shape: 'hv' },
      showlegend: false, hoverinfo: 'skip',
    },
    {
      x: arm.data.map((d) => d.time),
      y: arm.data.map((d) => d.survival),
      type: 'scatter', mode: 'lines',
      name: arm.label,
      line: { color: arm.color, width: 2, shape: 'hv' },
      hovertemplate: `${arm.label}<br>Time: %{x} months<br>Freedom from amputation: %{y:.1%}<extra></extra>`,
    },
  ])

  const annotations = pText ? [{
    text: pText,
    xref: 'paper', yref: 'paper',
    x: 0.98, y: 0.05,
    xanchor: 'right', yanchor: 'bottom',
    showarrow: false,
    font: { size: 11, color: '#374151' },
    bgcolor: 'rgba(255,255,255,0.85)',
    bordercolor: '#E5E7EB', borderwidth: 1, borderpad: 4,
  }] : []

  return (
    <Plot
      data={kmTraces}
      layout={{
        yaxis: { title: 'Freedom from Amputation', tickformat: '.0%', range: [0.7, 1.02], gridcolor: '#E5E7EB', zeroline: false },
        xaxis: { title: 'Time (months)', gridcolor: '#E5E7EB', zeroline: false },
        hovermode: 'x unified',
        plot_bgcolor: 'white', paper_bgcolor: 'white',
        margin: { l: 60, r: 20, t: 20, b: 50 },
        legend: { x: 0.98, y: 0.98, xanchor: 'right', yanchor: 'top', bgcolor: 'rgba(255,255,255,0.85)', bordercolor: '#E5E7EB', borderwidth: 1 },
        annotations,
      }}
      config={{ responsive: true, displayModeBar: true, displaylogo: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}

function AmputationBar({ cohorts }: AmputationBarData) {
  if (!cohorts.length) return null
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={cohorts} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#374151' }} />
        <YAxis
          label={{ value: 'Amputation Rate (%)', angle: -90, position: 'insideLeft', offset: -10, style: { fontSize: 12, fill: '#374151' } }}
          tickFormatter={(v) => `${Number(v).toFixed(1)}%`}
          tick={{ fontSize: 12, fill: '#374151' }}
        />
        <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`]} />
        <Legend />
        <Bar dataKey="right" name="Right limb (LTF_AMP_R)" fill="#4F86C6" radius={[3, 3, 0, 0]} />
        <Bar dataKey="left"  name="Left limb (LTF_AMP_L)"  fill="#E07B54" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AmputationRatePlot(props: AmputationKmData | AmputationBarData) {
  if (props.variant === 'km') return <AmputationKm {...props} />
  return <AmputationBar {...props} />
}
