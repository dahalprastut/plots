'use client'
import dynamic from 'next/dynamic'
import { forestData } from '@/lib/chart-data'

const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const option: any = {
  grid: { left: 170, right: 80, top: 20, bottom: 55 },
  xAxis: { type: 'value', min: 0.3, max: 2.5, name: 'Hazard Ratio', nameLocation: 'middle', nameGap: 35, splitLine: { lineStyle: { color: '#E5E7EB' } } },
  yAxis: { type: 'category', data: forestData.map(d => d.variable), axisLine: { show: false }, axisTick: { show: false }, inverse: true },
  tooltip: { trigger: 'item', formatter: (params: any) => {
    const d = forestData[params.dataIndex]
    return `<b>${d.variable}</b><br/>HR: ${d.hr.toFixed(2)}<br/>95% CI: [${d.ci_lower.toFixed(2)}, ${d.ci_upper.toFixed(2)}]<br/>p = ${d.p_value}`
  }},
  series: [
    {
      name: 'CI Base', type: 'bar', stack: 'f',
      data: forestData.map(d => d.ci_lower),
      itemStyle: { color: 'transparent' },
      emphasis: { disabled: true },
    },
    {
      name: '95% CI', type: 'bar', stack: 'f',
      data: forestData.map(d => +(d.ci_upper - d.ci_lower).toFixed(3)),
      itemStyle: { color: 'rgba(79,134,198,0.4)', borderRadius: 2 },
      barMaxWidth: 14,
      markLine: {
        silent: true,
        lineStyle: { type: 'dashed', color: '#374151' },
        data: [{ xAxis: 1, name: 'HR=1' }],
        label: { formatter: 'HR=1', position: 'insideEndTop', fontSize: 10 },
      },
      markPoint: {
        symbol: 'diamond', symbolSize: 12,
        data: forestData.map((d, i) => ({ coord: [d.hr, i], itemStyle: { color: '#4F86C6' } })),
        label: { show: false },
      },
    },
  ],
}

export function ForestPlot() {
  return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
