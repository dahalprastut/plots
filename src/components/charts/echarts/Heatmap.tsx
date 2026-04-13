'use client'
import dynamic from 'next/dynamic'
import { heatmapData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const ROWS = ['Age', 'Smoking', 'Diabetes']
const COLS = ['Reintervention', 'Amputation', 'Death']

const chartData = ROWS.flatMap((row, ri) =>
  COLS.map((col, ci) => [ci, ri, heatmapData.find(d => d.row === row && d.col === col)?.value ?? 0])
)

const option: any = {
  grid: { left: 80, right: 80, top: 30, bottom: 80 },
  xAxis: { type: 'category', data: COLS, axisLine: { show: false }, splitArea: { show: true } },
  yAxis: { type: 'category', data: ROWS, axisLine: { show: false }, splitArea: { show: true } },
  visualMap: { min: 0, max: 0.6, calculable: true, orient: 'horizontal', left: 'center', bottom: 10,
    inRange: { color: ['rgba(79,134,198,0.1)', '#4F86C6'] } },
  tooltip: { formatter: (params: any) => `${ROWS[params.data[1]]} × ${COLS[params.data[0]]}<br/>r = ${params.data[2].toFixed(2)}` },
  series: [{
    type: 'heatmap',
    data: chartData,
    label: { show: true, formatter: (params: any) => params.data[2].toFixed(2), color: '#fff' },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
    itemStyle: { borderWidth: 3, borderColor: 'white' },
  }],
}

export function Heatmap() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
