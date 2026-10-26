import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, TriangleAlert, Film } from 'lucide-react'
import { FEEDS, fetchFeed } from '../lib/tmdb'
import Chips from '../components/Chips'
import FeaturedCard from '../components/FeaturedCard'
import PosterCard from '../components/PosterCard'
import Skeleton, { PosterGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'

function ListSkeleton() {
  return (
    <>
      <Skeleton className="aspect-[16/10]" />
      <div className="mt-6">
        <PosterGridSkeleton />
      </div>
    </>
  )
}

export default function Home() {
  const [params, setParams] = useSearchParams()
  const feed = FEEDS.find((f) => f.key === params.get('f')) ?? FEEDS[0]

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['feed', feed.key],
    queryFn: () => fetchFeed(feed),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Beranda</h1>
        <Link
          to="/cari"
          aria-label="Cari film atau serial"
          className="glass flex h-11 w-11 items-center justify-center rounded-full"
        >
          <Search size={20} aria-hidden="true" />
        </Link>
      </header>

      <div className="mt-5 mb-5">
        <Chips
          items={FEEDS}
          value={feed.key}
          onChange={(key) => setParams(key === FEEDS[0].key ? {} : { f: key }, { replace: true })}
        />
      </div>

      {isPending && <ListSkeleton />}

      {isError && (
        <EmptyState
          icon={TriangleAlert}
          title="Gagal memuat daftar"
          message="Periksa koneksi internet Anda lalu coba lagi."
          actionLabel="Coba lagi"
          onAction={refetch}
        />
      )}

      {data?.length === 0 && (
        <EmptyState icon={Film} title="Belum ada tontonan" message="Tidak ada hasil untuk kategori ini." />
      )}

      {data?.length > 0 && (
        <>
          <FeaturedCard item={data[0]} />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data.slice(1).map((item) => (
              <PosterCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}
