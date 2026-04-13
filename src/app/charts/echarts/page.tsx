import { ChartGrid } from '@/components/charts'

export default function EChartsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ECharts</h1>
        <p className="mt-1 text-gray-500">
          Alternative candidate for large-dataset performance
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
