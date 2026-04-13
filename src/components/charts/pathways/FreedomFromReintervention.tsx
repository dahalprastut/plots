'use client'
import dynamic from 'next/dynamic'
import { FreedomFromReinterventionData } from '@/lib/chart-data'

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

export function FreedomFromReintervention({
  arms,
  logRankP,
  timeUnit = 'months',
}: FreedomFromReinterventionData) {
  if (!arms.length) return null
  const timePoints = arms[0].data.map((d) => d.time)

  // Build KM traces: for each arm — CI upper (invisible), CI lower (tonexty fill), survival line
  const kmTraces = arms.flatMap((arm) => [
    {
      x: arm.data.map((d) => d.time),
      y: arm.data.map((d) => d.ci_upper),
      type: 'scatter',
      mode: 'lines',
      line: { color: 'rgba(0,0,0,0)', shape: 'hv' },
      showlegend: false,
      hoverinfo: 'skip',
      xaxis: 'x',
      yaxis: 'y',
    },
    {
      x: arm.data.map((d) => d.time),
      y: arm.data.map((d) => d.ci_lower),
      type: 'scatter',
      mode: 'lines',
      fill: 'tonexty',
      fillcolor: hexToRgba(arm.color, 0.15),
      line: { color: 'rgba(0,0,0,0)', shape: 'hv' },
      showlegend: false,
      hoverinfo: 'skip',
      xaxis: 'x',
      yaxis: 'y',
    },
    {
      x: arm.data.map((d) => d.time),
      y: arm.data.map((d) => d.survival),
      type: 'scatter',
      mode: 'lines',
      name: arm.label,
      line: { color: arm.color, width: 2, shape: 'hv' },
      hovertemplate: `${arm.label}<br>Time: %{x} ${timeUnit}<br>Freedom: %{y:.1%}<extra></extra>`,
      xaxis: 'x',
      yaxis: 'y',
    },
  ])

  // Risk table as a Plotly table trace.
  // cells.values is column-oriented: values[0] = column 0 rows, values[1] = column 1 rows, etc.
  // Column 0: arm labels. Columns 1+: at_risk values at each time point.
  const riskTable = {
    type: 'table',
    domain: { x: [0, 1], y: [0, 0.22] },
    header: {
      values: [`At risk (${timeUnit})`, ...timePoints.map(String)],
      align: 'center',
      fill: { color: '#F9FAFB' },
      font: { size: 11, color: '#6B7280', family: 'system-ui, sans-serif' },
      line: { color: '#E5E7EB', width: 1 },
      height: 24,
    },
    cells: {
      values: [
        arms.map((arm) => arm.label),
        ...timePoints.map((_, i) => arms.map((arm) => arm.data[i].at_risk)),
      ],
      align: ['left', ...timePoints.map(() => 'center')],
      fill: { color: 'white' },
      font: {
        size: 11,
        color: [
          arms.map((arm) => arm.color),                        // Column 0: arm colors
          ...timePoints.map(() => arms.map(() => '#374151')),   // Columns 1+: gray
        ],
        family: 'system-ui, sans-serif',
      },
      line: { color: '#E5E7EB', width: 1 },
      height: 22,
    },
  }

  const pText = logRankP < 0.001 ? 'Log-rank p < 0.001' : `Log-rank p = ${logRankP.toFixed(3)}`

  const layout = {
    height: 520,
    yaxis: {
      domain: [0.3, 1.0],
      title: 'Freedom from Reintervention',
      tickformat: '.0%',
      range: [0, 1.05],
      gridcolor: '#E5E7EB',
      zeroline: false,
    },
    xaxis: {
      title: `Time (${timeUnit})`,
      gridcolor: '#E5E7EB',
      zeroline: false,
    },
    hovermode: 'x unified',
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    margin: { l: 60, r: 20, t: 20, b: 10 },
    legend: {
      x: 0.98,
      y: 0.98,
      xanchor: 'right',
      yanchor: 'top',
      bgcolor: 'rgba(255,255,255,0.85)',
      bordercolor: '#E5E7EB',
      borderwidth: 1,
    },
    annotations: [
      {
        text: pText,
        xref: 'paper',
        yref: 'paper',
        x: 0.98,
        y: 0.32,
        xanchor: 'right',
        yanchor: 'top',
        showarrow: false,
        font: { size: 11, color: '#374151' },
        bgcolor: 'rgba(255,255,255,0.85)',
        bordercolor: '#E5E7EB',
        borderwidth: 1,
        borderpad: 4,
      },
    ],
  }

  return (
    <Plot
      data={[...kmTraces, riskTable]}
      layout={layout}
      config={{ responsive: true, displayModeBar: true, displaylogo: false }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
