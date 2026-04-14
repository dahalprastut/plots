# Pathways AI — RFC Experimentation & Visualization Research

## What This Is

This is an experimentation workspace for the **Fivos / Pathways AI** project, built by Actual Reality Technology for Fivos — a US healthcare data company that operates clinical registries (primarily the PVI registry) on behalf of medical societies. The immediate goal is a **conference demo by June 8, 2026** (code-complete by May 29).

The full project (Pathways AI) has three demo moments:
- **WOW 1** — AI-powered clinical data abstraction (operative notes → registry fields)
- **WOW 2** — Research Hypothesis Explorer (natural language → survival analysis → charts)
- **WOW 3** — Smart Operational Dashboards (benchmarking, anomaly detection, NL widget builder)

This workspace is specifically focused on **WOW 2 and WOW 3 visualization** — figuring out the right charting stack for the Next.js frontend before committing to a production implementation.

---

## What I Am Experimenting With

### 1. RFC Candidates — React Charting Libraries

The RFC evaluated five libraries. I am building small prototypes of each to validate the recommendations before locking in. The libraries under evaluation are:

**Recharts** — primary candidate for standard charts (bar, line, area, donut, histogram, scatter). Composable JSX model, small bundle (~90KB), excellent TypeScript. Testing it against the grouped bar chart (reintervention by artery type), box plot (distribution comparison), and line chart (trend over time).

**react-plotly.js** — specialist candidate for Kaplan-Meier survival curves and forest plots only. Chosen because it natively supports step-function lines (`line.shape: 'hv'`), confidence interval bands (`fill: 'tonexty'`), risk tables as subplots, and horizontal error bars for hazard ratios. Must be loaded with `next/dynamic` and `ssr: false` in Next.js. Testing the full KM chart with CI bands, risk table, p-value annotation, and hazard ratio forest plot.

**@nivo/heatmap** — narrow candidate for the hospital performance heatmap in WOW 3 only. Testing visual quality and theming against the Fivos color palette.

**ECharts (echarts-for-react)** — alternative candidate being evaluated for large-dataset performance and step-line KM rendering. May replace react-plotly.js if the bundle size proves problematic.

### 2. D3 Experimentation

Separately, I am experimenting with **D3.js** to understand what level of customization is possible beyond what the libraries above provide. D3 is not a charting library — it is a visualization toolkit. Recharts and Nivo are both built on top of it.

D3 experiments are focused on:

**Custom KM chart** — building a Kaplan-Meier curve from scratch in D3 to see if I can produce a better result than react-plotly.js. Specifically trying to add censoring tick marks, animated drawing of the curve, coordinated brushing between the curve and risk table, and visual design that matches a clinical research aesthetic more closely than Plotly's defaults.

**Custom forest plot** — testing whether D3's flexibility produces a cleaner hazard ratio visualization than Plotly's `error_x` trace, particularly for multi-variable forest plots with grouping and color encoding.

**Responsive SVG layouts** — testing D3's `scaleLinear`, `scaleBand`, and `axisBottom` utilities for building chart primitives that Recharts does not expose directly. Even if I use Recharts for final rendering, D3's math utilities (scales, paths) can be used inside custom Recharts components.

The D3 work is exploratory. If a D3 component is significantly better than the library equivalent, it becomes a candidate for the production component. If it is not worth the complexity, Recharts + react-plotly.js stays as the recommendation.

---

## The Data

The primary dataset is the **PVI follow-up CSV** — 40,639 rows × 182 columns of synthetic but clinically representative vascular procedure data.

Key fields to know:
- `PRIMPROCID` — unique procedure identifier (primary key)
- `LTFID` — unique follow-up identifier (one procedure can have multiple follow-ups)
- `SURGERY_DT` / `LTFDATE` / `DISCHARGE_DT` — temporal anchors for time-to-event analysis
- `LTFSMOKING` / `SMOKING_DISCHARGE` — smoking status variables
- `PVI_SITEREINTER_1` through `_4` — reintervention flags per treated artery (primary outcome variable)
- `LTF_AMP_R` / `LTF_AMP_L` — amputation flags (right/left)
- `ARTERY_TREATED_1` through `_4` — which arteries were treated

