export default function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-3xl bg-white/[.07] ${className}`} />
}

export function PosterGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3]" />
          <Skeleton className="mt-2 h-4 w-3/4 !rounded-full" />
          <Skeleton className="mt-1.5 h-3 w-1/2 !rounded-full" />
        </div>
      ))}
    </div>
  )
}
