import { useMemo, useState } from 'react'

const COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'region', label: 'Region' },
  { key: 'units', label: 'Units', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' },
]

const PAGE_SIZE = 12

export default function DataTable({ rows }) {
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [rows, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageRows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  function toggleSort(key) {
    if (key === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(0)
  }

  return (
    <div className="rounded-card border border-surface-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-text">Transactions</h2>
        <p className="font-mono text-[11px] text-text-muted">{rows.length.toLocaleString()} rows</p>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead>
            <tr className="border-b border-surface-line text-text-muted">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`cursor-pointer select-none py-2 font-mono font-normal uppercase tracking-wide hover:text-text ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i} className="border-b border-surface-line/50 text-text hover:bg-surface-raised/60">
                <td className="tabular py-2 font-mono">{row.date}</td>
                <td className="py-2">{row.product}</td>
                <td className="py-2 text-text-muted">{row.category}</td>
                <td className="py-2 text-text-muted">{row.region}</td>
                <td className="tabular py-2 text-right font-mono">{row.units}</td>
                <td className="tabular py-2 text-right font-mono text-signal-up">
                  ${row.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-text-muted">
                  No transactions match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="rounded border border-surface-line px-2 py-1 text-[11px] text-text-muted disabled:opacity-30 hover:text-text"
        >
          Previous
        </button>
        <p className="font-mono text-[11px] text-text-muted">
          Page {page + 1} of {pageCount}
        </p>
        <button
          disabled={page >= pageCount - 1}
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          className="rounded border border-surface-line px-2 py-1 text-[11px] text-text-muted disabled:opacity-30 hover:text-text"
        >
          Next
        </button>
      </div>
    </div>
  )
}
