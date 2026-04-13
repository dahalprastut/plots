# P0 Chart Components — Pathways AI Production Stack Design Spec

**Date:** 2026-04-13
**Project:** rfcfivos (Pathways AI RFC Experimentation Workspace)
**Scope:** Subsystem A — P0 chart extensions using the recommended library stack
**Status:** Approved

---

## Goal

Implement the full P0 chart set for the Pathways AI conference demo (June 8, 2026) using the library stack selected in the RFC: Plotly for survival curves, Recharts for comparison charts, pure JSX for stat cards.

This is a new `pathways/` component folder — separate from the RFC side-by-side comparison folders. These are production-quality components built against realistic data shapes that match what the Python/lifelines backend will send.

---

## P0 Chart Inventory

| # | Component | Status | Library |
|---|-----------|--------|---------|
| 1 | Kaplan-Meier Survival Curve | Existing (re-export from `plotly/`) | Plotly |
| 2 | Cohort Comparison Cards | **New** | Pure JSX |
| 3 | Correlation / Scatter Plot | Existing (re-export from `recharts/`) | Recharts |
| 4 | Bar Chart / Grouped Bar Chart | Existing (re-export from `recharts/`) | Recharts |
| 5 | Trend Over Time / Line Chart | Existing (re-export from `recharts/`) | Recharts |
| 6 | Freedom from Reintervention Curve | **New** | Plotly |
| 7 | Amputation Rate Plot | **New** | Plotly (KM) / Recharts (bar) |

Three new components. Four existing components re-exported unchanged — no modifications to `recharts/` or `plotly/` folders.

---

## 1. File Structure

```
src/components/charts/pathways/
  CohortComparisonCard.tsx        ← new
  FreedomFromReintervention.tsx   ← new
  AmputationRatePlot.tsx          ← new
  index.ts                        ← barrel export for pathways components

src/lib/chart-data.ts             ← add new types + dummy data (4 new sections)

src/app/charts/p0/
  page.tsx                        ← new P0 showcase page
```

Existing `recharts/`, `plotly/`, `nivo/`, `echarts/` folders are untouched. The `/charts/p0` page imports from `pathways/` for new components and directly from `recharts/`/`plotly/` for the four existing ones.

---

## 2. Data Shapes (src/lib/chart-data.ts additions)

### 2.1 CohortComparisonCard

```ts
export type CohortMetric = {
  label: string    // Human-readable: "Primary patency at 24 months"
  value: string    // Formatted: "78.4%"
  field: string    // Raw registry field: "PVI_LTF_CURRPATENCY"
}

export type CohortCardData = {
  cohortName: string       // "Current Smokers"
  n: number                // 312
  medianFollowUp: number   // Months: 24.3
  metrics: CohortMetric[]
}

export const cohortCardData: CohortCardData[] = [
  {
    cohortName: 'Current Smokers',
    n: 312,
    medianFollowUp: 22.4,
    metrics: [
      { label: 'Primary patency at 24 months', value: '68.2%', field: 'PVI_LTF_CURRPATENCY' },
      { label: 'Freedom from reintervention', value: '71.4%', field: 'PVI_SITEREINTER_1' },
      { label: 'Amputation rate', value: '4.8%', field: 'LTF_AMP_R' },
    ],
  },
  {
    cohortName: 'Non-Smokers',
    n: 441,
    medianFollowUp: 26.1,
    metrics: [
      { label: 'Primary patency at 24 months', value: '79.7%', field: 'PVI_LTF_CURRPATENCY' },
      { label: 'Freedom from reintervention', value: '83.1%', field: 'PVI_SITEREINTER_1' },
      { label: 'Amputation rate', value: '2.1%', field: 'LTF_AMP_R' },
    ],
  },
]
```

### 2.2 FreedomFromReintervention

