import { Link } from 'react-router-dom'
import { Film, Star } from 'lucide-react'
import { img } from '../lib/tmdb'
import { metaLine } from '../lib/format'

export default function PosterCard({ item }) {
  return (
    <Link to={`/detail/${item.type}/${item.id}`} className="block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-3xl bg-white/[.07]">
        {item.poster ? (
          <img
            src={img(item.poster, 'w342')}
            alt={`Poster ${item.title}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <Film
            size={32}
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-dim)' }}
          />
        )}
        {item.rating && (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-[#060a18]/80 px-2 py-1 text-[11px] font-bold">
            <Star size={11} fill="currentColor" aria-hidden="true" />
            {item.rating}
          </span>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm leading-snug font-bold">{item.title}</h3>
      <p className="mt-0.5 text-xs" style={{ color: 'var(--text-dim)' }}>
        {metaLine(item)}
      </p>
    </Link>
  )
}
