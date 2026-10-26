import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search as SearchIcon, SearchX, TriangleAlert } from 'lucide-react'
import { searchTitles } from '../lib/tmdb'
import SearchBar from '../components/SearchBar'
import PosterCard from '../components/PosterCard'
import { PosterGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)

  // Debounce 400ms: simpan query di URL agar tombol back mempertahankan pencarian.
  useEffect(() => {
    const t = setTimeout(() => {
      const next = input.trim()
      if (next !== q) setParams(next ? { q: next } : {}, { replace: true })
    }, 400)
    return () => clearTimeout(t)
  }, [input, q, setParams])

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['search', q],
    queryFn: () => searchTitles(q),
    enabled: q !== '',
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">Cari</h1>
      <SearchBar
        value={input}
        onChange={setInput}
        onClear={() => {
          setInput('')
          setParams({}, { replace: true })
        }}
      />

      <div className="mt-6">
        {q === '' && (
          <EmptyState icon={SearchIcon} title="Cari film atau serial" message="Coba cari Doctor-X" />
        )}

        {q !== '' && isPending && <PosterGridSkeleton />}

        {isError && (
          <EmptyState
            icon={TriangleAlert}
            title="Pencarian gagal"
            message="Periksa koneksi internet Anda lalu coba lagi."
            actionLabel="Coba lagi"
            onAction={refetch}
          />
        )}

        {data?.length === 0 && (
          <EmptyState icon={SearchX} title="Tidak ada hasil" message={`Tidak ditemukan hasil untuk "${q}".`} />
        )}

        {data?.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {data.map((item) => (
              <PosterCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