```ts
export type KmArmDatum = {
  time: number
  survival: number
  ci_lower: number
  ci_upper: number
  at_risk: number
}

export type FreedomFromReinterventionData = {
  arms: Array<{
    label: string    // "Femoral"
    color: string    // "#4F86C6"
    data: KmArmDatum[]
  }>
  logRankP: number   // 0.023
  timeUnit: string   // "months"
}

export const freedomFromReinterventionData: FreedomFromReinterventionData = {
  logRankP: 0.023,
  timeUnit: 'months',
  arms: [
    {
      label: 'Femoral', color: '#4F86C6',
      data: [
        { time: 0,  survival: 1.00, ci_lower: 1.00, ci_upper: 1.00, at_risk: 210 },
        { time: 6,  survival: 0.89, ci_lower: 0.84, ci_upper: 0.93, at_risk: 187 },
        { time: 12, survival: 0.81, ci_lower: 0.75, ci_upper: 0.86, at_risk: 164 },
        { time: 18, survival: 0.74, ci_lower: 0.68, ci_upper: 0.80, at_risk: 138 },
        { time: 24, survival: 0.68, ci_lower: 0.61, ci_upper: 0.75, at_risk: 112 },
        { time: 30, survival: 0.63, ci_lower: 0.55, ci_upper: 0.71, at_risk:  84 },
        { time: 36, survival: 0.59, ci_lower: 0.51, ci_upper: 0.67, at_risk:  60 },
      ],
    },
    {
      label: 'Popliteal', color: '#E07B54',
      data: [
        { time: 0,  survival: 1.00, ci_lower: 1.00, ci_upper: 1.00, at_risk: 178 },
        { time: 6,  survival: 0.91, ci_lower: 0.86, ci_upper: 0.95, at_risk: 160 },
        { time: 12, survival: 0.84, ci_lower: 0.78, ci_upper: 0.89, at_risk: 142 },
        { time: 18, survival: 0.78, ci_lower: 0.71, ci_upper: 0.84, at_risk: 120 },
        { time: 24, survival: 0.73, ci_lower: 0.65, ci_upper: 0.80, at_risk:  96 },
        { time: 30, survival: 0.68, ci_lower: 0.60, ci_upper: 0.76, at_risk:  72 },
        { time: 36, survival: 0.64, ci_lower: 0.55, ci_upper: 0.73, at_risk:  51 },
      ],
    },
    {
      label: 'Tibial', color: '#5BAD6F',
      data: [
        { time: 0,  survival: 1.00, ci_lower: 1.00, ci_upper: 1.00, at_risk: 112 },
        { time: 6,  survival: 0.84, ci_lower: 0.76, ci_upper: 0.90, at_risk:  95 },
        { time: 12, survival: 0.74, ci_lower: 0.65, ci_upper: 0.82, at_risk:  80 },
        { time: 18, survival: 0.66, ci_lower: 0.56, ci_upper: 0.75, at_risk:  64 },
        { time: 24, survival: 0.59, ci_lower: 0.49, ci_upper: 0.69, at_risk:  51 },
        { time: 30, survival: 0.53, ci_lower: 0.43, ci_upper: 0.63, at_risk:  38 },
        { time: 36, survival: 0.48, ci_lower: 0.37, ci_upper: 0.59, at_risk:  26 },
      ],
    },
  ],
}
```

### 2.3 AmputationRatePlot — KM variant

```ts
export type AmputationKmData = {
  variant: 'km'
  arms: Array<{
    label: string
    color: string
    data: KmArmDatum[]   // reuses KmArmDatum from section 2.2
  }>
  logRankP?: number
}

export const amputationKmData: AmputationKmData = {
  variant: 'km',
  logRankP: 0.041,
  arms: [
    {
      label: 'Diabetic', color: '#4F86C6',
      data: [
        { time: 0,  survival: 1.00, ci_lower: 1.00, ci_upper: 1.00, at_risk: 198 },
        { time: 6,  survival: 0.97, ci_lower: 0.94, ci_upper: 0.99, at_risk: 185 },
        { time: 12, survival: 0.94, ci_lower: 0.90, ci_upper: 0.97, at_risk: 171 },
        { time: 18, survival: 0.91, ci_lower: 0.87, ci_upper: 0.95, at_risk: 152 },
        { time: 24, survival: 0.88, ci_lower: 0.83, ci_upper: 0.92, at_risk: 131 },
        { time: 30, survival: 0.85, ci_lower: 0.79, ci_upper: 0.90, at_risk: 104 },
        { time: 36, survival: 0.82, ci_lower: 0.76, ci_upper: 0.88, at_risk:  78 },
      ],
    },
    {
      label: 'Non-Diabetic', color: '#E07B54',
      data: [
        { time: 0,  survival: 1.00, ci_lower: 1.00, ci_upper: 1.00, at_risk: 355 },
        { time: 6,  survival: 0.99, ci_lower: 0.97, ci_upper: 1.00, at_risk: 338 },
        { time: 12, survival: 0.97, ci_lower: 0.95, ci_upper: 0.99, at_risk: 318 },
        { time: 18, survival: 0.96, ci_lower: 0.93, ci_upper: 0.98, at_risk: 292 },
        { time: 24, survival: 0.94, ci_lower: 0.91, ci_upper: 0.96, at_risk: 261 },
        { time: 30, survival: 0.93, ci_lower: 0.90, ci_upper: 0.95, at_risk: 218 },
        { time: 36, survival: 0.92, ci_lower: 0.88, ci_upper: 0.94, at_risk: 172 },
      ],
    },
  ],
}
```

