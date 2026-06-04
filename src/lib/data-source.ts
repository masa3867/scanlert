import { IS_MOCK_MODE } from './env'

/** Supabase の URL / サービスロールキーが設定されているか */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  )
}

/** インメモリ mock ではなく Supabase を使うか */
export function usesSupabaseStorage(): boolean {
  return !IS_MOCK_MODE && isSupabaseConfigured()
}

export function formatDataError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: unknown }).message
    if (typeof msg === 'string') return msg
  }
  return 'データベースへの接続に失敗しました'
}

type WithDataSourceOptions = {
  /** 接続失敗時にモックへフォールバックする（既定: 開発環境のみ） */
  fallbackToMockOnError?: boolean
}

/**
 * 読み取り系: Supabase 利用時に失敗したら開発ではモックへフォールバックし warning を返す。
 */
export async function withDataSource<T>(
  mockFn: () => T | Promise<T>,
  supabaseFn: () => Promise<T>,
  options?: WithDataSourceOptions,
): Promise<{ data: T; warning?: string }> {
  if (!usesSupabaseStorage()) {
    return { data: await mockFn() }
  }

  const fallback = options?.fallbackToMockOnError ?? process.env.NODE_ENV === 'development'

  try {
    return { data: await supabaseFn() }
  } catch (error) {
    const message = formatDataError(error)
    console.error('[db] Supabase error:', message)
    if (fallback) {
      return {
        data: await mockFn(),
        warning:
          'Supabase に接続できません。モックデータを表示しています。URL・キーを確認するか、ローカルでは PIPELINE_MODE=mock を検討してください。',
      }
    }
    throw new Error(message)
  }
}

/** 書き込み系: 失敗時は例外（モックへ黙ってフォールバックしない） */
export async function withSupabaseWrite<T>(fn: () => Promise<T>): Promise<T> {
  if (!usesSupabaseStorage()) {
    throw new Error('Supabase is not configured for write operations.')
  }
  try {
    return await fn()
  } catch (error) {
    throw new Error(formatDataError(error))
  }
}
