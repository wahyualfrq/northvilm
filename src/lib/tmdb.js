import { normalize } from './format'

const IMG_BASE = 'https://image.tmdb.org/t/p'

export async function tmdb(path, params = {}) {
  const query = new URLSearchParams({ language: 'id-ID', ...params })
  const res = await fetch(`/api/tmdb/${path}?${query}`)
  if (!res.ok) throw new Error(`TMDB ${res.status}`)
  return res.json()
}

// size: w342 | w500 | w780 | original
export function img(path, size = 'w342') {
  return path ? `${IMG_BASE}/${size}${path}` : null
}

const JP = { with_original_language: 'ja', sort_by: 'popularity.desc' }

export const FEEDS = [
  { key: 'trending', label: 'Trending', path: 'trending/all/week' },
  { key: 'drama', label: 'Drama Jepang', path: 'discover/tv', params: { ...JP, with_genres: '18' }, type: 'tv' },
  { key: 'film', label: 'Film Jepang', path: 'discover/movie', params: JP, type: 'movie' },
  { key: 'anime', label: 'Anime', path: 'discover/tv', params: { ...JP, with_genres: '16' }, type: 'tv' },
]

export async function fetchFeed({ path, params, type }) {
  const data = await tmdb(path, params)
  return data.results
    .map((r) => normalize(r, type))
    .filter((r) => r.type === 'movie' || r.type === 'tv')
}

export async function searchTitles(query) {
  const data = await tmdb('search/multi', { query, include_adult: 'false' })
  return data.results
    .map((r) => normalize(r))
    .filter((r) => r.type === 'movie' || r.type === 'tv')
}
