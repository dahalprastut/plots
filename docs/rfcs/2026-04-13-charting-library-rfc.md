# RFC: React Charting Library Selection for Pathways AI

**Date:** 2026-04-13
**Author:** RFC Experimentation Workspace
**Status:** Final Recommendation (v2 — updated to include full P0 chart inventory)
**Scope:** WOW 2 (Research Hypothesis Explorer) + WOW 3 (Smart Operational Dashboards)

---

## Executive Summary

We implemented all chart types across four candidate libraries and built the complete P0 production component set. The recommendation is a **two-library stack** with pure-JSX stat cards:

| Role | Library | Chart types covered |
|---|---|---|
| **Primary** | Recharts | Grouped bar, histogram, donut, scatter, line/area, stacked bar, horizontal bar, amputation bar |
| **Specialist** | react-plotly.js | KM survival curves, Freedom from Reintervention, Amputation KM, Forest plot, Cumulative incidence |
| **Narrow** | @nivo/heatmap | Hospital performance heatmap (WOW 3) |
| **None (JSX)** | — | Cohort Comparison Cards, stat callouts |

**Multiple libraries are safe.** Each library is loaded only on the pages that need it via `next/dynamic`. A user who never views a KM curve never downloads Plotly's 4.6 MB bundle. Performance impact is negligible when code-splitting is applied correctly.

ECharts is the **strongest single-library fallback** if the Plotly bundle size proves unacceptable in production telemetry.

---

## 1. Complete P0 Chart Inventory

The following 9 chart types are required for the WOW 2 / WOW 3 conference demo. Each has a library assignment and a rationale.

| # | Chart | Library | Rationale |
|---|---|---|---|
| 1 | Kaplan-Meier Survival Curve | react-plotly.js | Native `hv` step-line, `tonexty` CI bands, unified crosshair — no approximation needed |
| 2 | Freedom from Reintervention | react-plotly.js | Multi-arm KM variant with risk table subplot; Plotly `table` trace + `yaxis.domain` split handles this natively |
| 3 | Amputation Rate Plot | react-plotly.js (KM) / Recharts (bar) | Discriminated union: Plotly when time-to-event data available, Recharts grouped bar when only rates available |
| 4 | Cohort Comparison Cards | Pure JSX | No chart library — stat tiles with Tailwind `group-hover` progressive disclosure of registry field names |
| 5 | Grouped Bar Chart | Recharts | React-native JSX composition, smallest bundle contribution, no SSR constraint |
| 6 | Correlation / Scatter Plot | Recharts | Adequate for clinical scatter; ECharts `dataZoom` is better for dense patient-level data (>500 points) |
| 7 | Trend Over Time / Line Chart | Recharts | ComposedChart + Line + Area shadow fill is clean; no zoom needed for quarterly trend data |
| 8 | Forest Plot (HR + CI) | react-plotly.js | `error_x` with `symmetric: false` is the only correct native implementation; all alternatives use stacked-bar approximations |
| 9 | Tables, Listings & Figures (TLF) | Out of scope (v2) | Requires separate RFC — R framework integration, PDF generation, and regulatory table format are independent of the charting stack |

---

## 2. The Four Libraries at a Glance

| | Recharts | Plotly | Nivo | ECharts |
|---|---|---|---|---|
| Version tested | 3.8.1 | 3.5.0 | 0.99.0 | 6.0.0 |
| Bundle (uncompressed) | ~300 KB | ~4.6 MB | ~200–400 KB | ~1.5 MB |
| Bundle (gzipped) | ~90 KB | ~1.4 MB | ~70–130 KB | ~500 KB |
| SSR-safe | ✅ Yes | ❌ `ssr: false` required | ⚠️ `use client` required | ❌ `ssr: false` required |
| TypeScript quality | ✅ Good (v3 changes noted) | ⚠️ Incomplete (`any` everywhere) | ⚠️ Incomplete | ⚠️ Strict but brittle |
| React idiom fit | ✅ JSX composition | ❌ JSON layout object | ✅ Prop-driven | ❌ JSON option object |
| Native KM curve | ❌ Approximation | ✅ `hv` step + `tonexty` | ❌ Approximation | ✅ Step + stacked area |
| Native box plot | ❌ Stacked bar approximation | ✅ Pre-computed stats | ✅ `@nivo/boxplot` | ✅ `boxplot` type |
| Native forest plot | ❌ Stacked bar + LabelList | ✅ `error_x` | ❌ Custom layer + `any` | ❌ Stack + markPoint |
| Native heatmap | ❌ CSS table fallback | ✅ `heatmap` trace | ✅ `ResponsiveHeatMap` | ✅ `heatmap` type |
| Risk table support | ❌ Manual HTML table | ✅ `table` trace + subplots | ❌ Manual | ❌ Manual |
| Zoom / pan | ❌ Manual (`<Brush>`) | ✅ Modebar built-in | ❌ None | ✅ `dataZoom` slider |

