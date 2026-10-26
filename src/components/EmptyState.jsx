export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div role="status" className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && <Icon size={40} strokeWidth={1.5} aria-hidden="true" style={{ color: 'var(--text-dim)' }} />}
      <p className="mt-4 text-base font-bold">{title}</p>
      {message && (
        <p className="mt-1 text-sm" style={{ color: 'var(--text-dim)' }}>
          {message}
        </p>
      )}
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 min-h-11 rounded-full px-6 text-sm font-bold text-white"
          style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
