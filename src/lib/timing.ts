/** 開発時のみ DB 呼び出しの所要時間をログ出力する */
export async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  if (process.env.NODE_ENV !== 'development') return fn()
  const start = performance.now()
  try {
    return await fn()
  } finally {
    console.log(`[db] ${label}: ${(performance.now() - start).toFixed(1)}ms`)
  }
}
