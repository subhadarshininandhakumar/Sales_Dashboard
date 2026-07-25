import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const PALETTE = ['#5B8CFF', '#33D6A6', '#F5B942', '#FF6B6B', '#8B7CFF', '#3EC6E0']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded border border-surface-line bg-surface-raised px-3 py-2 shadow-lg">
      <p className="font-mono text-xs text-text">{d.name}</p>
      <p className="tabular font-mono text-[11px] text-text-muted">
        ${d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </p>
    </div>
  )
}

export default function CategoryBreakdownChart({ data }) {
  return (
    <div className="rounded-card border border-surface-line bg-surface p-4">
      <h2 className="font-display text-sm font-semibold text-text">Revenue by category</h2>
      <p className="text-xs text-text-muted">Share of total, current filter</p>
      <div className="mt-1 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="#0A0F1A" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-text-muted">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
