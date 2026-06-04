export default function DataWarningBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-800 text-xs mb-6">
      {message}
    </div>
  )
}
