'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import KeywordInput from './keyword-input'
import SourceList from './source-list'

export default function WatchFormModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [sourceUrls, setSourceUrls] = useState<string[]>([])
  const [scoreThreshold, setScoreThreshold] = useState(60)
  const [saving, setSaving] = useState(false)

  function handleClose() {
    setOpen(false)
    setLabel('')
    setKeywords([])
    setSourceUrls([])
    setScoreThreshold(60)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim()) return
    setSaving(true)
    await fetch('/api/settings/watches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, keywords, sourceUrls, scoreThreshold }),
    })
    setSaving(false)
    handleClose()
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      >
        <span className="text-base leading-none">＋</span> 新規監視設定
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleClose}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">新規監視設定を追加</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">ラベル <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="例: 競合動向、AI最新情報"
                  required
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">監視キーワード</label>
                <KeywordInput keywords={keywords} onChange={setKeywords} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">ソースURL（RSS）</label>
                <SourceList urls={sourceUrls} onChange={setSourceUrls} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">
                  通知スコアしきい値: <span className="text-indigo-600 font-bold">{scoreThreshold}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scoreThreshold}
                  onChange={e => setScoreThreshold(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0（全て通知）</span>
                  <span>100（最高のみ）</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving || !label.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  {saving ? '作成中...' : '作成する'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