---

## 3. Performance Analysis

### 3.1 Bundle Size by Library

```
react-plotly.js:  ~4.6 MB uncompressed  (~1.4 MB gzipped)
echarts-for-react: ~1.5 MB uncompressed  (~500 KB gzipped)
recharts:           ~300 KB uncompressed  (~90 KB gzipped)
@nivo/heatmap:       ~80 KB uncompressed  (~25 KB gzipped)  ← single package, not all of Nivo
Pure JSX:              ~0 KB               (no chart library)
```

**Raw numbers are not the right metric.** What matters is what the user downloads per page visit. All Plotly components are loaded via `next/dynamic` with `ssr: false`, which tells Next.js to split Plotly into its own chunk and only fetch it when the user navigates to a page that contains a Plotly chart.

### 3.2 Code-Splitting Strategy

Every `react-plotly.js` component in this project follows this pattern:

```tsx
'use client'
import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded bg-gray-100" />,
}) as any
```

This produces the following network behavior:

| User action | What loads |
|---|---|
| Visit `/charts/recharts` | Recharts chunk (~90 KB gzipped). Plotly: not fetched. |
| Visit `/charts/p0` — cohort cards + bar chart visible | Recharts chunk. Plotly loading skeleton shows until the user's browser is idle. |
| Scroll to / view a KM chart | Plotly chunk (~1.4 MB gzipped) fetched on demand. |
| Visit `/charts/p0` again (return visit) | Plotly chunk served from browser cache. No re-fetch. |

For a **conference demo** this matters: the presenter controls what the audience sees. If the demo starts on the cohort card section, Plotly is never fetched. The audience sees instant rendering. When the presenter scrolls to KM curves, the 1-2 second Plotly load is masked by the `animate-pulse` skeleton, which reads as intentional loading behaviour to a clinical audience.

For a **production deployment**, the P0 charts page would typically be visited after a hypothesis is computed (5–15 second Python backend call). Plotly's ~1.4 MB fetch occurs in parallel with the backend computation, making its cold-load cost effectively zero.

### 3.3 SSR / Time to First Contentful Paint

`react-plotly.js` requires `ssr: false` because Plotly uses `window` and `document` on import. This means:
- The server renders a loading skeleton for every Plotly chart
- The client hydrates and replaces the skeleton with the real chart
- For the `/charts/p0` page, the cohort cards and section headers render server-side immediately; the chart skeletons fill in client-side

**Recharts** components require `'use client'` but are SSR-compatible — they can render to HTML on the server via `ResponsiveContainer`. This produces faster FCP for bar charts and line charts.

**Nivo** requires `'use client'` but uses `ResizeObserver` which is browser-only, so it is effectively treated as `ssr: false` in practice.

### 3.4 Runtime Rendering Performance

| Library | 500 data points | 5,000 data points | 50,000 data points |
|---|---|---|---|
| Recharts (SVG) | Fast | Acceptable | Slow — DOM node count |
| Plotly (SVG/WebGL) | Fast | Fast | Fast (WebGL mode) |
| ECharts (Canvas) | Fast | Fast | Fast (Canvas renderer) |
| Nivo (SVG) | Fast | Acceptable | Slow |

