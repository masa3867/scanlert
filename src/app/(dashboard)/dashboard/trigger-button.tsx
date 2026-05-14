'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TriggerButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleTrigger() {
    setLoading(true)
    await fetch('/api/pipeline/trigger', { method: 'POST' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleTrigger}
      disabled={loading}
      className="flex items-center gap-2 border border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-700 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
    >
      <span>{loading ? '⟳' : '▶'}</span>
      <span>{loading ? '取得中...' : 'デモ取得'}</span>
    </button>
  )
}
