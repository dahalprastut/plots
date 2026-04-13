'use client'
import dynamic from 'next/dynamic'
import { cumulativeIncidenceData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 70, right: 20, top: 40, bottom: 60 },
  xAxis: { type: 'value', name: 'Time (months)', nameLocation: 'middle', nameGap: 35, min: 0, max: 36, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  yAxis: { type: 'value', name: 'Cumulative Incidence', nameLocation: 'middle', nameGap: 55, axisLabel: { formatter: (v: number) => `${(v * 100).toFixed(0)}%` }, max: 0.35, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }, valueFormatter: (v: number) => `${(v * 100).toFixed(1)}%` },
  legend: { top: 5 },
  dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 10, height: 20 }],
  series: [
    {
      name: 'Reintervention', type: 'line',
      data: cumulativeIncidenceData.map(d => [d.time, d.incidence]),
      lineStyle: { color: '#4F86C6', width: 2.5 }, itemStyle: { color: '#4F86C6' },
      areaStyle: { color: 'rgba(79,134,198,0.2)' }, symbol: 'circle', symbolSize: 6,
    },
    {
      name: 'Amputation (competing)', type: 'line',
      data: cumulativeIncidenceData.map(d => [d.time, d.competing]),
      lineStyle: { color: '#E07B54', width: 2.5 }, itemStyle: { color: '#E07B54' },
      areaStyle: { color: 'rgba(224,123,84,0.2)' }, symbol: 'circle', symbolSize: 6,
    },
  ],
}

export function CumulativeIncidence() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
