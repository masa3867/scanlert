import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopic } from '@/lib/db'
import { formatDate, scoreColor } from '@/lib/utils'
import StatusActions from './status-actions'

export const dynamic = 'force-dynamic'

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const topic = await getTopic(id)
  if (!topic) notFound()

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        ← トピック一覧に戻る
      </Link>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-4 shadow-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold ${scoreColor(topic.relevanceScore)}`}>
            <span className="text-2xl leading-none">{topic.relevanceScore}</span>
            <span className="text-xs opacity-70">pts</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {topic.watchLabel && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{topic.watchLabel}</span>
              )}
              {topic.model && (
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">model: {topic.model}</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">{topic.title}</h1>
            <p className="text-sm text-slate-400 mt-1">{formatDate(topic.createdAt)}</p>
          </div>
        </div>

        <StatusActions topicId={topic.id} currentStatus={topic.status} />
      </div>

      {/* AI Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">🤖 AI要約 — 自社への影響度</h2>
        <p className="text-slate-800 leading-relaxed">{topic.summary}</p>
      </div>

      {/* Source snippet */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">📄 ソース抜粋</h2>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{topic.contentSnippet}</p>
        <a
          href={topic.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-sm text-indigo-600 hover:underline"
        >
          元記事を開く →
        </a>
      </div>

      {/* Relevance score breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">📊 スコア詳細</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 w-24 shrink-0">影響度スコア</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${topic.relevanceScore >= 80 ? 'bg-red-400' : topic.relevanceScore >= 60 ? 'bg-amber-400' : 'bg-slate-400'}`}
                style={{ width: `${topic.relevanceScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 w-12 text-right">{topic.relevanceScore} / 100</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-red-50 text-red-700 rounded-lg p-2">
            <div className="font-bold">80以上</div>
            <div>要注意</div>
          </div>
          <div className="bg-amber-50 text-amber-700 rounded-lg p-2">
            <div className="font-bold">60〜79</div>
            <div>要確認</div>
          </div>
          <div className="bg-slate-50 text-slate-600 rounded-lg p-2">
            <div className="font-bold">60未満</div>
            <div>参考情報</div>
          </div>
        </div>
      </div>
    </div>
  )
}
