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
