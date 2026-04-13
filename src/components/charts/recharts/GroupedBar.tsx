'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { groupedBarData } from '@/lib/chart-data'

export function GroupedBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={groupedBarData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="artery" tick={{ fill: '#374151', fontSize: 12 }} />
        <YAxis tickFormatter={(v: number) => `${v}%`} tick={{ fill: '#374151', fontSize: 12 }} />
        <Tooltip formatter={(v) => [`${Number(v)}%`]} />
        <Legend verticalAlign="top" />
        <Bar dataKey="reintervention_rate" name="Reintervention" fill="#E07B54" radius={[4, 4, 0, 0]} maxBarSize={50} />
        <Bar dataKey="no_reintervention_rate" name="No Reintervention" fill="#4F86C6" radius={[4, 4, 0, 0]} maxBarSize={50} />
      </BarChart>
    </ResponsiveContainer>
  )
}
