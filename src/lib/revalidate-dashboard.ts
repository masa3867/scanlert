import { revalidatePath } from 'next/cache'

/** トピック・監視・配信の変更後にダッシュボード関連ページのキャッシュを無効化 */
export function revalidateDashboardPaths(topicId?: string) {
  revalidatePath('/dashboard')
  revalidatePath('/settings')
  revalidatePath('/settings/delivery')
  if (topicId) revalidatePath(`/topics/${topicId}`)
}
