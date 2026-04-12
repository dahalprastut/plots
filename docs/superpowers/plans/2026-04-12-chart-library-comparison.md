# Chart Library Comparison UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a Next.js app with a top nav linking to five library pages (Recharts, Plotly, Nivo, ECharts, D3), each rendering 12 chart-type skeleton placeholders with shared dummy data. No actual chart rendering yet.

**Architecture:** Nested layout at `src/app/charts/layout.tsx` owns the top nav and is shared by all five library pages under `src/app/charts/[library]/page.tsx`. A single `ChartGrid` component renders the 12 skeleton slots so page files stay thin. A `NavLinks` Client Component handles active-link detection via `usePathname()` since layouts are Server Components by default.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, recharts, react-plotly.js + plotly.js, @nivo/core + @nivo/heatmap, echarts + echarts-for-react, d3

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/app/page.tsx` | Redirect to `/charts/recharts` |
| Create | `src/app/charts/layout.tsx` | Shared header + nav shell |
| Create | `src/app/charts/recharts/page.tsx` | Recharts library page |
| Create | `src/app/charts/plotly/page.tsx` | Plotly library page |
| Create | `src/app/charts/nivo/page.tsx` | Nivo library page |
| Create | `src/app/charts/echarts/page.tsx` | ECharts library page |
| Create | `src/app/charts/d3/page.tsx` | D3 library page |
| Create | `src/lib/chart-data.ts` | Typed dummy data + chart type registry |
| Create | `src/components/NavLinks.tsx` | `'use client'` nav link component |
| Create | `src/components/charts/ChartGrid.tsx` | 12-slot skeleton grid |
| Create | `src/components/charts/index.ts` | Barrel export |
| Modify | `.gitignore` | Add `.superpowers/` |

---

## Task 1: Update .gitignore and install all libraries

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add .superpowers to .gitignore**

Open `.gitignore` and append:

```
.superpowers/
```

- [ ] **Step 2: Install all chart libraries**

```bash
cd D:/work/actualReality/rfcfivos
npm install recharts react-plotly.js plotly.js @nivo/core @nivo/heatmap echarts echarts-for-react d3
```

Expected: Several hundred packages installed, no peer dependency errors that block install. `package.json` will show all five libraries in `dependencies`.

- [ ] **Step 3: Verify installation**

```bash
node -e "require('recharts'); require('react-plotly.js'); require('@nivo/heatmap'); require('echarts-for-react'); require('d3'); console.log('all ok')"
```

Expected output:
```
all ok
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore package.json package-lock.json
git commit -m "chore: install chart libraries (recharts, plotly, nivo, echarts, d3)"
```

---

## Task 2: Create shared dummy data and chart type registry

**Files:**
- Create: `src/lib/chart-data.ts`

- [ ] **Step 1: Create `src/lib/chart-data.ts`**

```typescript
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
  { bin: '40–49', count:  89 },
  { bin: '50–59', count: 218 },
  { bin: '60–69', count: 412 },
  { bin: '70–79', count: 523 },
  { bin: '80–89', count: 287 },
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
// Using an explicit type (not an index signature) to keep TypeScript happy.

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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/chart-data.ts
git commit -m "feat: add shared dummy data and chart type registry"
```

---

## Task 3: Create ChartGrid component and barrel export

**Files:**
- Create: `src/components/charts/ChartGrid.tsx`
- Create: `src/components/charts/index.ts`

- [ ] **Step 1: Create `src/components/charts/ChartGrid.tsx`**

```tsx
// src/components/charts/ChartGrid.tsx
import { CHART_TYPES } from '@/lib/chart-data'