For Pathways AI:
- KM curves: typically 20–50 time points per arm. All libraries are fast.
- Scatter plots: potentially 500+ patient-level points. Recharts SVG handles this fine. ECharts canvas handles this better for zoom/pan interactions.
- Forest plots: typically 5–20 variables. All libraries fast.
- Heatmaps: up to 100×10 cells (10 sites × 10 metrics). `@nivo/heatmap` is fast and visually superior.

No library imposes a runtime performance bottleneck at the data volumes Pathways AI will encounter.

### 3.5 Multi-Library Performance Impact

**Short answer: negligible, if code-splitting is applied correctly.**

The concern with using multiple charting libraries is that the total JavaScript payload balloons. This is only true if all libraries are loaded on every page. With `next/dynamic`:

- A user visiting only the Research Hypothesis Explorer (WOW 2) loads: Recharts (always present in the bar chart section) + Plotly (on-demand when KM/forest plots appear). They never load ECharts or the full Nivo package.
- A user visiting only the Smart Dashboards (WOW 3) loads: Recharts (bar charts, horizontal bar, line) + `@nivo/heatmap` (when the heatmap widget appears). They never load Plotly's 4.6 MB bundle.

The critical discipline is: **never import any chart library at the module level in a page or layout file.** Always import via `next/dynamic` or from a `'use client'` component that itself uses dynamic import. If Plotly is imported statically anywhere in a shared layout, it defeats code-splitting for the entire app.

Current implementation follows this discipline correctly — every Plotly component declares its own `next/dynamic` import.

---

## 4. Interactivity Comparison

### Plotly — Best Out-of-Box Interactivity for Clinical Charts

Plotly ships a modebar (zoom, pan, box-select, lasso-select, autoscale, download-as-PNG, reset-axes) at no configuration cost. For clinical charts shown at conferences, a clinician can zoom into a KM curve without the frontend team writing a single line of zoom code.

- `hovermode: 'x unified'` produces a shared crosshair tooltip across all series — the single most useful interaction for survival curves and time-series overlays
- `hovertemplate` gives full control over tooltip content without custom React components
- Zoom state persists during the session; double-click resets
- The `table` trace creates risk tables that share the chart's coordinate space — essential for the Freedom from Reintervention component

**Verdict:** Best for charts that will be explored interactively. KM curves, forest plots, and the FFR chart all benefit significantly.

### ECharts — Best Zoom Controls for Dense Data

ECharts' `dataZoom` component (both `slider` and `inside`) is more polished than anything Recharts offers natively. The slider version renders a mini-map of the full series — users drag handles to zoom into a time window.

- `toolbox` gives data zoom + restore + save-as-image in a compact toolbar
- Native `boxplot` type renders correctly with correct whisker semantics
- `tooltip.axisPointer` with `type: 'cross'` is the best crosshair for time series
- **Best choice** for scatter plots where the user needs to explore dense patient-level clusters

**Verdict:** Best when dataset is dense or when users need to drill into time windows. The recommended fallback if Plotly is removed from the stack.

### Recharts — Solid, Custom Work Required for Exploration

Recharts `<Tooltip>` and `<Legend>` systems are clean. Click-to-toggle series via `<Legend onClick>` works well. Custom tooltip content via a React component is idiomatic.

What Recharts lacks: built-in zoom or pan. For comparison charts (grouped bar, stacked bar, donut) this is irrelevant. For time-series heavy charts, you would need to wire up `<Brush>` or a `ReferenceArea` drag interaction manually.

**Verdict:** Excellent for comparison charts and dashboards where tooltips and legends suffice. Not the right choice for exploratory time-series.

### Nivo — Best Animations, Limited Interactivity

Nivo's `motionConfig: 'gentle'` produces the nicest mount animations. `useMesh` on line charts gives accurate hover detection. But there is no built-in zoom, no download, and no pan.

**Verdict:** Recommended only for `@nivo/heatmap` where its sequential colour scheme and cell layout are visually superior to the alternatives.

---

## 5. Per-Chart-Type Recommendation

### P0 Charts

**Kaplan-Meier Survival Curve → react-plotly.js**

