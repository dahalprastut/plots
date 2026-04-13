// src/app/charts/d3/page.tsx
import { ChartCard } from '@/components/charts/ChartCard'
import { KaplanMeier, FreedomFromReintervention, CumulativeIncidence } from '@/components/charts/d3'
import { freedomFromReinterventionData } from '@/lib/chart-data'

export default function D3Page() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">D3 — KM-Family Charts</h1>
        <p className="mt-1 text-gray-500">
          Custom survival curves: censoring ticks, animated drawing, coordinated risk tables
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard name="Kaplan-Meier Survival Curve" priority="P0" height="h-[460px]">
          <KaplanMeier />
        </ChartCard>
        <ChartCard name="Freedom from Reintervention" priority="P0" height="h-[500px]">
          <FreedomFromReintervention {...freedomFromReinterventionData} />
        </ChartCard>
        <ChartCard name="Cumulative Incidence Curve" priority="P2" height="h-[400px]">
          <CumulativeIncidence />
        </ChartCard>
      </div>
    </>
  )
}
