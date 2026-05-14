'use client'

import { useState } from 'react'
import type { TopicWatch } from '@/types'

export default function WatchCard({ watch }: { watch: TopicWatch }) {
  const [enabled, setEnabled] = useState(watch.enabled)
  const [threshold, setThreshold] = useState(watch.scoreThreshold)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/settings/watches/${watch.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, scoreThreshold: threshold }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{watch.label}</h3>
          <p className="text-xs text-slate-500 mt-0.5">ID: {watch.id}</p>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">監視キーワード</p>
          <div className="flex flex-wrap gap-1.5">
            {watch.keywords.map(kw => (
              <span key={kw} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">{kw}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">ソースURL</p>
          <div className="space-y-1">
            {watch.sourceUrls.map(url => (
              <p key={url} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded truncate">{url}</p>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">
            通知スコアしきい値: <span className="text-indigo-600 font-bold">{threshold}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0（全て通知）</span>
            <span>100（最高のみ）</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
      >
        {saved ? '✓ 保存しました' : saving ? '保存中...' : '設定を保存'}
      </button>
    </div>
  )
}
