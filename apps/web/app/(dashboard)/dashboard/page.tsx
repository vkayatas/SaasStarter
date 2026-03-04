import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { countCollections } from '@/lib/queries/collections';
import { countNotes } from '@/lib/queries/notes';
import { FolderOpen, FileText, Share2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  const session = await auth.api.getSession({ headers: await headers() });
  const collectionCount = session ? await countCollections(session.user.id) : 0;
  const noteCount = session ? await countNotes(session.user.id) : 0;

  const stats = [
    { label: t('stats.collections'), value: collectionCount, icon: FolderOpen },
    { label: t('stats.notes'), value: noteCount, icon: FileText },
    { label: t('stats.shared'), value: 0, icon: Share2 },
    { label: t('stats.recent'), value: 0, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('welcome')}</h2>
      <p className="text-muted-foreground">{t('welcomeDescription')}</p>

      {/* Dashboard cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <stat.icon className="h-4 w-4" />
              {stat.label}
            </div>
            <div className="mt-2 text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {collectionCount === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">{t('noCollections')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('noCollectionsDescription')}
          </p>
          <a
            href="/dashboard/collections"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('goToCollections')}
          </a>
        </div>
      )}
    </div>
  );
}
