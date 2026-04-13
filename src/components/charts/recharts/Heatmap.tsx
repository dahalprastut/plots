'use client'
import { heatmapData } from '@/lib/chart-data'

const ROWS = ['Age', 'Smoking', 'Diabetes']
const COLS = ['Reintervention', 'Amputation', 'Death']

export function Heatmap() {
  const get = (row: string, col: string) =>
    heatmapData.find(d => d.row === row && d.col === col)?.value ?? 0

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
      <p className="text-xs font-medium text-gray-500">Correlation Coefficient (r)</p>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="w-24" />
            {COLS.map(col => (
              <th key={col} className="px-3 pb-2 text-xs font-medium text-gray-600">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(row => (
            <tr key={row}>
              <td className="pr-4 text-right text-xs font-medium text-gray-600">{row}</td>
              {COLS.map(col => {
                const val = get(row, col)
                return (
                  <td key={col} className="p-1">
                    <div
                      title={`${row} × ${col}: ${val}`}
                      className="flex h-16 w-28 cursor-default items-center justify-center rounded text-sm font-bold text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: `rgba(79,134,198,${0.2 + Math.min(1, Math.max(0, val)) * 0.8})` }}
                    >
                      {val.toFixed(2)}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Low</span>
        <div className="h-2 w-32 rounded" style={{ background: 'linear-gradient(to right, rgba(79,134,198,0.2), rgba(79,134,198,1))' }} />
        <span className="text-xs text-gray-400">High</span>
      </div>
    </div>
  )
}
