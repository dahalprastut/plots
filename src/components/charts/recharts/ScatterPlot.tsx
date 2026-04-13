'use client'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { scatterData } from '@/lib/chart-data'

export function ScatterPlot() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="x" name="Age" type="number" domain={[44, 88]}
          tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Age (years)', position: 'insideBottom', offset: -15 }} />
        <YAxis dataKey="y" name="Follow-up" type="number"
          tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Follow-up (months)', angle: -90, position: 'insideLeft', offset: 15 }} />
        <ZAxis range={[50, 50]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }}
          formatter={(v, name) => [Number(v), name === 'x' ? 'Age' : 'Follow-up (mo)']} />
        <Scatter data={scatterData} fill="#4F86C6" fillOpacity={0.7} name="Patients" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
