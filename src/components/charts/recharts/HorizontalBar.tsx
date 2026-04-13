'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { horizontalBarData } from '@/lib/chart-data'

export function HorizontalBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={horizontalBarData}
        margin={{ top: 20, right: 50, left: 70, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
        <XAxis type="number" tickFormatter={(v: number) => `${v}%`} tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Reintervention Rate', position: 'insideBottom', offset: -15 }} />
        <YAxis type="category" dataKey="site" tick={{ fill: '#374151', fontSize: 12 }} width={65} />
        <Tooltip formatter={(v) => [`${Number(v)}%`, 'Rate']} />
        <ReferenceLine x={13.5} stroke="#374151" strokeDasharray="4 4" />
        <Bar dataKey="rate" name="Rate" radius={[0, 4, 4, 0]}>
          {horizontalBarData.map((entry, i) => (
            <Cell key={i} fill={entry.site === 'Your Site' ? '#E07B54' : '#4F86C6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