The only library that natively supports all three clinical KM requirements:
1. `line.shape: 'hv'` — mathematically correct step function, not an approximation
2. `fill: 'tonexty'` — CI band fills between upper and lower CI traces at their actual values
3. `hovermode: 'x unified'` — single crosshair tooltip across all series at the same time point

Recharts `type="stepAfter"` produces a visually similar curve but the CI band requires a stacking hack (transparent base + coloured difference area). The tooltip shows the band width, not the actual CI bounds. The workaround is functional but fragile — it relies on undocumented `formatter` behaviour to suppress the base series from the tooltip.

ECharts is a close second (step line + stacked area CI). Use it only if Plotly bundle size becomes unacceptable post-launch telemetry.

**Freedom from Reintervention Curve → react-plotly.js**

Multi-arm KM variant tracking patency and freedom from target lesion reintervention (fields: `PVI_LTF_CURRPATENCY`, `PVI_SITEREINTER_1–4`). Three unique requirements beyond a standard KM chart:
1. Multiple stratified arms (by artery type: femoral, popliteal, tibial, iliac)
2. Risk table below the chart, aligned to the time axis
3. Log-rank p-value annotation

Plotly handles all three natively:
- Multiple traces with `fill: 'tonexty'` for per-arm CI bands
- `table` trace positioned via `domain` provides the risk table without manual HTML alignment
- `layout.annotations` for the p-value

No other library offers a native risk table. Recharts requires a manually-built HTML table with CSS pixel-matching against the chart's internal margin — fragile and maintenance-heavy.

**Amputation Rate Plot → react-plotly.js (KM) / Recharts (bar)**

Context-driven: the Python backend determines which variant to send based on whether time-to-event data was computed from `LTF_AMP_R` / `LTF_AMP_L` follow-up fields.

- `variant: 'km'` — Plotly, same pattern as the KM curve, freedom-from-amputation by cohort
- `variant: 'bar'` — Recharts `<BarChart>` with right/left limb series, grouped by cohort

A discriminated union on the `variant` prop keeps both rendering modes in one component with one import on the page. TypeScript narrows the props correctly at the discriminant.

**Cohort Comparison Cards → Pure JSX (no library)**

Two-band layout:
- **Top band:** cohort name, N, median follow-up — static identity
- **Bottom band:** dynamic outcome metrics — selected by the AI hypothesis engine, not the frontend

The `metrics` array contains `{ label, value, field }`. The `field` is the raw PVI registry variable name (`PVI_LTF_CURRPATENCY`). By default only `label` and `value` are shown; the `field` chips appear on hover via Tailwind `group-hover:opacity-100`. This progressive disclosure design makes the AI's variable-selection reasoning legible to a clinical/regulatory audience without cluttering the card for a general audience.

No charting library is needed. Pure JSX + Tailwind, fully SSR-safe.

**Grouped Bar Chart → Recharts**

Handles reintervention rates by artery type, procedure counts, cohort comparisons. All libraries are equivalent for this chart type. Recharts wins on: smallest bundle contribution, React-native JSX composition, no `ssr: false` constraint, `<Tooltip>` and `<Legend>` work without custom configuration.

**Correlation / Scatter Plot → Recharts (standard) / ECharts (dense)**

For patient-level data up to ~500 points, Recharts `<ScatterChart>` is adequate. If the scatter shows raw patient data (40,000-row PVI cohort subsets), ECharts `dataZoom` provides zoom-to-cluster capability without additional code. Decision point: if the scatter plot appears on the same page as ECharts is already loaded, use ECharts. Otherwise Recharts.

**Trend Over Time / Line Chart → Recharts**

Quarterly or annual trend data (typically 8–20 time points). No zoom needed. `<ComposedChart>` with `<Line>` and an `<Area>` shadow fill is clean and readable.

**Forest Plot (HR + CI) → react-plotly.js**

`error_x` with `symmetric: false` and separate `array`/`arrayminus` arrays is the only first-class horizontal CI bar implementation. All other libraries approximate with stacked horizontal bars:
- Transparent spacer bar + coloured CI range bar + manual HR point marker
- Tooltip area is off-centre (hovering the spacer returns the spacer value)
- The HR point must be positioned manually in the centre of the CI bar

