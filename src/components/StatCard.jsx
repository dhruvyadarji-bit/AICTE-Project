import Icon from './Icon.jsx'

const TONES = {
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  green: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
  slate: 'bg-slate-100 text-slate-600',
}

export default function StatCard({ label, value, sub, icon = 'complaints', tone = 'blue', badge }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONES[tone]}`}>
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </div>
        {badge && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
      {sub && <div className="mt-1 text-[11px] text-slate-400">{sub}</div>}
    </div>
  )
}
