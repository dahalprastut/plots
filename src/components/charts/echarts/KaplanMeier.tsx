'use client'
import dynamic from 'next/dynamic'
import { kmData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 65, right: 30, top: 30, bottom: 55 },
  xAxis: { type: 'value', name: 'Time (months)', nameLocation: 'middle', nameGap: 35, min: 0, max: 36, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  yAxis: { type: 'value', name: 'Survival Probability', nameLocation: 'middle', nameGap: 55, min: 0.5, max: 1.05, axisLabel: { formatter: (v: number) => `${(v * 100).toFixed(0)}%` }, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }, formatter: (params: any[]) => {
    const p = params.find((p: any) => p.seriesName === 'Survival')
    return p ? `Time: ${p.data[0]}mo<br/>Survival: ${(p.data[1] * 100).toFixed(1)}%` : ''
  }},
  legend: { right: 10, top: 5 },
  series: [
    {
      name: 'CI Lower',
      type: 'line', step: 'end',
      data: kmData.map(d => [d.time, d.ci_lower]),
      lineStyle: { opacity: 0 }, areaStyle: { color: 'transparent' },
      stack: 'ci', symbol: 'none', legendHoverLink: false,
      tooltip: { show: false },
    },
    {
      name: '95% CI',
      type: 'line', step: 'end',
      data: kmData.map(d => [d.time, +(d.ci_upper - d.ci_lower).toFixed(3)]),
      lineStyle: { opacity: 0 }, areaStyle: { color: 'rgba(79,134,198,0.2)' },
      stack: 'ci', symbol: 'none',
    },
    {
      name: 'Survival',
      type: 'line', step: 'end',
      data: kmData.map(d => [d.time, d.survival]),
      lineStyle: { color: '#4F86C6', width: 2.5 },
      itemStyle: { color: '#4F86C6' }, symbol: 'none',
    },
  ],
}

export function KaplanMeier() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
