'use client'
type Props = { order: number; total?: number | null }
export default function CaseProgress({ order, total }: Props) {
  const pct = total ? Math.min(100, Math.max(0, (order / total) * 100)) : 0
  return (
    <div className="mt-2">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
        Case Progress — File {order}
        {total ? ` of ${total}` : ''}
      </div>
      <div className="h-3 w-full overflow-hidden rounded bg-zinc-200">
        <div
          className="h-full rounded bg-emerald-500 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
