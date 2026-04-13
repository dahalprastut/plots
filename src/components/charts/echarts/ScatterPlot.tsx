'use client'
import dynamic from 'next/dynamic'
import { scatterData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 65, right: 30, top: 20, bottom: 60 },
  xAxis: { type: 'value', name: 'Age (years)', nameLocation: 'middle', nameGap: 35, min: 44, max: 88, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  yAxis: { type: 'value', name: 'Follow-up (months)', nameLocation: 'middle', nameGap: 55, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  tooltip: { trigger: 'item', formatter: (params: any) => `${scatterData[params.dataIndex].label}<br/>Age: ${params.data[0]}yr — Follow-up: ${params.data[1]}mo` },
  toolbox: { feature: { dataZoom: { show: true }, restore: {} } },
  series: [{
    type: 'scatter',
    data: scatterData.map(d => [d.x, d.y]),
    symbolSize: 9,
    itemStyle: { color: '#4F86C6', opacity: 0.7 },
    emphasis: { itemStyle: { opacity: 1, symbolSize: 12 } },
  }],
}

export function ScatterPlot() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
