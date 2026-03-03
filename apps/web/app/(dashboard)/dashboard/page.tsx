import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('welcome')}</h2>
      <p className="text-muted-foreground">{t('welcomeDescription')}</p>

      {/* Dashboard cards placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="mt-2 h-8 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