export function ChartGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CHART_TYPES.map((chart) => (
        <div key={chart.id}>
          <p className="mb-2 text-sm font-semibold text-gray-700">
            {chart.name}
            <span className="ml-2 text-xs font-normal text-gray-400">{chart.priority}</span>
          </p>
          <div className="h-40 rounded-lg border border-dashed border-gray-300 bg-gray-100" />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/charts/index.ts`**

```typescript
// src/components/charts/index.ts
export { ChartGrid } from './ChartGrid'
```

- [ ] **Step 3: Commit**

```bash
git add src/components/charts/ChartGrid.tsx src/components/charts/index.ts
git commit -m "feat: add ChartGrid skeleton component"
```

---

## Task 4: Create NavLinks client component

**Files:**
- Create: `src/components/NavLinks.tsx`

The nav must be a `'use client'` component because `usePathname()` is a client-only hook. The layout itself stays a Server Component and just imports this.

- [ ] **Step 1: Create `src/components/NavLinks.tsx`**

```tsx
// src/components/NavLinks.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LIBRARIES = [
  { label: 'Recharts', href: '/charts/recharts' },
  { label: 'Plotly',   href: '/charts/plotly'   },
  { label: 'Nivo',     href: '/charts/nivo'     },
  { label: 'ECharts',  href: '/charts/echarts'  },
  { label: 'D3',       href: '/charts/d3'       },
] as const

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {LIBRARIES.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            pathname === href
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/NavLinks.tsx
git commit -m "feat: add NavLinks client component with active-route highlighting"
```

---

## Task 5: Create charts section layout

**Files:**
- Create: `src/app/charts/layout.tsx`

- [ ] **Step 1: Create `src/app/charts/layout.tsx`**

```tsx
// src/app/charts/layout.tsx
import Link from 'next/link'
import { NavLinks } from '@/components/NavLinks'

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
          <Link
            href="/charts/recharts"
            className="mr-8 text-sm font-bold text-gray-900 tracking-tight"
          >
            RFC Charts
          </Link>
          <NavLinks />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/charts/layout.tsx
git commit -m "feat: add charts section layout with top nav"
```

---

## Task 6: Update root page to redirect

**Files:**
- Modify: `src/app/page.tsx`

The existing `src/app/page.tsx` has the default Next.js template content. Replace it entirely.

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/charts/recharts')
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redirect root to /charts/recharts"
```

---

## Task 7: Create all five library pages

**Files:**
- Create: `src/app/charts/recharts/page.tsx`
- Create: `src/app/charts/plotly/page.tsx`
- Create: `src/app/charts/nivo/page.tsx`
- Create: `src/app/charts/echarts/page.tsx`
- Create: `src/app/charts/d3/page.tsx`

- [ ] **Step 1: Create `src/app/charts/recharts/page.tsx`**

```tsx
// src/app/charts/recharts/page.tsx
import { ChartGrid } from '@/components/charts'

export default function RechartsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recharts</h1>
        <p className="mt-1 text-gray-500">
          Composable JSX charts — primary candidate for standard chart types
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
```

- [ ] **Step 2: Create `src/app/charts/plotly/page.tsx`**

```tsx
// src/app/charts/plotly/page.tsx
import { ChartGrid } from '@/components/charts'

export default function PlotlyPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plotly</h1>
        <p className="mt-1 text-gray-500">
          Specialist candidate for KM survival curves and forest plots
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
```

- [ ] **Step 3: Create `src/app/charts/nivo/page.tsx`**

```tsx
// src/app/charts/nivo/page.tsx
import { ChartGrid } from '@/components/charts'

export default function NivoPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nivo</h1>
        <p className="mt-1 text-gray-500">
          Narrow candidate for the hospital performance heatmap
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
```

- [ ] **Step 4: Create `src/app/charts/echarts/page.tsx`**

```tsx
// src/app/charts/echarts/page.tsx
import { ChartGrid } from '@/components/charts'

export default function EChartsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ECharts</h1>
        <p className="mt-1 text-gray-500">
          Alternative candidate for large-dataset performance
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
```

- [ ] **Step 5: Create `src/app/charts/d3/page.tsx`**

```tsx
// src/app/charts/d3/page.tsx
import { ChartGrid } from '@/components/charts'

export default function D3Page() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">D3</h1>
        <p className="mt-1 text-gray-500">
          Custom visualization experiments — higher bar, higher reward
        </p>
      </div>
      <ChartGrid />
    </>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/charts/
git commit -m "feat: add five library pages (recharts, plotly, nivo, echarts, d3)"
```

---

## Task 8: Verify in browser

- [ ] **Step 1: Start dev server (if not already running)**

```bash
npm run dev
```

Expected: `✓ Ready in Xs` on `http://localhost:3000`

- [ ] **Step 2: Check each route manually**

Open a browser and verify:

| URL | Expected |
|---|---|
| `http://localhost:3000` | Redirects to `/charts/recharts` |
| `http://localhost:3000/charts/recharts` | "Recharts" heading, 12 skeleton slots, "Recharts" nav link highlighted |
| `http://localhost:3000/charts/plotly` | "Plotly" heading, 12 skeleton slots, "Plotly" nav link highlighted |
| `http://localhost:3000/charts/nivo` | "Nivo" heading, 12 slots |
| `http://localhost:3000/charts/echarts` | "ECharts" heading, 12 slots |
| `http://localhost:3000/charts/d3` | "D3" heading, 12 slots |

- [ ] **Step 3: Run production build to catch type errors**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors and no missing module errors. Output shows all routes compiled.
