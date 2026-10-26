export default function Chips({ items, value, onChange }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map(({ key, label }) => {
        const active = key === value
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 ${
              active
                ? 'border border-transparent bg-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)]'
                : 'glass text-[var(--text-dim)]'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
