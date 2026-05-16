'use client'

import { useState, useEffect } from 'react'

export default function DeliverySettingsPage() {
  const [slackUrl, setSlackUrl] = useState('')
  const [threshold, setThreshold] = useState(70)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings/delivery')
      .then(r => r.json())
      .then(data => {
        setSlackUrl(data.slackWebhookUrl ?? '')
        setThreshold(data.notifyAbove ?? 70)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/settings/delivery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slackWebhookUrl: slackUrl, notifyAbove: threshold }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">配信設定</h1>
        </div>
        <p className="text-sm text-slate-500">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">配信設定</h1>
        <p className="text-sm text-slate-500 mt-1">Slack通知の設定を管理します。</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Slack */}
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
                type="range" min={0} max={100} value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <p className="text-xs text-slate-400 mt-1">このスコア以上のトピックが収集されたとき Slack に通知します</p>
            </div>
          </div>
        </div>

        {/* Cron info */}
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          {saved ? '✓ 保存しました' : '設定を保存'}
        </button>
      </form>
    </div>
  )
}
