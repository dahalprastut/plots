import { ChartGrid } from '@/components/charts'

export default function RechartsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recharts</h1>
        <p className="mt-1 text-gray-500">
          Composable JSX charts — primary candidate for standard chart types
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
