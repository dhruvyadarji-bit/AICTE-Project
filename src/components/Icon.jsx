const PATHS = {
  overview: 'M4 4h16v12H7l-3 3V4zm2 4h12v2H6V8zm0 4h8v2H6v-2z',
  complaints: 'M4 4h16v12H7l-3 3V4zm2 4h12v2H6V8zm0 4h8v2H6v-2z',
  bureaus: 'M4 21V7l8-4 8 4v14h-6v-6h-4v6H4zm4-11h2v2H8v-2zm6 0h2v2h-2v-2z',
  institutions: 'M3 21h18v-2H3v2zM5 17h4V5H5v12zm6 0h4V9h-4v8zm6 0h3V3h-3v14z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 5l7 7-7 7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-14v5l3 2',
  alert: 'M12 3 2 21h20L12 3zm0 6v6m0 3v.5',
  check: 'M4 12.5 9.5 18 20 6.5',
  bell: 'M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16l-2-3zm-6 3a2.5 2.5 0 0 0 4 0',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0',
  trend: 'M3 17l6-6 4 4 8-8m0 0v6m0-6h-6',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5z',
  scale: 'M12 3v18M6 7l-3 7h6L6 7zm12 0-3 7h6l-3-7zM6 7l6-2 6 2',
  menu: 'M4 6h16M4 12h16M4 18h16',
}

export default function Icon({ name, className = 'h-4 w-4', filled = false }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'search' || name === 'clock' || name === 'trend' ? (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </>
      ) : (
        <path d={d} />
      )}
    </svg>
  )
}
