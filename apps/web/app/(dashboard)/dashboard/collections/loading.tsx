export default function CollectionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>

      {/* Collection list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-2">
              <div className="h-5 w-36 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
            <div className="h-8 w-8 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
