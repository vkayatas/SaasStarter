import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('marketing');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold">SaaS Starter</span>
        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
            {t('pricing')}
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            {t('signIn')}
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
          {t('heroTitle')}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {t('heroDescription')}
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
          >
            {t('getStarted')}
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-border px-6 py-3 hover:bg-accent"
          >
            {t('viewPricing')}
          </Link>
        </div>
      </main>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SaaS Starter. All rights reserved.
      </footer>
    </div>
  );
}
