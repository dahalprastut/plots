'use client'
import dynamic from 'next/dynamic'
import { lineData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 65, right: 20, top: 20, bottom: 75 },
  xAxis: { type: 'category', data: lineData.map(d => d.date), axisLabel: { rotate: 35 }, axisLine: { show: false }, axisTick: { show: false } },
  yAxis: { type: 'value', min: 5, max: 9, axisLabel: { formatter: '{value}%' }, name: 'Amputation Rate (%)', nameLocation: 'middle', nameGap: 55, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
  series: [{
    type: 'line',
    data: lineData.map(d => d.value),
    smooth: false,
    lineStyle: { color: '#4F86C6', width: 2.5 },
    itemStyle: { color: '#4F86C6' },
    areaStyle: { color: 'rgba(79,134,198,0.12)' },
    symbol: 'circle', symbolSize: 7,
  }],
}

export function LineArea() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
