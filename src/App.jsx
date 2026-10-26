import { useQuery } from '@tanstack/react-query'
import { tmdb, img } from './lib/tmdb'

// Halaman sementara untuk verifikasi proxy TMDB (langkah 1).
export default function App() {
  const { data, isPending, error } = useQuery({
    queryKey: ['verifikasi', 'Doctor-X'],
    queryFn: () => tmdb('search/multi', { query: 'Doctor-X' }),
  })

  if (isPending) return <p className="p-4">Memuat…</p>
  if (error) return <p className="p-4">Gagal: {error.message}</p>

  const first = data.results.find((r) => r.media_type === 'movie' || r.media_type === 'tv')
  if (!first) return <p className="p-4">Tidak ada hasil.</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{first.title ?? first.name}</h1>
      <img src={img(first.poster_path)} alt={`Poster ${first.title ?? first.name}`} className="mt-2 w-48" />
    </div>
  )
}
