type Priority = 'P0' | 'P1' | 'P2'

const priorityColors: Record<Priority, string> = {
  P0: 'bg-red-100 text-red-700',
  P1: 'bg-amber-100 text-amber-700',
  P2: 'bg-gray-100 text-gray-500',
}

export function ChartCard({
  name,
  priority,
  children,
  height = 'h-[400px]',
}: {
  name: string
  priority: Priority
  children: React.ReactNode
  height?: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <div className={height}>{children}</div>
    </div>
  )
}
