export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-28 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-10 bg-slate-100 rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
