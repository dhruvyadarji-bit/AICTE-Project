import { useMemo, useState } from 'react'
import { INSTITUTIONS, isOpen, isOverdue } from '../data/mockData.js'
import Icon from '../components/Icon.jsx'

const APPROVAL_STYLE = {
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Provisional: 'bg-amber-50 text-amber-700 ring-amber-200',
  Restricted: 'bg-red-50 text-red-700 ring-red-200',
}

export default function Institutions({ complaints, onSelect, filterByInstitution }) {
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return INSTITUTIONS.map((i) => {
      const own = complaints.filter((c) => c.institutionId === i.id)
      const open = own.filter(isOpen)
      return {
        ...i,
        total: own.length,
        open: open.length,
        escalated: open.filter((c) => c.status === 'Escalated').length,
        overdue: own.filter(isOverdue).length,
        risk: own.filter((c) => c.priority === 'Critical').length,
      }
    })
      .filter(
        (i) =>
          !term ||
          `${i.name} ${i.city} ${i.state} ${i.code} ${i.type}`.toLowerCase().includes(term),
      )
      .sort((a, b) => b.open - a.open || b.total - a.total)
  }, [complaints, q])

  const flagged = rows.filter((i) => i.risk > 0 || i.approval === 'Restricted').length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Institutions under monitoring</h1>
          <p className="text-sm text-slate-500">
            {INSTITUTIONS.length} AICTE-approved institutions · {flagged} flagged for review
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search institution, city or state…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/60">
              <tr>
                {['Institution', 'Type', 'Approval', 'Total', 'Open', 'Escalated', 'Past SLA', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((i) => (
                <tr key={i.id} className="transition hover:bg-blue-50/40">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{i.name}</div>
                    <div className="text-xs text-slate-500">
                      {i.code} · {i.city}, {i.state} · valid till {i.validTill}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{i.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${APPROVAL_STYLE[i.approval]}`}
                    >
                      {i.approval}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{i.total}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{i.open}</td>
                  <td className={`px-4 py-3 ${i.escalated ? 'font-semibold text-red-600' : 'text-slate-400'}`}>
                    {i.escalated}
                  </td>
                  <td className={`px-4 py-3 ${i.overdue ? 'font-semibold text-red-600' : 'text-slate-400'}`}>
                    {i.overdue}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => filterByInstitution(i.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      View complaints
                      <Icon name="chevron" className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">
                    No institutions match “{q}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
