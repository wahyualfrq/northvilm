const TMDB_BASE = 'https://api.themoviedb.org/3'

// search/*, trending/*, discover/*, movie/{id}*, tv/{id}*
const ALLOWED = /^(?:(?:search|trending|discover)(?:\/[\w-]+)+|(?:movie|tv)\/\d+(?:\/[\w-]+)*)$/

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const key = process.env.TMDB_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'TMDB_API_KEY belum diatur di server' })
  }

  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname.replace(/^\/api\/tmdb\//, '').replace(/\/+$/, '')

  if (!ALLOWED.test(path)) {
    return res.status(403).json({ error: 'Path tidak diizinkan' })
  }

  url.searchParams.delete('api_key')
  url.searchParams.set('api_key', key)

  try {
    const upstream = await fetch(`${TMDB_BASE}/${path}?${url.searchParams}`)
    const body = await upstream.text()

    if (upstream.ok) {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    }
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
    return res.status(upstream.status).send(body)
  } catch {
    return res.status(502).json({ error: 'Gagal menghubungi TMDB' })
  }
}
