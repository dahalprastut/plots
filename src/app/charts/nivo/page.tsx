'use client'
import { ChartCard } from '@/components/charts/ChartCard'
import { KaplanMeier } from '@/components/charts/nivo/KaplanMeier'
import { GroupedBar } from '@/components/charts/nivo/GroupedBar'
import { ForestPlot } from '@/components/charts/nivo/ForestPlot'
import { BoxPlot } from '@/components/charts/nivo/BoxPlot'
import { Histogram } from '@/components/charts/nivo/Histogram'
import { Donut } from '@/components/charts/nivo/Donut'
import { ScatterPlot } from '@/components/charts/nivo/ScatterPlot'
import { LineArea } from '@/components/charts/nivo/LineArea'
import { StackedBar } from '@/components/charts/nivo/StackedBar'
import { HorizontalBar } from '@/components/charts/nivo/HorizontalBar'
import { Heatmap } from '@/components/charts/nivo/Heatmap'
import { CumulativeIncidence } from '@/components/charts/nivo/CumulativeIncidence'

export default function NivoPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nivo</h1>
        <p className="mt-1 text-gray-500">Narrow candidate for the hospital performance heatmap</p>
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
