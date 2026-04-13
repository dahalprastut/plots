'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { stackedBarData } from '@/lib/chart-data'

export function StackedBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={stackedBarData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="period" tick={{ fill: '#374151', fontSize: 12 }} />
        <YAxis tickFormatter={(v: number) => `${v}%`} tick={{ fill: '#374151', fontSize: 12 }} />
        <Tooltip formatter={(v) => [`${Number(v)}%`]} />
        <Legend verticalAlign="top" />
        <Bar dataKey="current_smoker" name="Current Smoker" stackId="a" fill="#E07B54" />
        <Bar dataKey="former_smoker" name="Former Smoker" stackId="a" fill="#4F86C6" />
        <Bar dataKey="never_smoker" name="Never Smoker" stackId="a" fill="#5BAD6F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
