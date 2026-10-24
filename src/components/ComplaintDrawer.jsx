import { useEffect, useState } from 'react'
import {
  STATUSES,
  formatDate,
  dueOnFor,
  isOverdue,
  daysOpen,
  daysOverdue,
  institutionById,
  bureauName,
} from '../data/mockData.js'
import { StatusPill, PriorityPill } from './ComplaintTable.jsx'
import Icon from './Icon.jsx'

export default function ComplaintDrawer({ complaint, onClose, onUpdate }) {
  const [status, setStatus] = useState(complaint?.status || 'New')
  const [note, setNote] = useState('')

  useEffect(() => {
    setStatus(complaint?.status || 'New')
    setNote('')
  }, [complaint?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!complaint) return null

  const inst = institutionById(complaint.institutionId)
  const due = dueOnFor(complaint)
  const overdue = isOverdue(complaint)

  function apply() {
    onUpdate(complaint.id, status, note.trim())
    setNote('')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="thin-scroll relative h-full w-full max-w-[480px] overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-slate-400">{complaint.id}</div>
              <div className="mt-0.5 flex items-center gap-2">
                <StatusPill status={complaint.status} />
                <PriorityPill priority={complaint.priority} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close complaint"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900">{complaint.title}</h2>
        </div>

        <div className="space-y-6 px-6 py-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-slate-400">Institution</dt>
              <dd className="mt-0.5 font-medium text-slate-800">{inst?.name}</dd>
              <dd className="text-xs text-slate-500">
                {inst?.code} · {inst?.city}, {inst?.state}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-slate-400">Bureau / Cell</dt>
              <dd className="mt-0.5 font-medium text-slate-800">{bureauName(complaint.bureauId)}</dd>
              <dd className="text-xs text-slate-500">Nodal: {complaint.assignee}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-slate-400">Category</dt>
              <dd className="mt-0.5 text-slate-700">{complaint.category}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-slate-400">Filed by</dt>
              <dd className="mt-0.5 text-slate-700">{complaint.filedBy}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-slate-400">Filed on</dt>
              <dd className="mt-0.5 text-slate-700">{formatDate(complaint.filedOn)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-slate-400">SLA due</dt>
              <dd className={`mt-0.5 ${overdue ? 'font-semibold text-red-600' : 'text-slate-700'}`}>
                {formatDate(due)}
                {overdue && <span className="ml-1.5 text-xs">({daysOverdue(complaint)}d overdue)</span>}
              </dd>
            </div>
          </dl>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-1 text-[11px] uppercase tracking-wider text-slate-400">Description</div>
            <p className="text-sm leading-relaxed text-slate-700">{complaint.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 pt-2 text-xs text-slate-500">
              <span>
                Days {complaint.resolvedOn ? 'to resolve' : 'open'}:{' '}
                <b className="text-slate-700">{daysOpen(complaint)}</b>
              </span>
              <span>
                Assignee: <b className="text-slate-700">{complaint.assignee}</b>
              </span>
            </div>
          </div>

          <section>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Action timeline
            </h3>
            <ol className="relative ml-2 space-y-4 border-l border-slate-200 pl-5">
              {complaint.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                      i === complaint.timeline.length - 1 ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-sm font-medium text-slate-800">{t.action}</div>
                    <time className="whitespace-nowrap text-[11px] text-slate-400">{formatDate(t.date)}</time>
                  </div>
                  <div className="text-xs text-slate-500">{t.by}</div>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{t.note}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Update status
            </h3>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition ${
                    status === s
                      ? 'bg-blue-600 text-white ring-blue-600'
                      : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Remark / action taken (added to timeline)…"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">Timeline updates are local to this demo.</span>
              <button
                onClick={apply}
                disabled={status === complaint.status && !note.trim()}
                className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Apply update
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
