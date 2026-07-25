function MultiSelect({ label, options, selected, onChange }) {
  function toggle(opt) {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt))
    else onChange([...selected, opt])
  }
  const allSelected = selected.length === options.length

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
        <button
          onClick={() => onChange(allSelected ? [] : options)}
          className="text-[11px] text-signal-accent hover:underline"
        >
          {allSelected ? 'Clear' : 'All'}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`rounded border px-2 py-1 text-xs transition-colors ${
                active
                  ? 'border-signal-accent/60 bg-signal-accent/10 text-text'
                  : 'border-surface-line text-text-muted hover:border-surface-line/80 hover:text-text'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FiltersPanel({ filters, setFilters, options, dateRange, setDateRange, dataBounds }) {
  return (
    <div className="space-y-5 rounded-card border border-surface-line bg-surface p-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted">Date range</p>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="date"
            value={dateRange.start}
            min={dataBounds.min}
            max={dataBounds.max}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full rounded border border-surface-line bg-surface-raised px-2 py-1.5 font-mono text-xs text-text [color-scheme:dark]"
          />
          <span className="text-text-faint">–</span>
          <input
            type="date"
            value={dateRange.end}
            min={dataBounds.min}
            max={dataBounds.max}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full rounded border border-surface-line bg-surface-raised px-2 py-1.5 font-mono text-xs text-text [color-scheme:dark]"
          />
        </div>
      </div>

      <MultiSelect
        label="Category"
        options={options.categories}
        selected={filters.categories}
        onChange={(v) => setFilters({ ...filters, categories: v })}
      />
      <MultiSelect
        label="Region"
        options={options.regions}
        selected={filters.regions}
        onChange={(v) => setFilters({ ...filters, regions: v })}
      />
    </div>
  )
}
