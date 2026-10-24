import { useMemo } from 'react'
import {
  BUREAUS,
  CHART_COLORS,
  isOpen,
  isOverdue,
  daysOpen,
  institutionLabel,
} from '../data/mockData.js'
import { Meter } from '../components/charts.jsx'
import Icon from '../components/Icon.jsx'

export default function Bureaus({ complaints, onSelect, filterByBureau }) {
  const rows = useMemo(() => {
    return BUREAUS.map((b, i) => {
      const own = complaints.filter((c) => c.bureauId === b.id)
      const open = own.filter(isOpen)
      const resolved = own.filter((c) => !isOpen(c))
      const breached = own.filter(isOverdue)
      const avgDays = resolved.length
        ? Math.round(resolved.reduce((s, c) => s + daysOpen(c), 0) / resolved.length)
        : 0
      const sla = own.length ? Math.round(((own.length - breached.length) / own.length) * 100) : 100
      const worst = own.filter((c) => c.priority === 'Critical' || c.priority === 'High').length
      return {
        ...b,
        color: CHART_COLORS[i % CHART_COLORS.length],
        total: own.length,
        open: open.length,
        escalated: open.filter((c) => c.status === 'Escalated').length,
        resolved: resolved.length,
        avgDays,
        sla,
        worst,
        sample: open[0],
      }
    }).sort((a, b) => b.open - a.open)
  }, [complaints])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Bureaus & Cells</h1>
        <p className="text-sm text-slate-500">
          Workload, resolution speed and SLA compliance for each AICTE bureau / cell
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((b) => (
          <div
            key={b.id}
            className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 h-9 w-1.5 shrink-0 rounded-full" style={{ background: b.color }} />
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold leading-snug text-slate-900">{b.name}</h2>
                <p className="text-xs text-slate-500">Nodal officer: {b.head}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              {[
                ['Open', b.open, 'text-slate-900'],
                ['Escalated', b.escalated, 'text-red-600'],
                ['Resolved', b.resolved, 'text-emerald-600'],
                ['Avg days', b.avgDays, 'text-slate-900'],
              ].map(([label, value, cls]) => (
                <div key={label} className="rounded-lg bg-slate-50 py-2">
                  <div className={`text-lg font-semibold ${cls}`}>{value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-500">SLA compliance</span>
                <span className={`font-semibold ${b.sla < 70 ? 'text-red-600' : 'text-slate-800'}`}>{b.sla}%</span>
              </div>
              <Meter pct={b.sla} tone={b.sla < 70 ? 'red' : b.sla < 90 ? 'amber' : 'green'} />
            </div>

            {b.sample && (
              <button
                onClick={() => onSelect(b.sample.id)}
                className="mt-4 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-400">
                  Latest open case
                  {b.worst > 0 && (
                    <span className="rounded bg-red-50 px-1.5 py-0.5 font-semibold text-red-600">
                      {b.worst} critical/high
                    </span>
                  )}
                </div>
                <div className="mt-1 line-clamp-2 text-xs font-medium text-slate-700">{b.sample.title}</div>
                <div className="mt-0.5 truncate text-[11px] text-slate-500">
                  {b.sample.id} · {institutionLabel(b.sample.institutionId)}
                </div>
              </button>
            )}

            <button
              onClick={() => filterByBureau(b.id)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all {b.total} complaints
              <Icon name="chevron" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
