# Chart Implementations Design Spec

**Date:** 2026-04-13
**Project:** rfcfivos (Pathways AI RFC Experimentation Workspace)
**Goal:** Implement all 12 chart types on each of the 4 library pages (Recharts, Plotly, Nivo, ECharts) using the shared dummy data from `src/lib/chart-data.ts`. D3 page is out of scope for this iteration.

---

## 1. Scope

- **In scope:** Recharts, Plotly (`react-plotly.js`), Nivo, ECharts (`echarts-for-react`)
- **Out of scope:** D3 page (keeps existing skeleton grid), dark mode, data fetching, loading states
- **Chart types:** All 12 from the RFC spec, implemented best-effort on each library
- **Data:** Shared typed constants from `src/lib/chart-data.ts` — no per-library data files

---

## 2. Component Architecture

Each library gets a dedicated folder under `src/components/charts/`. Every chart type is one file. Library pages import from their own folder only — no cross-library imports.

```
src/components/charts/
  recharts/
    KaplanMeier.tsx
    GroupedBar.tsx
    ForestPlot.tsx
    BoxPlot.tsx
    Histogram.tsx
    Donut.tsx
    Scatter.tsx
    LineArea.tsx
    StackedBar.tsx
    HorizontalBar.tsx
    Heatmap.tsx
    CumulativeIncidence.tsx
  plotly/
    (same 12 files)
  nivo/
    (same 12 files)
  echarts/
    (same 12 files)
  ChartGrid.tsx         ← existing skeleton grid (unchanged, used by D3 page only)
  index.ts              ← existing barrel export (unchanged)
```

Each library page (`src/app/charts/[library]/page.tsx`) is updated to import and render its 12 components directly — replacing the `<ChartGrid />` call.

---

## 3. Grid and Card Layout

### Grid
- **2 columns** on desktop (≥1024px): `grid-cols-2`
- **1 column** on mobile/tablet: `grid-cols-1`
- Gap: `gap-6`

### Chart card
```
┌─────────────────────────────────────────┐
│ Chart Name                    P0 badge  │  ← card header (bg-gray-50, border-b)
├─────────────────────────────────────────┤
│                                         │
│           chart render area             │  ← 400px tall
│                                         │
└─────────────────────────────────────────┘
```
- White background, `border border-gray-200`, `rounded-xl`, `overflow-hidden`
- Chart render area: `h-[400px]`, padded internally by the chart library's own margins
- No extra padding wrapper around the chart itself (libraries manage their own internal padding)

---

## 4. SSR Handling

### Plotly page (`src/app/charts/plotly/page.tsx`)
All 12 Plotly chart components are loaded via `next/dynamic` with `{ ssr: false }`. A lightweight `PlotlyChartGrid` client component wraps them all:

```tsx
'use client'
import dynamic from 'next/dynamic'
const KaplanMeier = dynamic(() => import('@/components/charts/plotly/KaplanMeier'), { ssr: false })
// ... all 12
```

### ECharts page (`src/app/charts/echarts/page.tsx`)
Same pattern — all 12 ECharts components loaded with `{ ssr: false }`.

### Recharts page
Standard imports. Recharts is SSR-safe. Uses `<ResponsiveContainer>` for resizing.

### Nivo page
Standard imports. Each Nivo chart component file carries `'use client'` (Nivo uses `ResizeObserver` internally which is browser-only). The page file itself stays a Server Component.

---

## 5. Extra Packages to Install

```bash
npm install @nivo/bar @nivo/line @nivo/pie @nivo/scatterplot @nivo/boxplot
```

All at version `^0.99.0` to match existing `@nivo/core` and `@nivo/heatmap`.

---

## 6. Best-Effort Chart Mapping

Charts where a library has no direct native type — mapped to the closest available primitive:

| Chart | Recharts | Nivo | ECharts | Plotly |
|---|---|---|---|---|
| KM curve | `LineChart` + `Line type="stepAfter"` + CI band via `Area` | `@nivo/line` + `curve="stepAfter"` + area layer | `series type: 'line', step: 'end'` | `scatter` with `line.shape: 'hv'` + `tonexty` fill |
| Box plot | `ComposedChart` + custom `<ErrorBar>` whiskers + `<Bar>` IQR box | `@nivo/boxplot` (native) | `series type: 'boxplot'` (native) | `box` trace (native) |
| Forest plot | `ComposedChart` + `<Scatter>` points + `<ErrorBar>` horizontal | `@nivo/bar` horizontal + custom layer for CI lines | `series type: 'scatter'` + `markLine` for CI | `scatter` with `error_x` |
| Heatmap | CSS grid table with color-coded cells (no Recharts native) | `@nivo/heatmap` (native) | `series type: 'heatmap'` (native) | `heatmap` trace (native) |
| Histogram | `BarChart` with `histogramData` bins | `@nivo/bar` with bin data | `series type: 'bar'` with bin data | `histogram` trace (native) |
| Cumulative incidence | `AreaChart` with two `<Area>` series | `@nivo/line` with two series + area fill | `series type: 'line'` with `areaStyle` | `scatter` with fill `tozeroy` |

---

## 7. Interactivity Per Library

### All libraries
- Hover tooltips on every data point
- Animated chart entry on mount
- Responsive resize (fills card width)

### Recharts
- `<Tooltip />` with custom content formatter
- `<Legend />` with `onClick` to toggle series visibility
- `isAnimationActive={true}` on all series

### Plotly
- Native modebar toolbar (zoom, pan, reset axes, download PNG)
- `hovermode: 'x unified'` for line/area charts
- `config: { responsive: true }`

### Nivo
- `tooltip` prop with styled custom tooltip component
- `legends` array with `toggleSerie` enabled where applicable
- `animate: true`, `motionConfig: 'gentle'`

### ECharts
- `tooltip: { trigger: 'axis' }` for cartesian charts, `trigger: 'item'` for pie/donut
- `legend` component with click-to-toggle
- `dataZoom` slider for KM, line, scatter, and cumulative incidence charts
- `animation: true`

---

## 8. Color Palette

Consistent clinical-research palette used across all libraries:

```
Primary series:   #4F86C6  (blue)
Secondary series: #E07B54  (orange)
Tertiary series:  #5BAD6F  (green)
Quaternary:       #9B6DD6  (purple)
Neutral/grid:     #E5E7EB
Text:             #374151
```

---

## 9. File Changes Summary

| Action | File |
|---|---|
| Install | `@nivo/bar @nivo/line @nivo/pie @nivo/scatterplot @nivo/boxplot` |
| Modify | `src/app/charts/recharts/page.tsx` |
| Modify | `src/app/charts/plotly/page.tsx` |
| Modify | `src/app/charts/nivo/page.tsx` |
| Modify | `src/app/charts/echarts/page.tsx` |
| Create (×12) | `src/components/charts/recharts/*.tsx` |
| Create (×12) | `src/components/charts/plotly/*.tsx` |
| Create (×12) | `src/components/charts/nivo/*.tsx` |
| Create (×12) | `src/components/charts/echarts/*.tsx` |
| Unchanged | `src/app/charts/d3/page.tsx` (keeps skeleton grid) |
| Unchanged | `src/components/charts/ChartGrid.tsx` |
| Unchanged | `src/lib/chart-data.ts` |

---

## 10. Out of Scope

- D3 charts
- Dark mode
- Loading states / skeletons
- Data fetching or API integration
- Export/download beyond Plotly's native toolbar
- Accessibility (aria labels, keyboard nav)
