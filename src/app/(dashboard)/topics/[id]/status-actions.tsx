'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TopicStatus } from '@/types'

export default function StatusActions({ topicId, currentStatus }: { topicId: string; currentStatus: TopicStatus }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function changeStatus(next: TopicStatus) {
    setLoading(true)
    await fetch(`/api/topics/${topicId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setStatus(next)
    setLoading(false)
    router.refresh()
  }

  const actions: { status: TopicStatus; label: string; style: string }[] = [
    { status: 'read', label: '✓ 既読にする', style: 'border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-700' },
    { status: 'dismissed', label: '✕ 非表示にする', style: 'border-slate-300 text-slate-600 hover:border-red-300 hover:text-red-600' },
    { status: 'new', label: '↩ 未読に戻す', style: 'border-slate-300 text-slate-600 hover:border-indigo-300' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-slate-500">ステータス:</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        status === 'new' ? 'bg-indigo-100 text-indigo-700' :
        status === 'read' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
      }`}>
        {status === 'new' ? '新着' : status === 'read' ? '既読' : '非表示'}
      </span>
      {actions.filter(a => a.status !== status).map(a => (
        <button
          key={a.status}
          onClick={() => changeStatus(a.status)}
          disabled={loading}
          className={`text-xs border px-3 py-1 rounded-lg transition-colors disabled:opacity-50 ${a.style}`}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
