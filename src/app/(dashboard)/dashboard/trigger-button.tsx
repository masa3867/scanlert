'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Result = { processed: number; ingested: number; errors: number }

export default function TriggerButton({ isMock }: { isMock: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function handleTrigger() {
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/pipeline/trigger', { method: 'POST' })
    const data: Result = await res.json()
    setResult(data)
    setLoading(false)
    router.refresh()
    setTimeout(() => setResult(null), 5000)
  }

  if (result) {
    return (
      <span className="text-xs text-slate-500 px-3 py-2">
        ✓ {result.ingested}件追加 / {result.processed}件処理
        {result.errors > 0 && ` / ${result.errors}件エラー`}
      </span>
    )
  }

  return (
    <button
      onClick={handleTrigger}
      disabled={loading}
      className="flex items-center gap-2 border border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-700 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
    >
      <span className={loading ? 'animate-spin inline-block' : ''}>
        {loading ? '⟳' : '▶'}
      </span>
      <span>
        {loading ? '収集中...' : isMock ? 'デモ取得' : '今すぐ収集'}
      </span>
    </button>
  )
}
