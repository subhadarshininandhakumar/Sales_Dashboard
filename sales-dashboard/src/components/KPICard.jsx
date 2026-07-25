import { AreaChart, Area, ResponsiveContainer } from 'recharts'

export default function KPICard({ label, value, delta, spark, format = 'number', accent = 'accent', index = 0 }) {
  const positive = delta >= 0
  const colorMap = {
    accent: '#5B8CFF',
    up: '#33D6A6',
    warn: '#F5B942',
  }
  const strokeColor = colorMap[accent] || colorMap.accent

  return (
    <div
      className="animate-rise relative overflow-hidden rounded-card border border-surface-line bg-surface p-4"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="tabular font-mono text-2xl font-medium text-text">{value}</p>
        {delta !== undefined && (
          <span className={`tabular font-mono text-xs ${positive ? 'text-signal-up' : 'text-signal-down'}`}>
            {positive ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {spark && spark.length > 1 && (
        <div className="mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={strokeColor}
                strokeWidth={1.5}
                fill={`url(#spark-${label})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
