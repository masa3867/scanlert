'use client'

import { useState } from 'react'

interface SourceListProps {
  urls: string[]
  onChange: (urls: string[]) => void
}

export default function SourceList({ urls, onChange }: SourceListProps) {
  const [input, setInput] = useState('')

  function addUrl() {
    const trimmed = input.trim()
    if (trimmed && !urls.includes(trimmed)) {
      onChange([...urls, trimmed])
    }
    setInput('')
  }

  return (
    <div>
      <div className="space-y-1 mb-2 min-h-[8px]">
        {urls.map(url => (
          <div key={url} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
            <span className="truncate flex-1">{url}</span>
            <button type="button" onClick={() => onChange(urls.filter(u => u !== url))} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">×</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="RSS フィードURLを入力"
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          type="button"
          onClick={addUrl}
          className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          追加
        </button>
      </div>
    </div>
  )
}
