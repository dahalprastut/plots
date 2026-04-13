import { ChartGrid } from '@/components/charts'

export default function PlotlyPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plotly</h1>
        <p className="mt-1 text-gray-500">
          Specialist candidate for KM survival curves and forest plots
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
