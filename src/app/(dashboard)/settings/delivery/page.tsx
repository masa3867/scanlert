import { getDeliverySettings } from '@/lib/db'
import type { DeliverySettings } from '@/types'
import DataWarningBanner from '../../data-warning-banner'
import DeliveryForm from './delivery-form'

export const revalidate = 30

export default async function DeliverySettingsPage() {
  const result = await getDeliverySettings()
  const { warning, ...settings } = result as DeliverySettings & { warning?: string }

  return (
    <div className="max-w-xl">
      {warning && <DataWarningBanner message={warning} />}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">配信設定</h1>
        <p className="text-sm text-slate-500 mt-1">Slack通知の設定を管理します。</p>
      </div>
      <DeliveryForm initial={settings} />
    </div>
  )
}
