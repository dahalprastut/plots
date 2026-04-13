'use client'
import dynamic from 'next/dynamic'
import { histogramData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 65, right: 20, top: 20, bottom: 60 },
  xAxis: { type: 'category', data: histogramData.map(d => d.bin), name: 'Age Group (years)', nameLocation: 'middle', nameGap: 40, axisLine: { show: false }, axisTick: { show: false } },
  yAxis: { type: 'value', name: 'Patient Count', nameLocation: 'middle', nameGap: 50, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params: any[]) => `Age ${params[0].name}: ${params[0].value} patients` },
  series: [{
    type: 'bar',
    data: histogramData.map(d => d.count),
    itemStyle: { color: '#4F86C6', borderRadius: [3, 3, 0, 0] },
    barCategoryGap: '5%',
  }],
}

export function Histogram() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
