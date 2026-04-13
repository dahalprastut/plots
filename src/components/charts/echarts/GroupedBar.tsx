'use client'
import dynamic from 'next/dynamic'
import { groupedBarData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 60, right: 20, top: 40, bottom: 60 },
  xAxis: { type: 'category', data: groupedBarData.map(d => d.artery), axisLine: { show: false }, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v: number) => `${v}%` },
  legend: { bottom: 5 },
  series: [
    { name: 'Reintervention', type: 'bar', data: groupedBarData.map(d => d.reintervention_rate), itemStyle: { color: '#E07B54', borderRadius: [4, 4, 0, 0] }, barMaxWidth: 40 },
    { name: 'No Reintervention', type: 'bar', data: groupedBarData.map(d => d.no_reintervention_rate), itemStyle: { color: '#4F86C6', borderRadius: [4, 4, 0, 0] }, barMaxWidth: 40 },
  ],
}

export function GroupedBar() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
