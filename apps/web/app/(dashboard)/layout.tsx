import { useTranslations } from 'next-intl';
import { UserMenu } from '@/components/user-menu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dashboard');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-card p-4 md:block">
        <div className="mb-8">
          <span className="text-lg font-bold">SaaS Starter</span>
        </div>
        <nav className="space-y-1">
          <a
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            {t('home')}
          </a>
          <a
            href="/dashboard/collections"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            {t('collections')}
          </a>
          <a
            href="/dashboard/settings"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            {t('settings')}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b px-6">
          <h1 className="text-lg font-semibold">{t('title')}</h1>
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
