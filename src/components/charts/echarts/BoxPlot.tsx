'use client'
import dynamic from 'next/dynamic'
import { boxPlotData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 60, right: 20, top: 30, bottom: 55 },
  xAxis: { type: 'category', data: boxPlotData.map(d => d.group), axisLine: { show: false }, axisTick: { show: false } },
  yAxis: { type: 'value', name: 'Months', splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'item', formatter: (params: any) => {
    const d = boxPlotData[params.dataIndex]
    return `<b>${d.group}</b><br/>Max: ${d.max}<br/>Q3: ${d.q3}<br/>Median: ${d.median}<br/>Q1: ${d.q1}<br/>Min: ${d.min}`
  }},
  series: [{
    name: 'Box Plot', type: 'boxplot',
    data: boxPlotData.map(d => [d.min, d.q1, d.median, d.q3, d.max]),
    itemStyle: { color: 'rgba(79,134,198,0.3)', borderColor: '#4F86C6', borderWidth: 2 },
    boxWidth: ['20%', '45%'],
  }],
}

export function BoxPlot() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
