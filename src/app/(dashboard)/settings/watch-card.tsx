'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TopicWatch } from '@/types'
import KeywordInput from './keyword-input'
import SourceList from './source-list'

export default function WatchCard({ watch }: { watch: TopicWatch }) {
  const router = useRouter()
  const [label, setLabel] = useState(watch.label)
  const [keywords, setKeywords] = useState(watch.keywords)
  const [sourceUrls, setSourceUrls] = useState(watch.sourceUrls)
  const [enabled, setEnabled] = useState(watch.enabled)
  const [threshold, setThreshold] = useState(watch.scoreThreshold)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/settings/watches/${watch.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, keywords, sourceUrls, enabled, scoreThreshold: threshold }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleDelete() {
    if (!confirm(`「${label}」を削除しますか？`)) return
    setDeleting(true)
    await fetch(`/api/settings/watches/${watch.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          className="font-semibold text-slate-900 text-base bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none py-0.5 flex-1 mr-4"
        />
        <button
          onClick={() => setEnabled(!enabled)}
          className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">監視キーワード</p>
          <KeywordInput keywords={keywords} onChange={setKeywords} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">ソースURL</p>
          <SourceList urls={sourceUrls} onChange={setSourceUrls} />
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

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
        >
          {saved ? '✓ 保存しました' : saving ? '保存中...' : '設定を保存'}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? '削除中...' : '削除'}
        </button>
      </div>
    </div>
  )
}