### 2.4 AmputationRatePlot — bar variant

```ts
export type AmputationBarData = {
  variant: 'bar'
  cohorts: Array<{
    label: string   // "Diabetic"
    right: number   // LTF_AMP_R rate %
    left: number    // LTF_AMP_L rate %
  }>
}

export const amputationBarData: AmputationBarData = {
  variant: 'bar',
  cohorts: [
    { label: 'Diabetic',     right: 5.1, left: 4.3 },
    { label: 'Non-Diabetic', right: 1.8, left: 1.4 },
    { label: 'Smoker',       right: 3.9, left: 3.2 },
    { label: 'Non-Smoker',   right: 1.5, left: 1.1 },
  ],
}
```

---

## 3. Component Specs

### 3.1 CohortComparisonCard

**File:** `src/components/charts/pathways/CohortComparisonCard.tsx`

**No charting library.** Pure JSX + Tailwind.

**Top band** (`bg-gray-50 border-b border-gray-100 px-4 py-3`):
- Cohort name: `text-sm font-semibold text-gray-800`
- Two inline stat pills side by side: `N = {n}` and `Median follow-up: {medianFollowUp} mo`
  - Each pill: `text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5`

**Bottom band** (`p-4 grid grid-cols-2 gap-3`):
- One tile per metric: `rounded-lg border border-gray-100 bg-gray-50 p-3 group relative`
- Tile contents:
  - `label`: `text-xs text-gray-500 mb-1`
  - `value`: `text-lg font-bold text-gray-900`
  - `field` chip: hidden by default, revealed on `group-hover` — `text-xs font-mono text-blue-600 bg-blue-50 rounded px-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150`

**No outer `ChartCard` wrapper** — this component IS the card. The page renders it directly.

**Usage (two cards side by side on page):**
```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  {cohortCardData.map(card => <CohortComparisonCard key={card.cohortName} {...card} />)}
</div>
```

---

### 3.2 FreedomFromReintervention

**File:** `src/components/charts/pathways/FreedomFromReintervention.tsx`

`'use client'` directive. Plotly via `next/dynamic` with `{ ssr: false }`.

**Layout:** Two-row Plotly subplot grid.
- `layout.grid = { rows: 2, columns: 1, roworder: 'top to bottom' }`
- Row height split via y-axis domains (more reliable than `rowheights`):
  - KM subplot: `layout.yaxis.domain = [0.3, 1.0]`
  - Risk table subplot: `layout.yaxis2.domain = [0.0, 0.22]`
- `layout.height = 520` (px)

**Top subplot (KM curves):**
- One trace per arm with `line.shape: 'hv'` and `line.color` matching arm color
- CI band: upper CI trace (`fill: 'none'`, `opacity: 0`) then lower CI trace (`fill: 'tonexty'`, `opacity: 0.15`)
- `hovermode: 'x unified'`
- Y-axis label: `'Freedom from Reintervention'`
- Y-axis range: `[0, 1]`, tickformat `'.0%'`
- Log-rank p-value as annotation: `xref: 'paper', yref: 'paper', x: 0.98, y: 0.05, xanchor: 'right'`, text `Log-rank p = {logRankP}`

