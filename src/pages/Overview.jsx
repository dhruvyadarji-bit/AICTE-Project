import { useMemo } from 'react'
import {
  BUREAUS,
  STATUSES,
  CHART_COLORS,
  toISO,
  TODAY,
  parseDate,
  isOverdue,
  isOpen,
  daysOverdue,
  formatDate,
  institutionLabel,
} from '../data/mockData.js'
import StatCard from '../components/StatCard.jsx'
import ComplaintTable from '../components/ComplaintTable.jsx'
import { Donut, HorizontalBars, TrendLine } from '../components/charts.jsx'
import Icon from '../components/Icon.jsx'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

export default function Overview({ complaints, onSelect, goComplaints }) {
  const stats = useMemo(() => {
    const active = complaints.filter(isOpen)
    const breached = active.filter(isOverdue)
    const resolved = complaints.filter((c) => !isOpen(c))
    const monthAgo = toISO(new Date(TODAY.getTime() - 30 * 86400000))
    const twoMonthsAgo = toISO(new Date(TODAY.getTime() - 60 * 86400000))
    const last30 = complaints.filter((c) => c.filedOn >= monthAgo).length
    const prev30 = complaints.filter((c) => c.filedOn >= twoMonthsAgo && c.filedOn < monthAgo).length
    const resolvedInSla = resolved.filter(
      (c) => c.resolvedOn && (parseDate(c.resolvedOn) - parseDate(c.filedOn)) / 86400000 <= { Critical: 3, High: 7, Medium: 15, Low: 30 }[c.priority],
    ).length
    return {
      total: complaints.length,
      open: active.length,
      escalated: complaints.filter((c) => c.status === 'Escalated').length,
      resolved: resolved.length,
      last30,
      delta: last30 - prev30,
      slaPct: resolved.length ? Math.round((resolvedInSla / resolved.length) * 100) : 100,
      breached: breached.length,
    }
  }, [complaints])

  const statusSegments = STATUSES.map((s, i) => ({
    label: s,
    color: CHART_COLORS[i],
    value: complaints.filter((c) => c.status === s).length,
  })).filter((x) => x.value > 0)

  const bureauBars = useMemo(() => {
    return BUREAUS.map((b, i) => ({
      label: b.name,
      value: complaints.filter((c) => c.bureauId === b.id && isOpen(c)).length,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 7)
  }, [complaints])

  const trend = useMemo(() => {
    const counts = MONTH_LABELS.map((label, i) => ({
      label,
      value: complaints.filter((c) => parseDate(c.filedOn).getMonth() === i).length,
    }))
    return counts
  }, [complaints])

  const riskList = useMemo(
    () =>
      complaints
        .filter(isOverdue)
        .sort((a, b) => daysOverdue(b) - daysOverdue(a))
        .slice(0, 6),
    [complaints],
  )

  const recent = useMemo(
    () => [...complaints].sort((a, b) => (a.filedOn > b.filedOn ? -1 : 1)).slice(0, 6),
    [complaints],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Complaint Monitoring Overview</h1>
          <p className="text-sm text-slate-500">
            Institution-wise and bureau-wise tracking across AICTE · data as of {formatDate(toISO(TODAY))}
          </p>
        </div>
        <button
          onClick={goComplaints}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Icon name="complaints" className="h-4 w-4 text-slate-400" />
          View all complaints
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total complaints" value={stats.total} icon="complaints" tone="blue" />
        <StatCard
          label="Open cases"
          value={stats.open}
          icon="clock"
          tone="amber"
          sub={`${stats.breached} past SLA`}
        />
        <StatCard label="Escalated" value={stats.escalated} icon="alert" tone="red" sub="Awaiting senior review" />
        <StatCard
          label="Resolved (all time)"
          value={stats.resolved}
          icon="check"
          tone="green"
          sub={`${stats.last30} filed in last 30 days`}
        />
        <StatCard label="SLA compliance" value={`${stats.slaPct}%`} icon="scale" tone="violet" sub="Resolved within norm" />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Complaints filed — monthly trend</h2>
            <span className="text-[11px] text-slate-400">Jan – Oct 2026</span>
          </div>
          <TrendLine data={trend} />
        </section>

        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-5">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Status distribution</h2>
          <Donut segments={statusSegments} centerValue={stats.total} centerLabel="Total complaints" />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Open complaints by bureau / cell</h2>
          <HorizontalBars data={bureauBars} />
        </section>

        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Icon name="alert" className="h-4 w-4 text-red-500" />
              SLA risk — action required
            </h2>
            <span className="text-[11px] text-slate-400">{stats.breached} past due</span>
          </div>
          {riskList.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No complaints are past SLA. 🎉</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {riskList.map((c) => (
                <li
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="flex cursor-pointer items-center gap-3 py-2.5 transition hover:bg-red-50/30"
                >
                  <span className="h-8 w-1 shrink-0 rounded-full bg-red-400" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-800">{c.title}</div>
                    <div className="truncate text-xs text-slate-500">
                      {c.id} · {institutionLabel(c.institutionId)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-red-600">{daysOverdue(c)} days overdue</div>
                    <div className="text-[11px] text-slate-400">Due {formatDate(c.filedOn)}</div>
                  </div>
                  <Icon name="chevron" className="h-4 w-4 text-slate-300" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Recently filed complaints</h2>
        <ComplaintTable complaints={recent} onSelect={onSelect} compact />
      </section>
    </div>
  )
}
