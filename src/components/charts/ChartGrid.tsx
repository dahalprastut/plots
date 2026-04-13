// src/components/charts/ChartGrid.tsx
import { CHART_TYPES } from '@/lib/chart-data'

export function ChartGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CHART_TYPES.map((chart) => (
        <div key={chart.id}>
          <p className="mb-2 text-sm font-semibold text-gray-700">
            {chart.name}
            <span className="ml-2 text-xs font-normal text-gray-400">{chart.priority}</span>
          </p>
          <div className="h-40 rounded-lg border border-dashed border-gray-300 bg-gray-100" />
        </div>
      ))}
    </div>
  )
}
