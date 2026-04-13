'use client'
import dynamic from 'next/dynamic'
import { horizontalBarData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 90, right: 60, top: 20, bottom: 55 },
  xAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, name: 'Reintervention Rate (%)', nameLocation: 'middle', nameGap: 35, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  yAxis: { type: 'category', data: horizontalBarData.map(d => d.site), inverse: false, axisLine: { show: false }, axisTick: { show: false } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v: number) => `${v}%` },
  series: [{
    type: 'bar',
    data: horizontalBarData.map(d => ({
      value: d.rate,
      itemStyle: { color: d.site === 'Your Site' ? '#E07B54' : '#4F86C6', borderRadius: [0, 4, 4, 0] },
    })),
    label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11 },
    markLine: {
      silent: true,
      lineStyle: { type: 'dashed', color: '#374151' },
      data: [{ xAxis: 13.5 }],
      label: { formatter: 'Your Site avg', fontSize: 10 },
    },
  }],
}

export function HorizontalBar() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
