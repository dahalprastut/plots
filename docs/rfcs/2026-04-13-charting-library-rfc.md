# RFC: React Charting Library Selection for Pathways AI

**Date:** 2026-04-13  
**Author:** RFC Experimentation Workspace  
**Status:** Final Recommendation  
**Scope:** WOW 2 (Research Hypothesis Explorer) + WOW 3 (Smart Operational Dashboards)

---

## Executive Summary

We implemented all 12 chart types in all four candidate libraries side-by-side using identical data. The recommendation is a **two-library stack**:

- **Recharts** — primary library for all standard charts (9 of 12 types)
- **react-plotly.js** — specialist library for KM survival curves and forest plots (2 of 12 types)
- **@nivo/heatmap** — single use for the hospital performance heatmap in WOW 3 (1 of 12 types)

ECharts is the **strongest single-library alternative** if bundle size from Plotly becomes a problem. Nivo is not recommended as a primary library.

---

## 1. The Four Libraries at a Glance

| | Recharts | Plotly | Nivo | ECharts |
|---|---|---|---|---|
| Version tested | 3.8.1 | 3.5.0 | 0.99.0 | 6.0.0 |
| Approx. bundle (uncompressed) | ~300 KB | ~4.6 MB | ~200–400 KB | ~1.5 MB |
| SSR-safe | ✅ Yes | ❌ Needs `ssr:false` | ⚠️ `use client` required | ❌ Needs `ssr:false` |
| TypeScript quality | ✅ Good (some v3 changes) | ⚠️ Incomplete (lots of `any`) | ⚠️ Incomplete | ⚠️ Strict but brittle |
| React idiom fit | ✅ JSX composition | ❌ JSON layout object | ✅ Prop-driven | ❌ JSON option object |
| Native KM curve | ❌ Approximation | ✅ Native (`hv` step + `tonexty`) | ❌ Approximation | ✅ Native (step + stack) |
| Native box plot | ❌ Stacked bar hack | ✅ Native pre-computed stats | ❌ Stacked bar hack | ✅ Native `boxplot` type |
| Native forest plot | ❌ Stacked bar + LabelList | ✅ Native `error_x` | ❌ Custom layer + `any` | ❌ Stack + markPoint |
| Native heatmap | ❌ CSS table fallback | ✅ Native `heatmap` trace | ✅ Native `ResponsiveHeatMap` | ✅ Native `heatmap` |

---

## 2. Interactivity Comparison

This was the most revealing part of the evaluation. Libraries diverge dramatically in what they give you for free.

### Plotly — Best Out-of-the-Box Interactivity

Plotly ships a modebar with zoom, pan, box-select, lasso-select, autoscale, download-as-PNG, and reset-axes built in. No configuration needed. For clinical charts shown at conferences, this matters — a clinician can zoom into a KM curve without the frontend team writing a single line of zoom code.

- `hovermode: 'x unified'` produces a shared crosshair tooltip across all series at the same time point — ideal for survival curves and time-series overlays
- `hovertemplate` gives full control over tooltip content without custom React components
- Zoom state persists during the session (users can explore, then double-click to reset)
- Built-in data export (PNG download from modebar)

**Verdict:** Best for charts that need to be explored interactively. KM curves and forest plots particularly benefit.

### ECharts — Best Zoom Controls for Dense Data

ECharts' `dataZoom` component (both `slider` and `inside`) is more polished than anything the other libraries offer natively. The slider version renders a mini-map of the full series below the chart — users can drag handles to zoom into a time window. The `inside` type lets users scroll-zoom directly on the chart area.

- `toolbox` gives data zoom + restore + save-as-image in a compact toolbar
- `legend` click-to-toggle is enabled by default for all series
- `tooltip.axisPointer` with `type: 'cross'` is excellent for time series
- Native `boxplot` type renders correctly with correct whisker semantics (no stacking hacks)

**Verdict:** Best when the dataset is dense (many time points, many series). The dataZoom slider is the clearest way to let users browse a long survival follow-up period.

### Recharts — Solid, But Requires More Custom Work

Recharts has a good `<Tooltip>` and `<Legend>` system, and `isAnimationActive` on all series gives smooth entry animations. Click-to-toggle series visibility on `<Legend>` works well. Custom tooltip content via a React component (`content={<MyTooltip />}`) is clean and type-safe.

What Recharts lacks is any built-in zoom or pan. For standard comparison charts (grouped bar, stacked bar, donut) this doesn't matter. But for time-series-heavy charts like the KM curve, you'd need to wire up brush or reference line manually.

**Verdict:** Excellent for comparison charts and dashboards where tooltips and legends are enough. Not the right choice for exploratory time-series charts.

### Nivo — Good Animations, Limited Interactivity

