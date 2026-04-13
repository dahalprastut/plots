import { ChartCard } from '@/components/charts/ChartCard'
import { KaplanMeier } from '@/components/charts/echarts/KaplanMeier'
import { GroupedBar } from '@/components/charts/echarts/GroupedBar'
import { ForestPlot } from '@/components/charts/echarts/ForestPlot'
import { BoxPlot } from '@/components/charts/echarts/BoxPlot'
import { Histogram } from '@/components/charts/echarts/Histogram'
import { Donut } from '@/components/charts/echarts/Donut'
import { ScatterPlot } from '@/components/charts/echarts/ScatterPlot'
import { LineArea } from '@/components/charts/echarts/LineArea'
import { StackedBar } from '@/components/charts/echarts/StackedBar'
import { HorizontalBar } from '@/components/charts/echarts/HorizontalBar'
import { Heatmap } from '@/components/charts/echarts/Heatmap'
import { CumulativeIncidence } from '@/components/charts/echarts/CumulativeIncidence'

export default function EChartsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ECharts</h1>
        <p className="mt-1 text-gray-500">Alternative candidate for large-dataset performance</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard name="Kaplan-Meier Survival Curve" priority="P0"><KaplanMeier /></ChartCard>
        <ChartCard name="Grouped Bar Chart" priority="P0"><GroupedBar /></ChartCard>
        <ChartCard name="Forest Plot (HR + CI)" priority="P0"><ForestPlot /></ChartCard>
        <ChartCard name="Box Plot" priority="P1"><BoxPlot /></ChartCard>
        <ChartCard name="Histogram" priority="P1"><Histogram /></ChartCard>
        <ChartCard name="Donut / Pie Chart" priority="P1"><Donut /></ChartCard>
        <ChartCard name="Scatter Plot" priority="P1"><ScatterPlot /></ChartCard>
        <ChartCard name="Line / Area Chart" priority="P1"><LineArea /></ChartCard>
        <ChartCard name="Stacked Bar Chart" priority="P1"><StackedBar /></ChartCard>
        <ChartCard name="Horizontal Bar (Ranked)" priority="P2"><HorizontalBar /></ChartCard>
        <ChartCard name="Heatmap" priority="P2"><Heatmap /></ChartCard>
        <ChartCard name="Cumulative Incidence Curve" priority="P2"><CumulativeIncidence /></ChartCard>
      </div>
    </>
  )
}
