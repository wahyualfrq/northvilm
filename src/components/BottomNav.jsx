import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, Bookmark, History, User } from 'lucide-react'

const TABS = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/cari', label: 'Cari', Icon: Search },
  { to: '/simpan', label: 'Simpan', Icon: Bookmark },
  { to: '/riwayat', label: 'Riwayat', Icon: History },
  { to: '/profil', label: 'Profil', Icon: User },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const active = TABS.findIndex(({ to }) => (to === '/' ? pathname === '/' : pathname.startsWith(to)))

  return (
    <nav
      aria-label="Navigasi utama"
      className="glass fixed left-1/2 z-50 h-16 -translate-x-1/2 rounded-full p-1.5"
      style={{
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        width: 'min(100% - 32px, 440px)',
      }}
    >
      <div className="relative grid h-full grid-cols-5">
        {/* Gelembung kaca tab aktif */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/5 rounded-full transition-[transform,opacity] duration-300 ease-out"
          style={{
            transform: `translateX(${Math.max(active, 0) * 100}%)`,
            opacity: active < 0 ? 0 : 1,
            background: 'linear-gradient(180deg, rgba(96,165,250,.55), rgba(59,130,246,.3))',
            border: '1px solid rgba(255,255,255,.28)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), 0 0 18px var(--accent-glow)',
          }}
        />
        {TABS.map(({ to, label, Icon }, i) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="relative z-10 flex flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-semibold transition-colors duration-300"
            style={{ color: i === active ? '#fff' : 'var(--text-dim)' }}
          >
            <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
