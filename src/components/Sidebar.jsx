import Icon from './Icon.jsx'

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'complaints', label: 'Complaints', icon: 'complaints' },
  { id: 'bureaus', label: 'Bureaus & Cells', icon: 'bureaus' },
  { id: 'institutions', label: 'Institutions', icon: 'institutions' },
]

export default function Sidebar({ page, setPage, openCount, onClose, onReset }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#0B2545] text-slate-200">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0A93B] text-lg font-bold text-[#0B2545]">
          A
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide text-white">AICTE</div>
          <div className="text-[11px] text-slate-400">Grievance Monitoring</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Monitoring
        </div>
        {NAV.map((item) => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id)
                onClose?.()
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? 'bg-white/10 font-medium text-white shadow-inner'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon name={item.icon} className={`h-[18px] w-[18px] ${active ? 'text-[#F0A93B]' : ''}`} />
              <span>{item.label}</span>
              {item.id === 'complaints' && openCount > 0 && (
                <span className="ml-auto rounded-full bg-[#F0A93B] px-2 py-0.5 text-[11px] font-semibold text-[#0B2545]">
                  {openCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-[11px] leading-relaxed text-slate-400">
        <div className="font-medium text-slate-300">Demo workspace</div>
        Changes are saved in this browser. Session: Secretariat Cell.
        <button
          onClick={onReset}
          className="mt-2 rounded-md px-2 py-1 text-[11px] font-medium text-[#F0A93B] hover:bg-white/10"
        >
          Reset demo data
        </button>
      </div>
    </aside>
  )
}
