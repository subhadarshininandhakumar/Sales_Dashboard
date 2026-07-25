export default function Header({ sourceLabel, rowCount, onReset }) {
  return (
    <header className="flex items-center justify-between border-b border-surface-line px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-signal-accent/40 bg-signal-accent/10">
          <span className="font-mono text-sm text-signal-accent">$</span>
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold leading-none tracking-tight">Ledger</h1>
          <p className="mt-1 text-xs text-text-muted">Sales &amp; Revenue Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="font-mono text-xs text-text-muted">SOURCE</p>
          <p className="font-mono text-sm text-text">{sourceLabel} · {rowCount.toLocaleString()} rows</p>
        </div>
        <button
          onClick={onReset}
          className="rounded border border-surface-line px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-signal-accent/50 hover:text-text"
        >
          Reset to demo data
        </button>
      </div>
    </header>
  )
}
