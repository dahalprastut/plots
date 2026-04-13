'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, LabelList,
} from 'recharts'
import { forestData } from '@/lib/chart-data'

const data = forestData.map(d => ({
  variable: d.variable,
  base: +d.ci_lower.toFixed(3),
  range: +(d.ci_upper - d.ci_lower).toFixed(3),
  hr: d.hr,
  ci_lower: d.ci_lower,
  ci_upper: d.ci_upper,
  p_value: d.p_value,
}))

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof data[0] }> }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="rounded border bg-white p-2 text-xs shadow">
      <p className="font-bold">{d.variable}</p>
      <p>HR: {d.hr.toFixed(2)}</p>
      <p>95% CI: [{d.ci_lower.toFixed(2)}, {d.ci_upper.toFixed(2)}]</p>
      <p>p = {d.p_value}</p>
    </div>
  )
}

export function ForestPlot() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={data} margin={{ top: 20, right: 60, left: 130, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
        <XAxis type="number" domain={[0.4, 2.4]} tickCount={5} tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Hazard Ratio', position: 'insideBottom', offset: -15 }} />
        <YAxis type="category" dataKey="variable" tick={{ fill: '#374151', fontSize: 11 }} width={125} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x={1} stroke="#374151" strokeDasharray="4 4" label={{ value: 'HR=1', position: 'insideTopRight', fontSize: 10 }} />
        <Bar dataKey="base" stackId="f" fill="transparent" legendType="none" />
        <Bar dataKey="range" stackId="f" fill="#4F86C6" fillOpacity={0.35} name="95% CI" barSize={10} radius={[2, 2, 2, 2]}>
          <LabelList dataKey="hr" position="right" formatter={(v: unknown) => Number(v).toFixed(2)} style={{ fill: '#374151', fontSize: 11 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