**Critical flattening rule (Doug's "first event / last status" rule):** A patient can have multiple follow-up rows. For adverse events (death, amputation, reintervention), use the FIRST occurrence. For status variables (ambulatory status), use the LAST follow-up with data. This must happen in Python before any data reaches the frontend.

The frontend only ever receives pre-computed chart data from the Python backend — it never queries the raw CSV directly.

---

## The Chart Types I Need to Cover

These are the 12 chart types identified as relevant for the full Pathways AI scope:

| # | Chart | Category | Priority | Assigned Library |
|---|-------|----------|----------|-----------------|
| 1 | Kaplan-Meier survival curve | Time-to-event | P0 | react-plotly.js / D3 experiment |
| 2 | Grouped bar chart | Comparison | P0 | Recharts |
| 3 | Forest plot (HR + CI) | Subgroup comparison | P0 | react-plotly.js / D3 experiment |
| 4 | Box plot | Distribution comparison | P1 | Recharts |
| 5 | Histogram | Distribution | P1 | Recharts |
| 6 | Donut / pie chart | Proportions | P1 | Recharts |
| 7 | Scatter plot | Correlation | P1 | Recharts |
| 8 | Line / area chart | Trends over time | P1 | Recharts |
| 9 | Stacked bar chart | Composition over time | P1 | Recharts |
| 10 | Horizontal bar (ranked) | Benchmarking | P2 | Recharts |
| 11 | Heatmap | Correlation matrix | P2 | @nivo/heatmap |
| 12 | Cumulative incidence curve | Competing risks | P2 | react-plotly.js / D3 experiment |

For each hypothesis a user asks, the plan is to surface **3-4 charts** that answer the question from different angles:
- One primary chart that directly answers the question
- One or two secondary charts that add context or slice the data differently
- One stat callout (cohort summary cards — these are pure JSX, no library)

---

## Tech Stack Context

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Charts:** Recharts (primary) + react-plotly.js (specialist) + @nivo/heatmap (WOW 3 heatmap)
- **D3:** Used either standalone for custom components or as math utilities inside Recharts custom shapes
- **Backend:** Python (FastAPI) — handles all data computation (lifelines for survival analysis), all LLM calls, and all database queries. Frontend only receives final chart-ready JSON.
- **Data pipeline:** Neo4j (schema/data dictionary RAG) → LLM (query spec generation) → Oracle (patient data) → Python/lifelines (computation) → Next.js (rendering)

All chart components live in `components/charts/` and export through a single `index.ts`. No page ever imports directly from recharts, plotly, or nivo — only from the internal chart components. This keeps library swaps isolated.

---

## What Good Looks Like

A successful experiment produces a reusable React component that:
1. Accepts a typed props interface matching the JSON shape the Python backend will return
2. Renders correctly in Next.js App Router (handles SSR constraints for plotly)
3. Is responsive — readable on both a laptop and a projected conference screen
4. Matches a clinical research aesthetic — clean, no chartjunk, readable at a distance
5. Has a loading skeleton state for when data is being fetched

For D3 experiments specifically, the bar is higher — a D3 component only replaces a library component if it is meaningfully better in visual quality or interaction, not just equivalent.

---

## References

- RFC: Intelligent Plots for Pathways AI (Python-side — lifelines + Plotly) — covers the backend computation stack
- RFC: React Visualization Libraries for Pathways AI — covers the full library evaluation this workspace is validating
- Pathways AI Demo Script — the 12-15 minute conference script that defines what success looks like
- PVI Data Dictionary (Neo4j / Doug Greene) — source of truth for all field names and clinical definitions
