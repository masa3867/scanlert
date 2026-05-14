import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function scoreColor(score: number) {
  if (score >= 80) return 'bg-red-100 text-red-700'
  if (score >= 60) return 'bg-amber-100 text-amber-700'
  return 'bg-slate-100 text-slate-600'
}
