import { useEffect, useState } from 'react'
import {
  BUREAUS,
  INSTITUTIONS,
  CATEGORIES,
  PRIORITIES,
} from '../data/mockData.js'
import Icon from './Icon.jsx'

const EMPTY = {
  title: '',
  institutionId: '',
  bureauId: '',
  category: CATEGORIES[0],
  priority: 'Medium',
  filedBy: '',
  description: '',
}

export default function NewComplaintModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return setError('Complaint title is required.')
    if (!form.institutionId) return setError('Select the institution the complaint pertains to.')
    if (!form.bureauId) return setError('Select the bureau / cell for routing.')
    onCreate({ ...form, title: form.title.trim(), filedBy: form.filedBy.trim() || 'Anonymous' })
    setForm(EMPTY)
    setError('')
  }

  const fieldClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <form
        onSubmit={submit}
        className="thin-scroll relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Register new complaint</h2>
            <p className="text-xs text-slate-500">Routed to the selected bureau / cell with SLA tracking.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close form"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className={labelClass}>Complaint title *</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Fee refund not processed after seat cancellation"
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Institution *</label>
              <select
                value={form.institutionId}
                onChange={(e) => set('institutionId', e.target.value)}
                className={fieldClass}
              >
                <option value="">Select institution…</option>
                {INSTITUTIONS.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Bureau / Cell *</label>
              <select
                value={form.bureauId}
                onChange={(e) => set('bureauId', e.target.value)}
                className={fieldClass}
              >
                <option value="">Select bureau…</option>
                {BUREAUS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={fieldClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <div className="flex gap-1.5 pt-1">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => set('priority', p)}
                    className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium ring-1 transition ${
                      form.priority === p
                        ? 'bg-blue-600 text-white ring-blue-600'
                        : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Complainant</label>
            <input
              value={form.filedBy}
              onChange={(e) => set('filedBy', e.target.value)}
              placeholder="Name / designation (leave blank for anonymous)"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the issue, supporting facts and relief sought…"
              className={`${fieldClass} resize-none`}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Register complaint
          </button>
        </div>
      </form>
    </div>
  )
}
