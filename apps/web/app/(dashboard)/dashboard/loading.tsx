export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
            <div className="mt-2 h-9 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
