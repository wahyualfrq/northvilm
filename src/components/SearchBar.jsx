import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        document.activeElement?.blur()
      }}
      className="glass flex h-12 items-center gap-2 rounded-full pr-1 pl-4 transition-colors focus-within:border-[var(--accent)]"
    >
      <Search size={20} aria-hidden="true" style={{ color: 'var(--text-dim)' }} />
      <input
        type="search"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari film atau serial"
        aria-label="Cari film atau serial"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--text-dim)] [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Hapus pencarian"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ color: 'var(--text-dim)' }}
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </form>
  )
}
