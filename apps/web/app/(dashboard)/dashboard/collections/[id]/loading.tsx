export default function CollectionDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Collection header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-48 rounded bg-muted" />
        <div className="h-9 w-28 rounded bg-muted" />
      </div>

      {/* Notes list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-14 rounded-full bg-muted" />
              <div className="h-5 w-14 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
