import { getWatches } from '@/lib/db'
import WatchCard from './watch-card'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const watches = await getWatches()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">監視設定</h1>
        <p className="text-sm text-slate-500 mt-1">キーワードと情報ソースを管理します。</p>
      </div>

      <div className="space-y-4">
        {watches.map((watch) => (
          <WatchCard key={watch.id} watch={watch} />
        ))}
      </div>

      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-600">
        <h3 className="font-semibold text-slate-700 mb-2">📌 自動収集について</h3>
        <p className="leading-relaxed">
          Vercel Cron Jobs が毎時自動収集します。RSS フィードをキーワードでフィルタリングし、Claude API でスコアリング・要約後にトピックとして取り込みます。
          通知の設定は <a href="/settings/delivery" className="text-indigo-600 hover:underline">配信設定</a> から変更できます。
        </p>
      </div>
    </div>
  )
}
