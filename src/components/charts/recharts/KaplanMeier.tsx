'use client'
import {
  ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { kmData } from '@/lib/chart-data'

const data = kmData.map(d => ({
  time: d.time,
  survival: d.survival,
  ci_lower: d.ci_lower,
  ci_band: +(d.ci_upper - d.ci_lower).toFixed(3),
  at_risk: d.at_risk,
}))

export function KaplanMeier() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Time (months)', position: 'insideBottom', offset: -15 }}
        />
        <YAxis
          domain={[0.5, 1]}
          tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
          tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Survival', angle: -90, position: 'insideLeft', offset: 15 }}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === '95% CI') return null
            if (name === 'ci_lower') return null
            return [`${(Number(value) * 100).toFixed(1)}%`, String(name)]
          }}
        />
        <Legend verticalAlign="top" />
        <Area type="stepAfter" dataKey="ci_lower" fill="transparent" stroke="none" stackId="ci" legendType="none" />
        <Area type="stepAfter" dataKey="ci_band" fill="#4F86C6" fillOpacity={0.15} stroke="none" stackId="ci" name="95% CI" />
        <Line type="stepAfter" dataKey="survival" stroke="#4F86C6" strokeWidth={2.5} dot={false} name="Survival Probability" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