The Plotly version has none of these problems and inherits the modebar for free.

### P1 Charts (WOW 3 / secondary views)

**Box Plot → Plotly** (if already on page) / **ECharts** (if standalone)

Both have native box plot support with correct whisker semantics. Recharts and Nivo require 5-stacked-bar approximations. If the box plot appears on a page that already loads Plotly (e.g., alongside a KM curve), use Plotly — no additional library weight. If standalone, ECharts is cleaner.

**Histogram → Recharts**

Dead simple bar chart. All libraries equivalent. Recharts wins on bundle economy.

**Donut / Pie → Recharts**

`<PieChart>` with `<Pie innerRadius>` is clean. No need for an additional library.

**Stacked Bar → Recharts**

Standard Recharts pattern. All libraries equivalent. Recharts wins on bundle economy.

### P2 Charts (WOW 3)

**Horizontal Bar (Benchmarking) → Recharts**

`Cell`-based conditional fill (highlighting "Your Site") and `<ReferenceLine>` for the registry average are trivial in Recharts. The ranked hospital comparison chart in WOW 3 needs no specialist library.

**Heatmap → @nivo/heatmap**

The only chart type where the library assignment changes the conclusion from Recharts. `@nivo/heatmap` produces the cleanest visual for the hospital performance grid: smooth colour interpolation, the `blues` sequential scheme maps to the Fivos clinical palette, and the cell layout reads clearly as a grid of hospital metrics rather than a generic correlation matrix. ECharts and Plotly produce a "data tool" aesthetic that is less appropriate for a clinical dashboard.

**Cumulative Incidence Curve → Recharts or Plotly**

If this chart appears alongside a KM curve (likely in Research Hypotheses), Plotly is already loaded and `fill: 'tozeroy'` is cleaner. Otherwise Recharts `<AreaChart>` with two independent `<Area>` series is sufficient.

---

## 6. Multi-Library Stack — Performance and Maintenance Analysis

### Can we use multiple libraries without hurting performance?

**Yes, if the code-splitting discipline is maintained.** The key insight is that the question is not "how large is the total bundle?" but "how much does each user download for each feature they use?"

With the recommended two-library stack:

```
A user exploring a research hypothesis that returns a KM curve:
  Downloads: Recharts (~90 KB) + Plotly (~1.4 MB)
  Total: ~1.5 MB gzipped

A user exploring a research hypothesis that returns only bar charts:
  Downloads: Recharts (~90 KB)
  Total: ~90 KB gzipped

A WOW 3 dashboard user who views a heatmap:
  Downloads: Recharts (~90 KB) + @nivo/heatmap (~25 KB)
  Total: ~115 KB gzipped
```

Compare this to an all-ECharts approach:
```
Every user, every feature:
  Downloads: ECharts (~500 KB gzipped)
  Total: ~500 KB gzipped — for every page, every time
```

The two-library stack is lighter for most users and heavier only for users who specifically view survival curves.

### Maintenance cost of multiple libraries

The real cost of multiple libraries is **cognitive overhead** for the engineering team, not performance:

- Engineers must know which library to reach for when adding a new chart
- TypeScript patterns differ: Recharts uses JSX props, Plotly uses JSON option objects
- Each library has its own API evolution / breaking change cadence

Mitigations in this project:

1. **Clear assignment rules** (this RFC): every chart type has an unambiguous library assignment. No chart is "could be either"
2. **`pathways/` folder isolation**: production components live in one folder regardless of which library they use. The page imports `AmputationRatePlot`, not `import Plot from 'react-plotly.js'`
3. **Consistent patterns**: all Plotly components follow the same `dynamic` + `as any` + `'use client'` template. TypeScript complexity is contained in the component, not propagated to consumers

### What if we go all-in on one library?

**All-in on ECharts:**
- Pros: native KM, native box plot, native heatmap, best zoom controls, single library to maintain
- Cons: JSON option object API — no JSX composition, no inline `<ReferenceLine>` or `<LabelList>`, `as any` needed for many real-world options. Higher cognitive cost for a team that already knows React deeply
- Bundle: ~500 KB gzipped for every user, every page

