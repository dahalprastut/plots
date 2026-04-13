import { ChartCard } from '@/components/charts/ChartCard'
import { CohortComparisonCard, FreedomFromReintervention, AmputationRatePlot } from '@/components/charts/pathways'
import { KaplanMeier } from '@/components/charts/plotly/KaplanMeier'
import { GroupedBar } from '@/components/charts/recharts/GroupedBar'
import { ScatterPlot } from '@/components/charts/recharts/ScatterPlot'
import { LineArea } from '@/components/charts/recharts/LineArea'
import {
  cohortCardData,
  freedomFromReinterventionData,
  amputationKmData,
  amputationBarData,
} from '@/lib/chart-data'

export default function P0Page() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">P0 Charts</h1>
        <p className="mt-1 text-gray-500">
          Production-stack components — Plotly for survival curves, Recharts for comparison charts
        </p>
      </div>

      {/* Cohort summary cards */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Cohort Summary
      </h2>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {cohortCardData.map((card) => (
          <CohortComparisonCard key={card.cohortName} {...card} />
        ))}
      </div>

      {/* P0 chart grid */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
        P0 Charts
      </h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard name="Kaplan-Meier Survival Curve" priority="P0">
          <KaplanMeier />
        </ChartCard>

        <ChartCard name="Freedom from Reintervention" priority="P0" height="h-[520px]">
          <FreedomFromReintervention {...freedomFromReinterventionData} />
        </ChartCard>

        <ChartCard name="Grouped Bar Chart" priority="P0">
          <GroupedBar />
        </ChartCard>

        <ChartCard name="Amputation Rate — Time-to-Event" priority="P0">
          <AmputationRatePlot {...amputationKmData} />
        </ChartCard>

        <ChartCard name="Correlation / Scatter Plot" priority="P0">
          <ScatterPlot />
        </ChartCard>

        <ChartCard name="Amputation Rate — By Cohort" priority="P0">
          <AmputationRatePlot {...amputationBarData} />
        </ChartCard>

        <ChartCard name="Trend Over Time / Line Chart" priority="P0">
          <LineArea />
        </ChartCard>
      </div>
    </>
  )
}
