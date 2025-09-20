type Props = {
  order: number
  total: number | null
  title?: string // 👈 optional custom title
}

export default function CaseHeader({ order, total, title }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-yellow-300 bg-yellow-100 p-4">
      <h2 className="text-lg font-bold text-gray-900">
        📂 {title || `Case File #${order} / ${total ?? '?'}`}
      </h2>
    </header>
  )
}
