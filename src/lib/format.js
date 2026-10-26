export const TYPE_LABEL = { movie: 'Film', tv: 'Serial' }

// Ubah item TMDB (movie/tv/trending) ke bentuk seragam untuk kartu.
export function normalize(item, fallbackType) {
  return {
    id: item.id,
    type: item.media_type ?? fallbackType,
    title: item.title ?? item.name,
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
    rating: item.vote_average > 0 ? item.vote_average.toFixed(1) : null,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
  }
}

export function metaLine(item) {
  return [TYPE_LABEL[item.type], item.year].filter(Boolean).join(' · ')
}