Nivo's `motionConfig: 'gentle'` produces the nicest mount animations of the four libraries. The `useMesh` prop on line charts gives accurate hover detection. But there is no built-in zoom, no download, and no pan.

The `ResponsiveLine` component's hover system requires `useMesh` which uses a voronoi mesh — accurate but adds complexity. The `legends` array supports `toggleSerie` but only for certain chart types. Custom layers (needed for the forest plot reference line and HR diamonds) require working with an undocumented context object typed as `any`, which is fragile.

**Verdict:** Better than Recharts for visual polish out of the box, worse for interactive exploration. Recommended only where Nivo has a native advantage: `@nivo/heatmap`.

---

## 3. Per-Chart-Type Recommendation

### P0 Charts (Must Get Right for the Demo)

**Kaplan-Meier Survival Curve → Plotly**

Plotly is the only library that natively handles the three requirements of a clinical KM chart:
1. Step-function line (`line.shape: 'hv'`) — no approximation
2. Confidence interval band with `fill: 'tonexty'` between upper and lower CI traces
3. `hovermode: 'x unified'` for clean unified tooltips at each time point

The ECharts version (step line + stacked area stack trick) is a close second and would be the fallback if Plotly's bundle size becomes unacceptable. Recharts' `type="stepAfter"` + stacked CI area works but the tooltip suppression (returning `null` from `formatter`) is undocumented behaviour that could break on a Recharts update.

**Grouped Bar Chart → Recharts**

All four libraries handle this well. Recharts wins because it produces the clearest, most React-native code, smallest bundle contribution, and no `ssr:false` workaround. The bar chart is P0 and will appear in every research hypothesis response — keeping it in the primary library reduces the component graph.

**Forest Plot (HR + CI) → Plotly**

Plotly's `error_x` trace with `symmetric: false` and separate `array`/`arrayminus` is the only approach that renders horizontal CI bars as a first-class chart type. Every other library uses a stacked horizontal bar approximation (transparent spacer bar + colored CI range bar + manual HR point marker). The approximation works visually but has quirks: the CI bar `radius` applies to the spacer too, tooltip areas are off-center, and the HR point must be positioned manually.

The Plotly version has none of these problems and also gets the modebar for free.

### P1 Charts

**Box Plot → ECharts** (if needed standalone) / **Plotly** (if already loaded on page)

ECharts has the cleanest native `boxplot` series type: pass `[min, q1, median, q3, max]` per group, done. Plotly's pre-computed stats format (`q1: [val]`, `median: [val]`) is also native but requires array wrapping. Both are correct. Recharts and Nivo require 5-stacked-bar approximations that look correct but have tooltip detection issues (hovering a bar reports the partial bar value, not the full box stats).

