# Chart Library Comparison — Design Spec

**Date:** 2026-04-12
**Project:** rfcfivos (Pathways AI RFC Experimentation Workspace)
**Goal:** Build a Next.js app with a top nav linking to per-library pages, each rendering 12 chart type placeholders with shared dummy data. First step before actual chart rendering.

---

## 1. Purpose

This is an RFC experimentation workspace for comparing five charting libraries side-by-side:
- **Recharts** — primary candidate for standard charts
- **react-plotly.js** — specialist for KM curves and forest plots
- **@nivo/heatmap** — narrow candidate for the hospital performance heatmap
- **ECharts (echarts-for-react)** — alternative candidate for large-dataset performance
- **D3.js** — custom component experiments

Each library gets a dedicated page. All pages render the same 12 chart types with the same dummy data so the comparison is apples-to-apples.

This first step establishes the UI structure and installs libraries. No actual chart rendering yet.

---

## 2. Routing Architecture

Uses Next.js App Router with a nested layout for the charts section.

```
src/
  app/
    page.tsx                    ← redirect to /charts/recharts
    charts/
      layout.tsx                ← shared top nav (renders once for all library pages)
      recharts/page.tsx
      plotly/page.tsx
      nivo/page.tsx
      echarts/page.tsx
      d3/page.tsx
  lib/
    chart-data.ts               ← shared dummy data for all 12 chart types
  components/
    charts/
      index.ts                  ← empty barrel export, ready for future chart components
```

**Why nested layout:** The top nav renders once in `charts/layout.tsx` and is shared by all 5 library pages without duplication. Adding a 6th library requires only a new page file and a nav link.

---

## 3. Navigation

**Location:** `src/app/charts/layout.tsx`

**Structure:**
- Left: "RFC Charts" brand label
- Right: 5 links — Recharts · Plotly · Nivo · ECharts · D3
- Uses Next.js `<Link>` for client-side navigation
- Uses `usePathname()` to detect the active route and apply an underline/highlight to the current library link
- Inactive links are muted gray

**Routes:**
| Label | Route |
|---|---|
| Recharts | `/charts/recharts` |
| Plotly | `/charts/plotly` |
| Nivo | `/charts/nivo` |
| ECharts | `/charts/echarts` |
| D3 | `/charts/d3` |

---

## 4. Page Layout

Each library page (`recharts/page.tsx`, etc.) renders:

1. **Header:** `<h1>` with library name + one-line description
   - Recharts: "Composable JSX charts — primary candidate for standard chart types"
   - Plotly: "Specialist candidate for KM survival curves and forest plots"
   - Nivo: "Narrow candidate for the hospital performance heatmap"
   - ECharts: "Alternative candidate for large-dataset performance"
   - D3: "Custom visualization experiments — higher bar, higher reward"

2. **Chart grid:** Responsive CSS grid
   - 3 columns on desktop (≥1024px)
   - 2 columns on tablet (≥640px)
   - 1 column on mobile

3. **Chart slots:** 12 slots, ordered by priority (P0 first, then P1, P2)
   - Small bold label above (chart name)
   - `160px` tall dashed gray skeleton box (`bg-gray-100`, `border-dashed`, `border-gray-300`, `rounded-lg`)
   - No animation for now (pulse animation can be added when wiring real data)

**Chart order:**

| Priority | # | Chart type |
|---|---|---|
| P0 | 1 | Kaplan-Meier survival curve |
| P0 | 2 | Grouped bar chart |
| P0 | 3 | Forest plot (HR + CI) |
| P1 | 4 | Box plot |
| P1 | 5 | Histogram |
| P1 | 6 | Donut / pie chart |
| P1 | 7 | Scatter plot |
| P1 | 8 | Line / area chart |
| P1 | 9 | Stacked bar chart |
| P2 | 10 | Horizontal bar (ranked) |
| P2 | 11 | Heatmap |
| P2 | 12 | Cumulative incidence curve |

---

## 5. Dummy Data

**Location:** `src/lib/chart-data.ts`

All data is synthetic and typed. Shapes mirror what the Python backend will eventually return. No real PVI data.

| Chart | Export name | Shape |
|---|---|---|
| Kaplan-Meier | `kmData` | `{ time: number, survival: number, ci_lower: number, ci_upper: number, at_risk: number }[]` |
| Grouped bar | `groupedBarData` | `{ artery: string, reintervention_rate: number, no_reintervention_rate: number }[]` |
| Forest plot | `forestData` | `{ variable: string, hr: number, ci_lower: number, ci_upper: number, p_value: number }[]` |
| Box plot | `boxPlotData` | `{ group: string, min: number, q1: number, median: number, q3: number, max: number }[]` |
| Histogram | `histogramData` | `{ bin: string, count: number }[]` |
| Donut | `donutData` | `{ label: string, value: number }[]` |
| Scatter | `scatterData` | `{ x: number, y: number, label: string }[]` |
| Line/area | `lineData` | `{ date: string, value: number }[]` |
| Stacked bar | `stackedBarData` | `{ period: string, [category: string]: number \| string }[]` |
| Horizontal bar | `horizontalBarData` | `{ site: string, rate: number }[]` |
| Heatmap | `heatmapData` | `{ row: string, col: string, value: number }[]` |
| Cumulative incidence | `cumulativeIncidenceData` | `{ time: number, incidence: number, competing: number }[]` |

---

## 6. Libraries to Install

| Library | Package(s) | Purpose |
|---|---|---|
| Recharts | `recharts` | Standard charts |
| Plotly | `react-plotly.js` `plotly.js` | KM curves, forest plots |
| Nivo | `@nivo/core` `@nivo/heatmap` | Heatmap |
| ECharts | `echarts` `echarts-for-react` | Alternative candidate |
| D3 | `d3` `@types/d3` | Custom components |

**Note:** `react-plotly.js` must be loaded with `next/dynamic` and `ssr: false` in all page files (SSR incompatible).

---

## 7. Out of Scope (this step)

- Actual chart rendering (no recharts/plotly/nivo/echarts/d3 components yet)
- Data fetching or API integration
- Loading skeleton animations
- Dark mode
- Any WOW 1 (data abstraction) functionality
