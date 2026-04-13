import { ChartGrid } from '@/components/charts'

export default function D3Page() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">D3</h1>
        <p className="mt-1 text-gray-500">
          Custom visualization experiments — higher bar, higher reward
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
