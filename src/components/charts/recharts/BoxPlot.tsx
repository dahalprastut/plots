'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { boxPlotData } from '@/lib/chart-data'

const data = boxPlotData.map(d => ({
  group: d.group,
  floor: d.min,
  lowerWhisker: d.q1 - d.min,
  lowerBox: d.median - d.q1,
  upperBox: d.q3 - d.median,
  upperWhisker: d.max - d.q3,
  min: d.min, q1: d.q1, median: d.median, q3: d.q3, max: d.max,
}))

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof data[0] }> }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="rounded border bg-white p-2 text-xs shadow">
      <p className="font-bold">{d.group}</p>
      <p>Max: {d.max}</p>
      <p>Q3: {d.q3}</p>
      <p>Median: {d.median}</p>
      <p>Q1: {d.q1}</p>
      <p>Min: {d.min}</p>
    </div>
  )
}

export function BoxPlot() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barCategoryGap="35%" margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="group" tick={{ fill: '#374151', fontSize: 12 }} />
        <YAxis tick={{ fill: '#374151', fontSize: 12 }}
          label={{ value: 'Months', angle: -90, position: 'insideLeft', offset: 15 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="floor" stackId="box" fill="transparent" legendType="none" />
        <Bar dataKey="lowerWhisker" stackId="box" fill="#93C5FD" name="Lower Whisker" />
        <Bar dataKey="lowerBox" stackId="box" fill="#4F86C6" name="Lower IQR" />
        <Bar dataKey="upperBox" stackId="box" fill="#4F86C6" name="Upper IQR" />
        <Bar dataKey="upperWhisker" stackId="box" fill="#93C5FD" name="Upper Whisker" />
      </BarChart>
    </ResponsiveContainer>
  )
}