**All-in on Plotly:**
- Pros: best clinical chart rendering, modebar free, native risk tables
- Cons: ~1.4 MB gzipped for every user, requires `ssr: false` everywhere, TypeScript is almost entirely `as any`, JSON layout API
- Verdict: wasteful for comparison charts where Recharts produces identical output at 1/15th the size

**All-in on Recharts:**
- Pros: smallest bundle, best React ergonomics, best TypeScript
- Cons: no native KM, no native forest plot, no native risk table. All three P0 clinical charts require workarounds that are visually passable but semantically incorrect and maintenance-fragile

**Verdict: the two-library stack wins on total-cost-of-ownership.** It uses the best tool for each category: Recharts for standard comparison charts (where React ergonomics matter and bundle size matters), Plotly for clinical survival analysis charts (where semantic correctness and built-in clinical interactions matter), and `@nivo/heatmap` for one specific chart where it is visually superior to the alternatives.

---

## 7. Implementation Plan for Production

### 7.1 Folder Structure

```
src/
  components/
    charts/
      pathways/               ← production components (RFC-recommended stack)
        CohortComparisonCard.tsx    — pure JSX
        FreedomFromReintervention.tsx — Plotly
        AmputationRatePlot.tsx      — Plotly (km) or Recharts (bar)
        index.ts                    — barrel export
      recharts/               ← RFC side-by-side comparison (keep for reference)
      plotly/                 ← RFC side-by-side comparison (keep for reference)
      nivo/                   ← RFC side-by-side comparison (keep for reference)
      echarts/                ← RFC side-by-side comparison (keep for reference)
      ChartCard.tsx           — shared card wrapper (height prop added)
  lib/
    chart-data.ts             — typed dummy data + data contracts
  app/
    charts/
      p0/page.tsx             ← P0 production showcase
      recharts/page.tsx       ← RFC comparison
      plotly/page.tsx         ← RFC comparison
      ...
```

### 7.2 Data Contract Rules

All chart components accept props that match the JSON shape the Python/lifelines backend will return. The types in `src/lib/chart-data.ts` are the contracts:

- `KmDatum` — one time point in a survival curve: `{ time, survival, ci_lower, ci_upper, at_risk }`
- `FreedomFromReinterventionData` — multi-arm KM: `{ arms: [{ label, color, data: KmDatum[] }], logRankP, timeUnit }`
- `AmputationKmData` — time-to-amputation KM: `{ variant: 'km', arms, logRankP? }`
- `AmputationBarData` — cohort amputation rates: `{ variant: 'bar', cohorts: [{ label, right, left }] }`
- `CohortCardData` — stat card: `{ cohortName, n, medianFollowUp, metrics: [{ label, value, field }] }`

**The backend owns colors for survival curve arms** (so the AI can assign colours consistently across the KM chart and the cohort card). **The frontend owns colors for comparison charts** (bar, line, scatter — the frontend applies the palette).

### 7.3 SSR Rules

| Component type | Directive | Reason |
|---|---|---|
| `CohortComparisonCard` | None (Server Component) | Pure JSX, no browser APIs |
| Any Recharts component | `'use client'` | `ResizeObserver` / `window` usage |
| Any Plotly component | `'use client'` + `next/dynamic { ssr: false }` | Plotly accesses `window` on import |
| Any Nivo component | `'use client'` | Nivo uses `ResizeObserver` |
| Any ECharts component | `'use client'` + `next/dynamic { ssr: false }` | ECharts accesses `window` on import |
| Page files | None (Server Component) | Pages import `'use client'` components — boundary handled at component level |

### 7.4 TypeScript Patterns

