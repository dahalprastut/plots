import { CohortCardData } from '@/lib/chart-data'

export function CohortComparisonCard({ cohortName, n, medianFollowUp, metrics }: CohortCardData) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Top band — cohort identity */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        <p className="mb-2 text-sm font-semibold text-gray-800">{cohortName}</p>
        <div className="flex gap-2">
          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-500">
            N = {n.toLocaleString()}
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-500">
            Median follow-up: {medianFollowUp.toFixed(1)} mo
          </span>
        </div>
      </div>

      {/* Bottom band — outcome metrics */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {metrics.map((metric) => (
          <div key={metric.field} className="group relative rounded-lg border border-gray-100 bg-gray-50 p-3 last:col-span-2">
            <p className="mb-1 text-xs text-gray-500">{metric.label}</p>
            <p className="text-lg font-bold text-gray-900">{metric.value}</p>
            <p className="mt-1 rounded bg-blue-50 px-1 font-mono text-xs text-blue-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {metric.field}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
