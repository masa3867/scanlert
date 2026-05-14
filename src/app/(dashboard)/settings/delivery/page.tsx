'use client'

import { useState } from 'react'

export default function DeliverySettingsPage() {
  const [slackUrl, setSlackUrl] = useState('')
  const [threshold, setThreshold] = useState(70)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">配信設定</h1>
        <p className="text-sm text-slate-500 mt-1">Slack通知とn8n連携の設定を管理します。</p>
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
            </div>
          </div>
        </div>

        {/* n8n Webhook */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span>⚙️</span> n8n 取り込み設定
          </h2>
          <div className="space-y-3 text-sm text-slate-600">
            <div>
              <p className="font-medium text-slate-700 mb-1">Webhook エンドポイント</p>
              <code className="block bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs break-all">
                POST {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/webhooks/n8n/ingest
              </code>
            </div>
            <div>
              <p className="font-medium text-slate-700 mb-1">必要なリクエスト形式</p>
              <pre className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs overflow-auto">{`{
  "title": "記事タイトル",
  "sourceUrl": "https://...",
  "contentSnippet": "本文の抜粋",
  "relevanceScore": 85,
  "summary": "AI要約テキスト",
  "watchLabel": "監視設定名"
}`}</pre>
            </div>
            <div>
              <p className="font-medium text-slate-700 mb-1">HMAC署名（推奨）</p>
              <p className="text-xs text-slate-500">
                環境変数 <code className="bg-slate-100 px-1 rounded">N8N_WEBHOOK_SECRET</code> を設定すると、
                リクエストヘッダー <code className="bg-slate-100 px-1 rounded">x-n8n-signature</code> で署名検証が有効になります。
              </p>
            </div>
          </div>
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
