import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { img } from '../lib/tmdb'
import { metaLine } from '../lib/format'

export default function FeaturedCard({ item }) {
  const src = item.backdrop ? img(item.backdrop, 'w780') : img(item.poster, 'w780')

  return (
    <Link
      to={`/detail/${item.type}/${item.id}`}
      className="relative block aspect-[16/10] overflow-hidden rounded-3xl bg-white/[.07]"
    >
      {src && (
        <img src={src} alt={`Backdrop ${item.title}`} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a18] via-[#060a18]/40 to-transparent" />
      {item.rating && (
        <span className="glass absolute top-3 left-3 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold">
          <Star size={13} fill="currentColor" aria-hidden="true" />
          {item.rating}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h2 className="line-clamp-2 text-xl leading-tight font-extrabold">{item.title}</h2>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-dim)' }}>
          {metaLine(item)}
        </p>
      </div>
    </Link>
  )
}
