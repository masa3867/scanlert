'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DeliverySettings } from '@/types'

export default function DeliveryForm({ initial }: { initial: DeliverySettings }) {
  const router = useRouter()
  const [slackUrl, setSlackUrl] = useState(initial.slackWebhookUrl)
  const [threshold, setThreshold] = useState(initial.notifyAbove)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/settings/delivery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slackWebhookUrl: slackUrl, notifyAbove: threshold }),
    })
    setSaving(false)
    if (!res.ok) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span>💬</span> Slack通知
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Webhook URL</label>
            <input
              type="url"
              value={slackUrl}
              onChange={e => setSlackUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-400 mt-1">Slack App の Incoming Webhook URL を入力してください</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              通知スコアしきい値: <span className="text-indigo-600 font-bold">{threshold}</span> 以上
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-xs text-slate-400 mt-1">このスコア以上のトピックが収集されたとき Slack に通知します</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <span>⏰</span> 自動収集スケジュール
        </h2>
        <p className="leading-relaxed">
          Vercel Cron Jobs が毎時 0 分に自動収集します。収集のキーワードと RSS ソースは{' '}
          <a href="/settings" className="text-indigo-600 hover:underline">監視設定</a> から管理できます。
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
      >
        {saved ? '✓ 保存しました' : saving ? '保存中...' : '設定を保存'}
      </button>
    </form>
  )
}
