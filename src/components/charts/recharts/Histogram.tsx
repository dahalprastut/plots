'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { histogramData } from '@/lib/chart-data'

export function Histogram() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={histogramData} barCategoryGap="2%"
        margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="bin" tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Age Group (years)', position: 'insideBottom', offset: -15 }} />
        <YAxis tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Patient Count', angle: -90, position: 'insideLeft', offset: 15 }} />
        <Tooltip formatter={(v) => [Number(v), 'Patients']} />
        <Bar dataKey="count" name="Patients" fill="#4F86C6" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
