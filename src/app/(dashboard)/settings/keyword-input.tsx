'use client'

import { useState, KeyboardEvent } from 'react'

interface KeywordInputProps {
  keywords: string[]
  onChange: (keywords: string[]) => void
}

export default function KeywordInput({ keywords, onChange }: KeywordInputProps) {
  const [input, setInput] = useState('')

  function addKeyword(value: string) {
    const trimmed = value.trim().replace(/,$/, '')
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed])
    }
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword(input)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
        {keywords.map(kw => (
          <span key={kw} className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
            {kw}
            <button type="button" onClick={() => onChange(keywords.filter(k => k !== kw))} className="hover:text-red-500 transition-colors leading-none ml-0.5">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addKeyword(input)}
        placeholder="キーワードを入力してEnter"
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  )
}