For Pathways AI, box plots will likely appear on a page that already loads Plotly (it's a P1 chart shown alongside KM curves in Research Hypotheses). So Plotly wins by co-location.

**Histogram → Recharts**

Dead simple bar chart. All libraries are equivalent. Recharts wins on bundle economy.

**Donut / Pie → Recharts**

`<PieChart>` with `<Pie>` and `innerRadius` is clean. Nivo's `ResponsivePie` is slightly prettier (the `arcLinkLabelsColor: { from: 'color' }` feature produces nicer label lines) but not enough to justify an extra library import.

**Scatter Plot → ECharts** or **Recharts**

ECharts' built-in `toolbox` with `dataZoom` is a real differentiator for scatter plots — users can zoom into dense clusters. For a demo that may show 500+ patient points, the ability to zoom in without custom code is significant. If the scatter plot appears on the same page as ECharts is already loaded, use ECharts. Otherwise Recharts is fine.

**Line / Area → Recharts**

ComposedChart with Line + Area for the shadow fill is clean and readable. No need for a specialist library.

**Stacked Bar → Recharts**

All four libraries handle this identically. Recharts wins on bundle economy.

### P2 Charts

**Horizontal Bar → Recharts**

The `Cell`-based conditional fill (highlighting "Your Site") and the `<ReferenceLine>` for the registry average are both trivial in Recharts. No specialist library needed.

**Heatmap → @nivo/heatmap**

This is the only chart type where the library assignment changes the conclusion. Recharts has no native heatmap — the implementation is a pure CSS table. ECharts and Plotly have native heatmaps but produce a more "data tool" aesthetic. `@nivo/heatmap` produces the cleanest visual for the hospital performance grid in WOW 3: smooth color interpolation, the `blues` sequential scheme maps directly to the Fivos palette, and the cell layout is clearly a grid of hospital metrics rather than a generic correlation matrix.

**Cumulative Incidence Curve → Recharts** or **Plotly**

Recharts `<AreaChart>` with two independent `<Area>` series handles this well. If this chart appears alongside a KM curve (likely in Research Hypotheses), Plotly is already loaded and the `fill: 'tozeroy'` approach is cleaner. Otherwise Recharts is sufficient.

---

## 4. Bundle Size Reality Check

The 4.6 MB chunk in the production build is `plotly.js`. This is the main concern with the Plotly recommendation.

**Mitigation:** Plotly is loaded via `next/dynamic` with `{ ssr: false }` on every component. Next.js code-splits it into its own chunk that is only loaded when the user navigates to a page containing a Plotly chart. If the Python backend determines that a research hypothesis answer requires a KM curve, those components load. Otherwise, Plotly never touches the wire.

**If 4.6 MB is still unacceptable:** ECharts is the full replacement for Plotly. It handles KM curves (step + stacked CI bands), forest plots (stack + markPoint + markLine), and box plots (native) with a 1.5 MB footprint. The tradeoff is losing Plotly's modebar and the `hovermode: 'x unified'` crosshair, which are genuinely the best hover interactions for survival curves.

---

## 5. Final Recommendation

```
Primary:    Recharts            — 9 of 12 chart types
Specialist: react-plotly.js     — KM curve + forest plot (+ box plot if on same page)
Narrow:     @nivo/heatmap       — hospital performance heatmap (WOW 3 only)
```

This validates the original RFC hypothesis. After building all 48 implementations, the recommendation stands.

### Why not go all-in on ECharts?

ECharts is the most capable single library. It has native box plots, native heatmaps, native step-line KM curves, and the best zoom controls. If the goal were a single-library stack with no bundle compromise, ECharts wins.

The argument against it for Pathways AI is **developer ergonomics**. ECharts uses a JSON option object (inherited from the original Apache ECharts C++ architecture) rather than React JSX props. Every chart is `option = { series: [...], xAxis: {...}, ... }`. There is no JSX composition, no React component tree for the chart internals, and no way to put a `<ReferenceLine>` or `<LabelList>` inline as a JSX child. TypeScript types for `EChartsOption` are strict in ways that require `as any` workarounds on many real-world options.

Recharts is written for React developers. `<BarChart><Bar /><XAxis /><Tooltip /></BarChart>` is how React developers think about composition. For a team that already knows React deeply, the cognitive overhead of maintaining ECharts option objects alongside JSX is a real cost.

Plotly has the same JSON-object ergonomics problem but earns its place through uniquely correct clinical chart rendering (KM, forest plot) that no React-native library matches.

### Why not go all-in on Plotly?

The modebar and `hovermode: 'x unified'` are genuinely excellent. But Plotly at 4.6 MB adds a significant cold-load penalty, requires `ssr: false` everywhere, and produces TypeScript code that is almost entirely `as any`. Using it for a grouped bar chart or donut chart — charts where Recharts is identical in visual output and a tenth of the size — is wasteful.

### The heatmap is the only chart where Nivo wins outright

`@nivo/heatmap` produces better visual output than the alternatives for the hospital performance grid. The `blues` scheme, smooth cell animations, and built-in cell value labels match the clinical dashboard aesthetic better than Plotly's diverging colorscale or ECharts' split-area grid. The narrow scope (one chart, one import, `@nivo/heatmap` only) means the cost of the third dependency is low.

---

## 6. Implementation Notes for the Production Component

When moving from this RFC prototype to the production component library:

1. **Recharts `<Tooltip>` formatter types** — v3 changed `ValueType` to include `undefined`. Wrap every formatter value with `Number(v)` rather than casting `v as number`. Do not use `value: number` in the parameter type.

2. **Plotly KM CI band** — the `tonexty` fill goes from the lower CI trace to the upper CI trace, not to zero. The order of traces in the `data` array matters: upper CI first (invisible), then lower CI (invisible, with `fill: 'tonexty'`), then the survival line on top.

3. **Nivo `seriesId` spelling** — Nivo 0.99 changed the tooltip point property from `serieId` (old) to `seriesId` (new). The plural form. This broke all KM and cumulative incidence tooltip code written against Nivo 0.87 examples in the documentation.

4. **ECharts heatmap data format** — the `series.data` array for a heatmap must be `[xIndex, yIndex, value]` tuples (integer indices into the axis arrays), not `[xLabel, yLabel, value]` strings. The axis arrays are `xAxis.data` and `yAxis.data`. This is different from Plotly's `z` matrix and Nivo's `{ id, data: [{x, y}] }` format.

5. **ECharts BoxPlot data format** — `data` is `[[min, q1, median, q3, max], ...]` (one array per box, in that fixed order). Not an object. Not named fields.

---

*This RFC supersedes the earlier library evaluation spec. All four libraries were implemented against identical data (`src/lib/chart-data.ts`), verified in a production Next.js build, and compared at the component level.*
