import { useState } from 'react'
import {
  STATUS_STYLE,
  PRIORITY_STYLE,
  formatDate,
  dueOnFor,
  isOverdue,
  daysOverdue,
  institutionLabel,
  bureauName,
} from '../data/mockData.js'
import Icon from './Icon.jsx'

const PRIORITY_RANK = { Critical: 4, High: 3, Medium: 2, Low: 1 }

export function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  )
}

export function PriorityPill({ priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${PRIORITY_STYLE[priority]}`}
    >
      {priority}
    </span>
  )
}

export default function ComplaintTable({ complaints, onSelect, compact = false }) {
  const [sort, setSort] = useState({ key: 'filedOn', dir: 'desc' })

  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center">
        <Icon name="search" className="h-6 w-6 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">No complaints match the current filters</p>
        <p className="text-xs text-slate-400">Try clearing filters or widening the search.</p>
      </div>
    )
  }

  const sorted = [...complaints].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    if (sort.key === 'priority') return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * dir
    if (sort.key === 'due') return (dueOnFor(a) > dueOnFor(b) ? 1 : -1) * dir
    return (a.filedOn > b.filedOn ? 1 : -1) * dir
  })

  function toggleSort(key) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }))
  }

  function SortHead({ label, k, className = '' }) {
    return (
      <th className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${className}`}>
        <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-slate-600">
          {label}
          <span className={`text-[9px] ${sort.key === k ? 'text-blue-600' : 'text-slate-300'}`}>
            {sort.key === k && sort.dir === 'asc' ? '▲' : '▼'}
          </span>
        </button>
      </th>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/60">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Complaint
              </th>
              <SortHead label="Priority" k="priority" className="hidden md:table-cell" />
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:table-cell">
                Bureau / Cell
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              {!compact && (
                <>
                  <SortHead label="Filed" k="filedOn" className="hidden sm:table-cell" />
                  <SortHead label="SLA due" k="due" className="hidden lg:table-cell" />
                </>
              )}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((c) => {
              const due = dueOnFor(c)
              const overdue = isOverdue(c)
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="cursor-pointer transition hover:bg-blue-50/40"
                >
                  <td className="max-w-[380px] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400">{c.id}</span>
                      {overdue && (
                        <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                          {daysOverdue(c)}d overdue
                        </span>
                      )}
                    </div>
                    <div className="truncate font-medium text-slate-800">{c.title}</div>
                    <div className="truncate text-xs text-slate-500">{institutionLabel(c.institutionId)}</div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <PriorityPill priority={c.priority} />
                  </td>
                  <td className="hidden max-w-[200px] truncate px-4 py-3 text-xs text-slate-600 lg:table-cell">
                    {bureauName(c.bureauId)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={c.status} />
                  </td>
                  {!compact && (
                    <>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-slate-500 sm:table-cell">
                        {formatDate(c.filedOn)}
                      </td>
                      <td
                        className={`hidden whitespace-nowrap px-4 py-3 text-xs lg:table-cell ${
                          overdue ? 'font-semibold text-red-600' : 'text-slate-500'
                        }`}
                      >
                        {formatDate(due)}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3 text-right text-slate-300">
                    <Icon name="chevron" className="h-4 w-4" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
