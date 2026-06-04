/**
 * `.env` で `PIPELINE_MODE=mock` と指定したときのみ true。
 * デモ用バナー・手動取得ボタン、`POST /api/pipeline/trigger` のデモ挙動はこれに合わせる。
 */
export const IS_PIPELINE_MODE_MOCK = process.env.PIPELINE_MODE === 'mock'

/**
 * インメモリの mock-data を使うかどうか。以下のどちらかなら true（Supabase 等は使わない）。
 *
 * 1. `ANTHROPIC_API_KEY` が未設定・空文字（ falsy ）
 * 2. `PIPELINE_MODE` が文字列 `'mock'` と完全一致（`IS_PIPELINE_MODE_MOCK` と同義）
 */
export const IS_MOCK_MODE =
  !process.env.ANTHROPIC_API_KEY || IS_PIPELINE_MODE_MOCK

/** ダッシュボード一覧の最大件数 */
export const TOPICS_LIST_LIMIT = 100
