import { getWatches } from '@/lib/mock-data'
import WatchCard from './watch-card'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const watches = getWatches()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">監視設定</h1>
        <p className="text-sm text-slate-500 mt-1">キーワードと情報ソースを管理します。本番では n8n が定期クロールします。</p>
      </div>

      <div className="space-y-4">
        {watches.map((watch) => (
          <WatchCard key={watch.id} watch={watch} />
        ))}
      </div>

      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-600">
        <h3 className="font-semibold text-slate-700 mb-2">📌 n8n連携について</h3>
        <p className="leading-relaxed">
          本番環境では n8n ワークフローが定期的に RSS/HTTP を収集し、Claude API でスコアリング・要約後、
          <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">POST /api/webhooks/n8n/ingest</code> 経由で取り込みます。
          n8n の設定は <a href="/settings/delivery" className="text-indigo-600 hover:underline">配信設定</a> から確認できます。
        </p>
      </div>
    </div>
  )
}
