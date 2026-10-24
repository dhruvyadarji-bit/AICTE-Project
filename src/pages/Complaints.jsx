import { useMemo } from 'react'
import {
  BUREAUS,
  INSTITUTIONS,
  STATUSES,
  PRIORITIES,
  isOpen,
} from '../data/mockData.js'
import ComplaintTable from '../components/ComplaintTable.jsx'
import StatCard from '../components/StatCard.jsx'
import Icon from '../components/Icon.jsx'

const EMPTY_FILTERS = { q: '', bureau: 'All', status: 'All', priority: 'All', institution: 'All' }

export default function Complaints({
  complaints,
  filters,
  setFilters,
  onSelect,
  onNew,
}) {
  const merged = { ...EMPTY_FILTERS, ...filters }

  const filtered = useMemo(() => {
    const q = merged.q.trim().toLowerCase()
    return complaints.filter((c) => {
      if (q && !`${c.id} ${c.title} ${c.description} ${c.category} ${c.filedBy}`.toLowerCase().includes(q)) return false
      if (merged.bureau !== 'All' && c.bureauId !== merged.bureau) return false
      if (merged.status !== 'All' && c.status !== merged.status) return false
      if (merged.priority !== 'All' && c.priority !== merged.priority) return false
      if (merged.institution !== 'All' && c.institutionId !== merged.institution) return false
      return true
    })
  }, [complaints, merged.q, merged.bureau, merged.status, merged.priority, merged.institution])

  function set(key, value) {
    setFilters((f) => ({ ...EMPTY_FILTERS, ...f, [key]: value }))
  }

  const activeFilters =
    (merged.q ? 1 : 0) +
    ['bureau', 'status', 'priority', 'institution'].filter((k) => merged[k] !== 'All').length

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Complaints Register</h1>
          <p className="text-sm text-slate-500">
            {filtered.length} of {complaints.length} complaints shown
            {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
          </p>
        </div>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Icon name="plus" className="h-4 w-4" />
          New complaint
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Showing" value={filtered.length} icon="filter" tone="slate" />
        <StatCard label="Open in view" value={filtered.filter(isOpen).length} icon="clock" tone="amber" />
        <StatCard label="Critical / High" value={filtered.filter((c) => ['Critical', 'High'].includes(c.priority)).length} icon="alert" tone="red" />
        <StatCard label="Resolved / Closed" value={filtered.filter((c) => !isOpen(c)).length} icon="check" tone="green" />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="relative min-w-[220px] flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={merged.q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Search by ID, title, category or complainant…"
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select value={merged.bureau} onChange={(e) => set('bureau', e.target.value)} className={selectClass}>
          <option value="All">All bureaus</option>
          {BUREAUS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select value={merged.status} onChange={(e) => set('status', e.target.value)} className={selectClass}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select value={merged.priority} onChange={(e) => set('priority', e.target.value)} className={selectClass}>
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select value={merged.institution} onChange={(e) => set('institution', e.target.value)} className={selectClass}>
          <option value="All">All institutions</option>
          {INSTITUTIONS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>

        {activeFilters > 0 && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            Clear
          </button>
        )}
      </div>

      <ComplaintTable complaints={filtered} onSelect={onSelect} />
    </div>
  )
}
