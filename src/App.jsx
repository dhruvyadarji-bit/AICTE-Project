import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import Complaints from './pages/Complaints.jsx'
import Bureaus from './pages/Bureaus.jsx'
import Institutions from './pages/Institutions.jsx'
import ComplaintDrawer from './components/ComplaintDrawer.jsx'
import NewComplaintModal from './components/NewComplaintModal.jsx'
import Icon from './components/Icon.jsx'
import {
  INITIAL_COMPLAINTS,
  isOpen,
  toISO,
  TODAY,
  formatDate,
} from './data/mockData.js'
import { loadComplaints, saveComplaints, resetStoredComplaints } from './lib/store.js'

const PAGE_TITLES = {
  overview: 'Overview',
  complaints: 'Complaints',
  bureaus: 'Bureaus & Cells',
  institutions: 'Institutions',
}

const EMPTY_FILTERS = { q: '', bureau: 'All', status: 'All', priority: 'All', institution: 'All' }

export default function App() {
  const [complaints, setComplaints] = useState(loadComplaints)
  const [page, setPage] = useState('overview')
  const [selectedId, setSelectedId] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  const selected = complaints.find((c) => c.id === selectedId) || null
  const openCount = complaints.filter(isOpen).length

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    saveComplaints(complaints)
  }, [complaints])

  function resetDemo() {
    resetStoredComplaints()
    setComplaints(INITIAL_COMPLAINTS)
    setToast('Demo data reset to seed complaints')
  }

  function addComplaint(data) {
    const seq = Math.max(...complaints.map((c) => Number(c.id.split('/').pop()))) + 1
    const id = `AIT/2026/${String(seq).padStart(4, '0')}`
    const filedOn = toISO(TODAY)
    const created = {
      ...data,
      id,
      filedOn,
      assignee: 'Sh. A. Kulkarni (DS)',
      resolvedOn: null,
      timeline: [
        {
          date: filedOn,
          action: 'Complaint registered',
          by: 'Online Grievance Portal',
          note: `Received under category "${data.category}".`,
        },
        {
          date: filedOn,
          action: 'Assigned to Sh. A. Kulkarni (DS)',
          by: 'Secretariat Cell',
          note: 'Routed to the concerned bureau/cell for action.',
        },
      ],
    }
    setComplaints((prev) => [created, ...prev])
    setShowNew(false)
    setSelectedId(id)
    setToast(`Complaint ${id} registered and routed`)
  }

  function updateStatus(id, status, note) {
    const today = toISO(TODAY)
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const resolvedOn = ['Resolved', 'Closed'].includes(status) ? c.resolvedOn || today : null
        return {
          ...c,
          status,
          resolvedOn,
          timeline: [
            ...c.timeline,
            {
              date: today,
              action: `Status updated to ${status}`,
              by: 'Secretariat Cell (you)',
              note: note || 'No additional remark recorded.',
            },
          ],
        }
      }),
    )
    setToast(`${id} moved to ${status}`)
  }

  function filterByInstitution(id) {
    setFilters({ ...EMPTY_FILTERS, institution: id })
    setPage('complaints')
  }

  function filterByBureau(id) {
    setFilters({ ...EMPTY_FILTERS, bureau: id })
    setPage('complaints')
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <div className="hidden lg:block">
        <Sidebar page={page} setPage={setPage} openCount={openCount} onReset={resetDemo} />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <div className="relative">
            <Sidebar
              page={page}
              setPage={setPage}
              openCount={openCount}
              onClose={() => setMenuOpen(false)}
              onReset={resetDemo}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-800">{PAGE_TITLES[page]}</div>
            <div className="hidden text-[11px] text-slate-400 sm:block">
              AICTE · Institution-centric grievance monitoring
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600 md:inline-flex">
              <Icon name="clock" className="h-3.5 w-3.5 text-slate-400" />
              {formatDate(toISO(TODAY))}
            </span>
            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
              <Icon name="bell" className="h-5 w-5" />
              {openCount > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B2545] text-[11px] font-semibold text-white">
                SC
              </span>
              <span className="hidden text-xs font-medium text-slate-700 sm:block">Secretariat Cell</span>
            </div>
          </div>
        </header>

        <main className="thin-scroll flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            {page === 'overview' && (
              <Overview
                complaints={complaints}
                onSelect={setSelectedId}
                goComplaints={() => setPage('complaints')}
              />
            )}
            {page === 'complaints' && (
              <Complaints
                complaints={complaints}
                filters={filters}
                setFilters={setFilters}
                onSelect={setSelectedId}
                onNew={() => setShowNew(true)}
              />
            )}
            {page === 'bureaus' && (
              <Bureaus
                complaints={complaints}
                onSelect={setSelectedId}
                filterByBureau={filterByBureau}
              />
            )}
            {page === 'institutions' && (
              <Institutions
                complaints={complaints}
                onSelect={setSelectedId}
                filterByInstitution={filterByInstitution}
              />
            )}
          </div>
        </main>
      </div>

      {selected && (
        <ComplaintDrawer
          complaint={selected}
          onClose={() => setSelectedId(null)}
          onUpdate={updateStatus}
        />
      )}

      {showNew && <NewComplaintModal onClose={() => setShowNew(false)} onCreate={addComplaint} />}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  )
}
