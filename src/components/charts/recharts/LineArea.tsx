'use client'
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { lineData } from '@/lib/chart-data'

export function LineArea() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={lineData} margin={{ top: 20, right: 30, left: 10, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fill: '#374151', fontSize: 11 }} angle={-40} textAnchor="end" interval={0} />
        <YAxis domain={[5, 9]} tickFormatter={(v: number) => `${v}%`} tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Amputation Rate', angle: -90, position: 'insideLeft', offset: 15 }} />
        <Tooltip formatter={(v) => [`${Number(v)}%`, 'Amputation Rate']} />
        <Legend verticalAlign="top" />
        <Area type="monotone" dataKey="value" fill="#4F86C6" fillOpacity={0.12} stroke="none" />
        <Line type="monotone" dataKey="value" stroke="#4F86C6" strokeWidth={2.5}
          dot={{ r: 4, fill: '#4F86C6' }} activeDot={{ r: 6 }} name="Amputation Rate" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
