'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { cumulativeIncidenceData } from '@/lib/chart-data'

export function CumulativeIncidence() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={cumulativeIncidenceData} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="time" tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Time (months)', position: 'insideBottom', offset: -15 }} />
        <YAxis domain={[0, 0.35]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
          tick={{ fill: '#374151', fontSize: 12 }} />
        <Tooltip formatter={(v) => [`${(Number(v) * 100).toFixed(1)}%`]} />
        <Legend verticalAlign="top" />
        <Area type="monotone" dataKey="incidence" stroke="#4F86C6" fill="#4F86C6"
          fillOpacity={0.25} name="Reintervention" />
        <Area type="monotone" dataKey="competing" stroke="#E07B54" fill="#E07B54"
          fillOpacity={0.25} name="Amputation (competing)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
