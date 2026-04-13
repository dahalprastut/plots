// src/lib/chart-data.ts

// ── Chart type registry ────────────────────────────────────────────────────────

export const CHART_TYPES = [
  { id: 'km',             name: 'Kaplan-Meier Survival Curve',  priority: 'P0' },
  { id: 'grouped-bar',    name: 'Grouped Bar Chart',             priority: 'P0' },
  { id: 'forest',         name: 'Forest Plot (HR + CI)',          priority: 'P0' },
  { id: 'box',            name: 'Box Plot',                       priority: 'P1' },
  { id: 'histogram',      name: 'Histogram',                      priority: 'P1' },
  { id: 'donut',          name: 'Donut / Pie Chart',              priority: 'P1' },
  { id: 'scatter',        name: 'Scatter Plot',                   priority: 'P1' },
  { id: 'line',           name: 'Line / Area Chart',              priority: 'P1' },
  { id: 'stacked-bar',    name: 'Stacked Bar Chart',              priority: 'P1' },
  { id: 'horizontal-bar', name: 'Horizontal Bar (Ranked)',        priority: 'P2' },
  { id: 'heatmap',        name: 'Heatmap',                        priority: 'P2' },
  { id: 'cumulative',     name: 'Cumulative Incidence Curve',     priority: 'P2' },
] as const

// ── Kaplan-Meier survival curve ────────────────────────────────────────────────

export type KmDatum = {
  time: number
  survival: number
  ci_lower: number
  ci_upper: number
  at_risk: number
}

export const kmData: KmDatum[] = [
  { time: 0,  survival: 1.00, ci_lower: 1.00, ci_upper: 1.00, at_risk: 500 },
  { time: 6,  survival: 0.92, ci_lower: 0.89, ci_upper: 0.95, at_risk: 460 },
  { time: 12, survival: 0.85, ci_lower: 0.81, ci_upper: 0.89, at_risk: 425 },
  { time: 18, survival: 0.79, ci_lower: 0.74, ci_upper: 0.84, at_risk: 390 },
  { time: 24, survival: 0.73, ci_lower: 0.68, ci_upper: 0.78, at_risk: 350 },
  { time: 30, survival: 0.68, ci_lower: 0.62, ci_upper: 0.74, at_risk: 280 },
  { time: 36, survival: 0.64, ci_lower: 0.58, ci_upper: 0.70, at_risk: 210 },
]

// ── Grouped bar chart ──────────────────────────────────────────────────────────

export type GroupedBarDatum = {
  artery: string
  reintervention_rate: number
  no_reintervention_rate: number
}

export const groupedBarData: GroupedBarDatum[] = [
  { artery: 'Femoral',   reintervention_rate: 18.2, no_reintervention_rate: 81.8 },
  { artery: 'Popliteal', reintervention_rate: 14.7, no_reintervention_rate: 85.3 },
  { artery: 'Tibial',    reintervention_rate: 22.1, no_reintervention_rate: 77.9 },
  { artery: 'Iliac',     reintervention_rate:  9.4, no_reintervention_rate: 90.6 },
]

// ── Forest plot (HR + CI) ──────────────────────────────────────────────────────

export type ForestDatum = {
  variable: string
  hr: number
  ci_lower: number
  ci_upper: number
  p_value: number
}

export const forestData: ForestDatum[] = [
  { variable: 'Age > 70',           hr: 1.42, ci_lower: 1.18, ci_upper: 1.71, p_value: 0.001 },
  { variable: 'Current smoker',     hr: 1.31, ci_lower: 1.09, ci_upper: 1.58, p_value: 0.004 },
  { variable: 'Diabetes',           hr: 1.24, ci_lower: 1.03, ci_upper: 1.49, p_value: 0.024 },
  { variable: 'Prior intervention', hr: 1.67, ci_lower: 1.38, ci_upper: 2.02, p_value: 0.001 },
  { variable: 'Statin use',         hr: 0.78, ci_lower: 0.64, ci_upper: 0.95, p_value: 0.012 },
]

// ── Box plot ───────────────────────────────────────────────────────────────────

