import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded border border-surface-line bg-surface-raised px-3 py-2 shadow-lg">
      <p className="font-mono text-[11px] text-text-muted">{label}</p>
      <p className="tabular font-mono text-sm text-text">
        ${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </p>
    </div>
  )
}

export default function RevenueTrendChart({ data, granularity, setGranularity }) {
  return (
    <div className="rounded-card border border-surface-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold text-text">Revenue trend</h2>
          <p className="text-xs text-text-muted">Revenue over time, by {granularity}</p>
        </div>
        <div className="flex gap-1 rounded border border-surface-line p-0.5">
          {['day', 'week', 'month'].map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`rounded px-2 py-1 text-[11px] capitalize transition-colors ${
                granularity === g ? 'bg-signal-accent/15 text-signal-accent' : 'text-text-muted hover:text-text'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8CFF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5B8CFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#22304A" vertical={false} />
            <XAxis dataKey="label" stroke="#4B5872" tick={{ fontSize: 11, fill: '#7C8AA5' }} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#4B5872"
              tick={{ fontSize: 11, fill: '#7C8AA5' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#5B8CFF" strokeWidth={2} fill="url(#revenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
