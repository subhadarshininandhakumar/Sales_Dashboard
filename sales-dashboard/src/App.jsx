import { useMemo, useState } from 'react'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import FiltersPanel from './components/FiltersPanel'
import KPICard from './components/KPICard'
import RevenueTrendChart from './components/RevenueTrendChart'
import TopProductsChart from './components/TopProductsChart'
import CategoryBreakdownChart from './components/CategoryBreakdownChart'
import DataTable from './components/DataTable'
import { sampleData } from './data/sampleData'

function uniq(arr) {
  return [...new Set(arr)].sort()
}

function bucketLabel(dateStr, granularity) {
  const d = new Date(dateStr)
  if (granularity === 'day') return dateStr
  if (granularity === 'week') {
    const onejan = new Date(d.getFullYear(), 0, 1)
    const week = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7)
    return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function App() {
  const [rawData, setRawData] = useState(sampleData)
  const [sourceLabel, setSourceLabel] = useState('demo-data.csv')
  const [granularity, setGranularity] = useState('month')

  const dataBounds = useMemo(() => {
    const dates = rawData.map((r) => r.date).sort()
    return { min: dates[0], max: dates[dates.length - 1] }
  }, [rawData])

  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [filters, setFilters] = useState({ categories: [], regions: [] })

  const options = useMemo(
    () => ({
      categories: uniq(rawData.map((r) => r.category)),
      regions: uniq(rawData.map((r) => r.region)),
    }),
    [rawData]
  )

  // Initialize filters/date-range whenever a new dataset loads
  const effectiveStart = dateRange.start || dataBounds.min
  const effectiveEnd = dateRange.end || dataBounds.max
  const effectiveCategories = filters.categories.length ? filters.categories : options.categories
  const effectiveRegions = filters.regions.length ? filters.regions : options.regions

  const filtered = useMemo(() => {
    return rawData.filter(
      (r) =>
        r.date >= effectiveStart &&
        r.date <= effectiveEnd &&
        effectiveCategories.includes(r.category) &&
        effectiveRegions.includes(r.region)
    )
  }, [rawData, effectiveStart, effectiveEnd, effectiveCategories, effectiveRegions])

  // KPI calculations, with prior-period comparison of equal length
  const kpis = useMemo(() => {
    const totalRevenue = filtered.reduce((s, r) => s + r.revenue, 0)
    const totalUnits = filtered.reduce((s, r) => s + r.units, 0)
    const orders = filtered.length
    const aov = orders ? totalRevenue / orders : 0

    const start = new Date(effectiveStart)
    const end = new Date(effectiveEnd)
    const spanDays = Math.max(1, Math.round((end - start) / 86400000))
    const priorEnd = new Date(start)
    priorEnd.setDate(priorEnd.getDate() - 1)
    const priorStart = new Date(priorEnd)
    priorStart.setDate(priorStart.getDate() - spanDays)
    const priorStr = priorStart.toISOString().slice(0, 10)
    const priorEndStr = priorEnd.toISOString().slice(0, 10)

    const priorRows = rawData.filter(
      (r) =>
        r.date >= priorStr &&
        r.date <= priorEndStr &&
        effectiveCategories.includes(r.category) &&
        effectiveRegions.includes(r.region)
    )
    const priorRevenue = priorRows.reduce((s, r) => s + r.revenue, 0)
    const priorUnits = priorRows.reduce((s, r) => s + r.units, 0)
    const priorOrders = priorRows.length
    const priorAov = priorOrders ? priorRevenue / priorOrders : 0

    const delta = (curr, prev) => (prev > 0 ? ((curr - prev) / prev) * 100 : 0)

    return {
      totalRevenue,
      totalUnits,
      orders,
      aov,
      deltaRevenue: delta(totalRevenue, priorRevenue),
      deltaUnits: delta(totalUnits, priorUnits),
      deltaOrders: delta(orders, priorOrders),
      deltaAov: delta(aov, priorAov),
    }
  }, [filtered, rawData, effectiveStart, effectiveEnd, effectiveCategories, effectiveRegions])

  const trendData = useMemo(() => {
    const map = new Map()
    for (const r of filtered) {
      const label = bucketLabel(r.date, granularity)
      map.set(label, (map.get(label) || 0) + r.revenue)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([label, revenue]) => ({ label, revenue }))
  }, [filtered, granularity])

  const sparkFor = (metric) => {
    const map = new Map()
    for (const r of filtered) {
      const label = bucketLabel(r.date, 'month')
      map.set(label, (map.get(label) || 0) + r[metric])
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => ({ v }))
  }

  const topProducts = useMemo(() => {
    const map = new Map()
    for (const r of filtered) {
      const entry = map.get(r.product) || { name: r.product, revenue: 0, units: 0 }
      entry.revenue += r.revenue
      entry.units += r.units
      map.set(r.product, entry)
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8).reverse()
  }, [filtered])

  const categoryBreakdown = useMemo(() => {
    const map = new Map()
    for (const r of filtered) {
      map.set(r.category, (map.get(r.category) || 0) + r.revenue)
    }
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered])

  function handleImportedData(rows, filename) {
    setRawData(rows)
    setSourceLabel(filename)
    setDateRange({ start: '', end: '' })
    setFilters({ categories: [], regions: [] })
  }

  function handleReset() {
    setRawData(sampleData)
    setSourceLabel('demo-data.csv')
    setDateRange({ start: '', end: '' })
    setFilters({ categories: [], regions: [] })
  }

  return (
    <div className="min-h-screen font-body">
      <Header sourceLabel={sourceLabel} rowCount={rawData.length} onReset={handleReset} />

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* Left rail: import + filters */}
          <aside className="space-y-4">
            <FileUpload onData={handleImportedData} />
            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              options={options}
              dateRange={{ start: effectiveStart, end: effectiveEnd }}
              setDateRange={setDateRange}
              dataBounds={dataBounds}
            />
          </aside>

          {/* Main analysis canvas */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <KPICard
                index={0}
                label="Total Revenue"
                value={`$${kpis.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                delta={kpis.deltaRevenue}
                spark={sparkFor('revenue')}
                accent="accent"
              />
              <KPICard
                index={1}
                label="Units Sold"
                value={kpis.totalUnits.toLocaleString()}
                delta={kpis.deltaUnits}
                spark={sparkFor('units')}
                accent="up"
              />
              <KPICard
                index={2}
                label="Orders"
                value={kpis.orders.toLocaleString()}
                delta={kpis.deltaOrders}
                spark={sparkFor('units')}
                accent="warn"
              />
              <KPICard
                index={3}
                label="Avg Order Value"
                value={`$${kpis.aov.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                delta={kpis.deltaAov}
                accent="accent"
              />
            </div>

            <RevenueTrendChart data={trendData} granularity={granularity} setGranularity={setGranularity} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <TopProductsChart data={topProducts} />
              <CategoryBreakdownChart data={categoryBreakdown} />
            </div>

            <DataTable rows={filtered} />
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-[1400px] px-6 pb-8 pt-2">
        <p className="font-mono text-[11px] text-text-faint">
          Ledger — import your own sales data or explore the bundled demo dataset. Built with React, Recharts, and Tailwind.
        </p>
      </footer>
    </div>
  )
}