export type BoxDatum = {
  group: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

export const boxPlotData: BoxDatum[] = [
  { group: 'Angioplasty', min: 3,  q1: 12, median: 24, q3: 36, max: 60 },
  { group: 'Stenting',    min: 6,  q1: 15, median: 28, q3: 42, max: 60 },
  { group: 'Bypass',      min: 12, q1: 24, median: 36, q3: 48, max: 60 },
  { group: 'Atherectomy', min: 3,  q1: 10, median: 20, q3: 32, max: 58 },
]

// ── Histogram ─────────────────────────────────────────────────────────────────

export type HistogramDatum = {
  bin: string
  count: number
}

export const histogramData: HistogramDatum[] = [
  { bin: '40-49', count:  89 },
  { bin: '50-59', count: 218 },
  { bin: '60-69', count: 412 },
  { bin: '70-79', count: 523 },
  { bin: '80-89', count: 287 },
  { bin: '90+',   count:  71 },
]

// ── Donut / pie chart ──────────────────────────────────────────────────────────

export type DonutDatum = {
  label: string
  value: number
}

export const donutData: DonutDatum[] = [
  { label: 'Angioplasty', value: 38 },
  { label: 'Stenting',    value: 31 },
  { label: 'Bypass',      value: 17 },
  { label: 'Atherectomy', value: 14 },
]

// ── Scatter plot ───────────────────────────────────────────────────────────────

export type ScatterDatum = {
  x: number
  y: number
  label: string
}

export const scatterData: ScatterDatum[] = [
  { x: 52, y: 14, label: 'Patient 1'  },
  { x: 67, y: 28, label: 'Patient 2'  },
  { x: 71, y: 42, label: 'Patient 3'  },
  { x: 58, y:  7, label: 'Patient 4'  },
  { x: 63, y: 35, label: 'Patient 5'  },
  { x: 75, y: 51, label: 'Patient 6'  },
  { x: 49, y: 19, label: 'Patient 7'  },
  { x: 82, y: 56, label: 'Patient 8'  },
  { x: 55, y: 31, label: 'Patient 9'  },
  { x: 70, y: 22, label: 'Patient 10' },
  { x: 66, y: 45, label: 'Patient 11' },
  { x: 78, y: 38, label: 'Patient 12' },
  { x: 61, y: 12, label: 'Patient 13' },
  { x: 73, y: 59, label: 'Patient 14' },
  { x: 57, y: 27, label: 'Patient 15' },
  { x: 84, y: 44, label: 'Patient 16' },
  { x: 69, y: 33, label: 'Patient 17' },
  { x: 53, y:  8, label: 'Patient 18' },
  { x: 76, y: 47, label: 'Patient 19' },
  { x: 64, y: 23, label: 'Patient 20' },
]

// ── Line / area chart ──────────────────────────────────────────────────────────

export type LineDatum = {
  date: string
  value: number
}

export const lineData: LineDatum[] = [
  { date: '2018-Q1', value: 8.4 },
  { date: '2018-Q2', value: 7.9 },
  { date: '2018-Q3', value: 8.1 },
  { date: '2018-Q4', value: 7.6 },
  { date: '2019-Q1', value: 7.2 },
  { date: '2019-Q2', value: 6.8 },
  { date: '2019-Q3', value: 7.0 },
  { date: '2019-Q4', value: 6.4 },
  { date: '2020-Q1', value: 6.1 },
  { date: '2020-Q2', value: 5.8 },
]

// ── Stacked bar chart ──────────────────────────────────────────────────────────

export type StackedBarDatum = {
  period: string
  current_smoker: number
  former_smoker: number
  never_smoker: number
}

export const stackedBarData: StackedBarDatum[] = [
  { period: '2018', current_smoker: 28, former_smoker: 35, never_smoker: 37 },
  { period: '2019', current_smoker: 25, former_smoker: 37, never_smoker: 38 },
  { period: '2020', current_smoker: 23, former_smoker: 38, never_smoker: 39 },
  { period: '2021', current_smoker: 21, former_smoker: 40, never_smoker: 39 },
  { period: '2022', current_smoker: 19, former_smoker: 41, never_smoker: 40 },
]

// ── Horizontal bar (ranked benchmarking) ──────────────────────────────────────

export type HorizontalBarDatum = {
  site: string
  rate: number
}

export const horizontalBarData: HorizontalBarDatum[] = [
  { site: 'Site D',    rate: 18.2 },
  { site: 'Site F',    rate: 16.9 },
  { site: 'Site B',    rate: 15.7 },
  { site: 'Your Site', rate: 13.5 },
  { site: 'Site A',    rate: 12.4 },
  { site: 'Site E',    rate: 11.3 },
  { site: 'Site C',    rate:  9.8 },
]

// ── Heatmap (risk factor correlation matrix) ───────────────────────────────────

export type HeatmapDatum = {
  row: string
  col: string
  value: number
}

export const heatmapData: HeatmapDatum[] = [
  { row: 'Age',      col: 'Reintervention', value: 0.42 },
  { row: 'Age',      col: 'Amputation',     value: 0.38 },
  { row: 'Age',      col: 'Death',          value: 0.51 },
  { row: 'Smoking',  col: 'Reintervention', value: 0.31 },
  { row: 'Smoking',  col: 'Amputation',     value: 0.27 },
  { row: 'Smoking',  col: 'Death',          value: 0.35 },
  { row: 'Diabetes', col: 'Reintervention', value: 0.28 },
  { row: 'Diabetes', col: 'Amputation',     value: 0.44 },
  { row: 'Diabetes', col: 'Death',          value: 0.33 },
]

// ── Cumulative incidence curve (competing risks) ───────────────────────────────

export type CumulativeIncidenceDatum = {
  time: number
  incidence: number
  competing: number
}

export const cumulativeIncidenceData: CumulativeIncidenceDatum[] = [
  { time:  0, incidence: 0.00, competing: 0.00 },
  { time:  6, incidence: 0.06, competing: 0.02 },
  { time: 12, incidence: 0.11, competing: 0.04 },
  { time: 18, incidence: 0.16, competing: 0.06 },
  { time: 24, incidence: 0.20, competing: 0.08 },
  { time: 30, incidence: 0.24, competing: 0.10 },
  { time: 36, incidence: 0.27, competing: 0.12 },
]
