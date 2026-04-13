'use client'
import dynamic from 'next/dynamic'
import { donutData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
  legend: { bottom: 5, orient: 'horizontal' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    avoidLabelOverlap: true,
    itemStyle: { borderRadius: 4, borderColor: 'white', borderWidth: 2 },
    label: { show: true, formatter: '{b}\n{d}%' },
    emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
    data: donutData.map((d, i) => ({
      name: d.label, value: d.value,
      itemStyle: { color: ['#4F86C6', '#E07B54', '#5BAD6F', '#9B6DD6'][i] },
    })),
  }],
}

export function Donut() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