**Bottom subplot (risk table):**
- Plotly `table` trace on subplot 2 (`xaxis2`, `yaxis2`)
- Header row: time point values from `arms[0].data.map(d => d.time)` prefixed with empty cell
- One data row per arm: arm label + `at_risk` value at each time point
- Cell colors match arm colors at low opacity (`rgba(hex, 0.08)` per row)
- No gridlines on risk table subplot axes (`showgrid: false, zeroline: false, showticklabels: false`)

**Card wrapper:** Rendered inside `<ChartCard name="Freedom from Reintervention" priority="P0">` with `h-[520px]` override via inline style on the card's content div.

---

### 3.3 AmputationRatePlot

**File:** `src/components/charts/pathways/AmputationRatePlot.tsx`

`'use client'` directive. Both Plotly (dynamic) and Recharts imported — tree-shaken since only one renders per instance.

**Discriminated union render:**
```tsx
export function AmputationRatePlot(props: AmputationKmData | AmputationBarData) {
  if (props.variant === 'km') return <AmputationKm {...props} />
  return <AmputationBar {...props} />
}
```

Both `AmputationKm` and `AmputationBar` are unexported internal components in the same file.

**KM variant (`AmputationKm`):**
- Plotly, same trace pattern as FreedomFromReintervention
- No risk table (simpler subplot — single panel only)
- Optional log-rank p annotation if `logRankP` is provided
- Y-axis label: `'Freedom from Amputation'`

**Bar variant (`AmputationBar`):**
- Recharts `<BarChart>` with `layout="vertical"` — no, actually horizontal makes more sense for cohort comparison
- Recharts `<BarChart>` standard orientation: cohorts on X-axis, rate on Y-axis
- Two `<Bar>` series: "Right limb" (`#4F86C6`) and "Left limb" (`#E07B54`)
- Y-axis label: `'Amputation Rate (%)'`
- `<Legend />` at top
- `<Tooltip />` with `Number(v).toFixed(1) + '%'` formatter

---

## 4. P0 Showcase Page

**File:** `src/app/charts/p0/page.tsx`

Server Component (no `'use client'`). All Plotly components handle their own `next/dynamic` + `ssr: false` internally.

**Layout:**
```
┌─── Cohort Summary ─────────────────────────────────────┐
│  [CohortComparisonCard: Smokers] [CohortComparisonCard: Non-Smokers]  │
└────────────────────────────────────────────────────────┘

┌─── P0 Charts ──────────────────────────────────────────┐
│  [KaplanMeier]              [FreedomFromReintervention]  │
│  [GroupedBar]               [AmputationRatePlot (KM)]   │
│  [ScatterPlot]              [AmputationRatePlot (bar)]  │
│  [LineArea]                                             │
└────────────────────────────────────────────────────────┘
```

Section header for "Cohort Summary" above the cards. Section header "P0 Charts" above the grid. Cards are not wrapped in `ChartCard` — they are self-contained. All other charts use `ChartCard` as normal.

The page imports KaplanMeier, GroupedBar, ScatterPlot, LineArea directly from their respective library folders (`@/components/charts/plotly/KaplanMeier`, etc.) — no re-export barrel needed.

---

## 5. SSR Notes

- `CohortComparisonCard`: pure JSX, fully SSR-safe. No `'use client'` needed.
- `FreedomFromReintervention`: `'use client'` + Plotly via `next/dynamic { ssr: false }`.
- `AmputationRatePlot`: `'use client'`. Recharts is SSR-safe but Plotly branch uses dynamic import; wrapping the whole component in `'use client'` covers both branches.

---

## 6. Color Palette (unchanged from RFC)

```
Primary:    #4F86C6  (blue)
Secondary:  #E07B54  (orange)
Tertiary:   #5BAD6F  (green)
Quaternary: #9B6DD6  (purple)
Grid/neutral: #E5E7EB
Text:       #374151
```

---

## 7. Out of Scope

- Subsystem B (Geographic / Population Map)
- Subsystem C (TLF Reports)
- Real data fetching from the Python/FastAPI backend
- Loading skeleton states
- Accessibility (aria labels, keyboard nav)
- Dark mode
- Export beyond Plotly's native modebar
