export default function SettingsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Tab bar skeleton */}
      <div className="flex gap-4 border-b pb-2">
        <div className="h-8 w-20 rounded bg-muted" />
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="h-8 w-28 rounded bg-muted" />
      </div>

      {/* Form skeleton */}
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
        </div>
        <div className="h-10 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}