**Recharts v3 Tooltip formatter** — `value` is `ValueType | undefined`, not `number`:
```tsx
<Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`]} />
```

**Plotly — suppress TypeScript** — all Plotly types are `Partial<DataTitle>`, `any`, or wrong. Use `as any` on the `Plot` constant:
```ts
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any
```

**Plotly KM CI band — trace order matters:**
Upper CI trace (invisible) must come before lower CI trace (`fill: 'tonexty'`). The fill direction is always from the previous trace upward. Getting this backwards renders no fill.

**Plotly risk table — column-oriented data:**
`cells.values` is column-oriented. `values[0]` is all rows of column 0 (arm labels), `values[1]` is all rows of column 1 (at_risk at time 0), etc. Not row-oriented.

**Nivo 0.99 API changes** (breaking from earlier versions):
- Tooltip point: `point.seriesId` (plural), not `point.serieId`
- No `labelFormat` prop on `ResponsiveBar` — use `label={(d) => \`${d.value}%\`}` instead

**ECharts heatmap data format:**
`series.data` must be `[[colIndex, rowIndex, value], ...]` (integer indices into the axis arrays), not `[['label', 'label', value]]` strings.

**ECharts BoxPlot data format:**
`data` must be `[[min, q1, median, q3, max], ...]` (fixed order array), not named fields.

### 7.5 Loading States

Every Plotly component should include a loading skeleton:
```ts
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded bg-gray-100" />,
}) as any
```

This prevents a blank chart area flashing before Plotly hydrates on the client. For the conference demo this matters — blank cards during the presentation read as broken, not loading.

---

## 8. Final Recommendation

```
Primary:    Recharts            — grouped bar, histogram, donut, scatter, line, stacked bar, horizontal bar, amputation bar
Specialist: react-plotly.js    — KM, FFR, amputation KM, forest plot, cumulative incidence
Narrow:     @nivo/heatmap      — hospital performance heatmap (WOW 3)
No library: Pure JSX           — Cohort Comparison Cards, stat callouts
```

### Performance budget per user

| User type | Libraries loaded | Approx. gzipped download |
|---|---|---|
| WOW 2 — hypothesis returns bar charts only | Recharts | ~90 KB |
| WOW 2 — hypothesis returns survival curves | Recharts + Plotly | ~1.5 MB |
| WOW 3 — dashboard with heatmap | Recharts + @nivo/heatmap | ~115 KB |
| WOW 3 — full dashboard | Recharts + @nivo/heatmap + Plotly | ~1.6 MB |

All figures are gzipped and exclude the base Next.js / React framework payload (~130 KB gzipped), which is constant regardless of charting library choice.

### Why not go all-in on ECharts?

ECharts is the most capable single library. If the constraint were "one library only," ECharts wins. The argument against it for Pathways AI is **React ergonomics**: ECharts uses a JSON option object rather than JSX composition. Every chart is `option = { series: [...], xAxis: {...} }`. There is no `<ReferenceLine>` or `<LabelList>` as a JSX child. TypeScript types for `EChartsOption` require `as any` workarounds frequently. For a team that thinks in React, maintaining ECharts option objects alongside JSX is a sustained cognitive tax.

Recharts is written for React developers. `<BarChart><Bar /><XAxis /><Tooltip /></BarChart>` is how React developers think. The mental model matches the rendering model.

Plotly earns its place through uniquely correct clinical chart rendering. KM curves, freedom from reintervention, and forest plots require semantics that no React-native library matches.

### Fallback: all-ECharts stack

If production telemetry shows Plotly's bundle size causing unacceptable load times (target: <3 seconds on 4G), the full replacement is:

```
KM curves:    ECharts — step line + stacked CI area (visual approximation, clinically acceptable)
FFR curve:    ECharts — same pattern, multi-arm, HTML table below for risk table
Forest plot:  ECharts — scatter + markLine + markPoint (approximation)
Box plots:    ECharts — native (better than Plotly for this)
Heatmap:      @nivo/heatmap — keep (ECharts heatmap is visually inferior)
```

Trade-offs of the ECharts fallback:
- Lose: Plotly modebar, `hovermode: 'x unified'` crosshair on survival curves, native risk table
- Gain: ~1 MB reduction in gzipped payload for survival curve users
- Net: acceptable for a production app, suboptimal for a conference demo where interactivity matters

---

*This RFC supersedes the v1 charting library evaluation. All four libraries were implemented against identical data (`src/lib/chart-data.ts`), the complete P0 production component set was built and validated, and per-chart library assignments reflect both technical correctness and the performance characteristics of the Next.js code-splitting model.*
