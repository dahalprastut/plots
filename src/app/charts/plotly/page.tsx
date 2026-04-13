import { ChartCard } from '@/components/charts/ChartCard'
import { KaplanMeier } from '@/components/charts/plotly/KaplanMeier'
import { GroupedBar } from '@/components/charts/plotly/GroupedBar'
import { ForestPlot } from '@/components/charts/plotly/ForestPlot'
import { BoxPlot } from '@/components/charts/plotly/BoxPlot'
import { Histogram } from '@/components/charts/plotly/Histogram'
import { Donut } from '@/components/charts/plotly/Donut'
import { ScatterPlot } from '@/components/charts/plotly/ScatterPlot'
import { LineArea } from '@/components/charts/plotly/LineArea'
import { StackedBar } from '@/components/charts/plotly/StackedBar'
import { HorizontalBar } from '@/components/charts/plotly/HorizontalBar'
import { Heatmap } from '@/components/charts/plotly/Heatmap'
import { CumulativeIncidence } from '@/components/charts/plotly/CumulativeIncidence'

export default function PlotlyPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plotly</h1>
        <p className="mt-1 text-gray-500">Specialist candidate for KM survival curves and forest plots</p>
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
