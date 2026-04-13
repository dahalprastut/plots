import { ChartGrid } from '@/components/charts'

export default function NivoPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nivo</h1>
        <p className="mt-1 text-gray-500">
          Narrow candidate for the hospital performance heatmap
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
