import Link from 'next/link'
import { getTopicsList } from '@/lib/db'
import { IS_PIPELINE_MODE_MOCK } from '@/lib/env'
import { formatDate, scoreColor } from '@/lib/utils'
import DataWarningBanner from '../data-warning-banner'
import TriggerButton from './trigger-button'

export const revalidate = 30

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status: statusParam } = await searchParams
  const status =
    statusParam === 'new' || statusParam === 'read' || statusParam === 'dismissed'
      ? statusParam
      : undefined

  const { topics, counts, warning } = await getTopicsList({ q, status })

  return (
    <div>
      {warning && <DataWarningBanner message={warning} />}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">トピック一覧</h1>
          <p className="text-sm text-slate-500 mt-0.5">自社ビジネスへの影響度をAIがスコアリング</p>
        </div>
        <div className="flex items-center gap-3">
          <TriggerButton isMock={IS_PIPELINE_MODE_MOCK} />
        </div>
      </div>

      {IS_PIPELINE_MODE_MOCK && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-amber-700 text-xs mb-6 flex items-center gap-2">
          <span>🔧</span>
          <span>モックモードで動作中。ANTHROPIC_API_KEY を設定すると実際のAI要約が有効になります。</span>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-5">
        <form className="flex-1">
          <input
            name="q"
            defaultValue={q}
            placeholder="タイトル・要約を検索..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>
        <div className="flex gap-1">
          {([
            { key: undefined, label: `全て (${counts.all})` },
            { key: 'new', label: `新着 (${counts.new})` },
            { key: 'read', label: `既読 (${counts.read})` },
            { key: 'dismissed', label: `非表示 (${counts.dismissed})` },
          ] as const).map(({ key, label }) => (
            <Link
              key={String(key)}
              href={key ? `/dashboard?status=${key}${q ? `&q=${encodeURIComponent(q)}` : ''}` : q ? `/dashboard?q=${encodeURIComponent(q)}` : '/dashboard'}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                status === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Topic list */}
      {topics.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-600">トピックが見つかりません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}`}
              className={`block bg-white border rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all ${
                topic.status === 'new' ? 'border-slate-200' : 'border-slate-100 opacity-70'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Score badge */}
                <div className={`shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-sm ${scoreColor(topic.relevanceScore)}`}>
                  <span className="text-lg leading-none">{topic.relevanceScore}</span>
                  <span className="text-xs leading-none opacity-70">pts</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {topic.status === 'new' && (
                      <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded font-medium">NEW</span>
                    )}
                    {topic.watchLabel && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{topic.watchLabel}</span>
                    )}
                  </div>
                  <h2 className="font-semibold text-slate-900 mb-1.5 line-clamp-1">{topic.title}</h2>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{topic.summary}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatDate(topic.createdAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
