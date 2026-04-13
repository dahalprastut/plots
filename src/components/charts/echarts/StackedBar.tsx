'use client'
import dynamic from 'next/dynamic'
import { stackedBarData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 55, right: 20, top: 20, bottom: 70 },
  xAxis: { type: 'category', data: stackedBarData.map(d => d.period), axisLine: { show: false }, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v: number) => `${v}%` },
  legend: { bottom: 5 },
  series: [
    { name: 'Current Smoker', type: 'bar', stack: 's', data: stackedBarData.map(d => d.current_smoker), itemStyle: { color: '#E07B54' } },
    { name: 'Former Smoker', type: 'bar', stack: 's', data: stackedBarData.map(d => d.former_smoker), itemStyle: { color: '#4F86C6' } },
    { name: 'Never Smoker', type: 'bar', stack: 's', data: stackedBarData.map(d => d.never_smoker), itemStyle: { color: '#5BAD6F', borderRadius: [4, 4, 0, 0] } },
  ],
}

export function StackedBar() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
