import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PALETTE = ['#5B8CFF', '#33D6A6', '#F5B942', '#FF6B6B', '#8B7CFF', '#3EC6E0']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded border border-surface-line bg-surface-raised px-3 py-2 shadow-lg">
      <p className="font-mono text-xs text-text">{d.name}</p>
      <p className="tabular font-mono text-[11px] text-text-muted">
        ${d.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {d.units.toLocaleString()} units
      </p>
    </div>
  )
}

export default function TopProductsChart({ data }) {
  return (
    <div className="rounded-card border border-surface-line bg-surface p-4">
      <h2 className="font-display text-sm font-semibold text-text">Top products</h2>
      <p className="text-xs text-text-muted">Ranked by revenue, current filter</p>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#22304A" horizontal={false} />
            <XAxis
              type="number"
              stroke="#4B5872"
              tick={{ fontSize: 11, fill: '#7C8AA5' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#4B5872"
              tick={{ fontSize: 11, fill: '#B7C0D4' }}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(91,140,255,0.06)' }} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
