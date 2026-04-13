'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { donutData } from '@/lib/chart-data'

const COLORS = ['#4F86C6', '#E07B54', '#5BAD6F', '#9B6DD6']

export function Donut() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={donutData}
          cx="50%" cy="50%"
          innerRadius="45%" outerRadius="70%"
          dataKey="value" nameKey="label"
          paddingAngle={3}
          label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
          labelLine
        >
          {donutData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${Number(v)}%`, 'Share']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
