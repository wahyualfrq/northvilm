import { useParams } from 'react-router-dom'

export default function Detail() {
  const { type, id } = useParams()
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Detail</h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-dim)' }}>
        {type} · {id}
      </p>
    </div>
  )
}
