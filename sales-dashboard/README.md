# Ledger — Sales & Revenue Analysis Dashboard

An interactive dashboard for exploring sales and revenue data: import a CSV/Excel
file (or use the bundled demo dataset), track KPIs, and drill into trends by
date, category, region, and product.

![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Recharts-5B8CFF)

## Features

- **Import your own data** — drag-and-drop or browse for a `.csv`, `.xlsx`, or `.xls` file.
  Column headers are auto-detected (e.g. `Sales`, `Amount`, or `Total Revenue` are all read as revenue).
- **KPI strip** — Total Revenue, Units Sold, Orders, and Average Order Value, each with a
  period-over-period delta and a trend sparkline.
- **Revenue trend chart** — switch between day / week / month granularity.
- **Top products** — ranked bar chart of best sellers by revenue.
- **Revenue by category** — donut breakdown.
- **Filters / slicers** — date range, category, and region, all composable and applied
  across every chart and the transaction table.
- **Transaction table** — sortable, paginated line-level detail.

## Data format

If you bring your own file, include these columns (any reasonable header spelling is
auto-mapped — e.g. `qty` → units, `sales`/`amount` → revenue):

| date       | product        | category    | region | units | revenue |
|------------|----------------|-------------|--------|-------|---------|
| 2025-01-15 | Wireless Earbuds | Electronics | North  | 2     | 118.00  |

No file? The dashboard loads with a year of generated demo data automatically.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## Deploy

### Option A — Vercel (recommended, ~2 minutes)

1. Push this folder to a new GitHub repository (see below).
2. Go to https://vercel.com/new and import that repository.
3. Vercel auto-detects the Vite framework preset — leave settings as-is and click **Deploy**.
4. You'll get a live URL like `https://your-repo-name.vercel.app`.

Or from the CLI:

```bash
npm i -g vercel
vercel --prod
```

### Option B — Netlify

1. Push to GitHub.
2. New site from Git → pick the repo.
3. Build command: `npm run build`, publish directory: `dist`.

### Option C — GitHub Pages

```bash
npm run build
# then deploy the `dist/` folder using your preferred gh-pages action
```

## Push this project to GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial commit: sales & revenue dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then import the repo at https://vercel.com/new to get your live link.

## Tech stack

- [Vite](https://vitejs.dev/) + React 18
- [Recharts](https://recharts.org/) for charts
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [PapaParse](https://www.papaparse.com/) for CSV parsing
- [SheetJS (xlsx)](https://sheetjs.com/) for Excel parsing

## Project structure

```
sales-dashboard/
├── src/
│   ├── components/       # KPI cards, charts, filters, table, upload
│   ├── data/              # bundled demo dataset generator
│   ├── utils/parseFile.js # CSV/Excel import + column normalization
│   ├── App.jsx            # state, filtering, KPI math
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

## What you'll practice

- **Data visualization** — line/area, bar, and donut charts driven by the same filtered dataset.
- **KPI tracking** — aggregate metrics with period-over-period comparisons.
- **Interactive analysis** — composable filters/slicers, sorting, and drill-down.
- **Business insight generation** — spot trends, top performers, and category mix at a glance.
