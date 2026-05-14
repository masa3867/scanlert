import Link from 'next/link'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0">
        <div className="p-5 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">📡</span>
            <span className="font-bold text-indigo-600 text-lg">BriefingAI</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { href: '/dashboard', icon: '🗂️', label: 'トピック一覧' },
            { href: '/settings', icon: '🔍', label: '監視設定' },
            { href: '/settings/delivery', icon: '🔔', label: '配信設定' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 text-xs text-slate-400">
          <p className="font-medium text-slate-500 mb-1">BriefingAI</p>
          <p>© 2026 — F0 Mock</p>
        </div>
      </aside>
      <main className="ml-56 flex-1 p-8 min-h-screen">{children}</main>
    </div>
  )
}
