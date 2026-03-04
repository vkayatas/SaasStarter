import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('marketing');
  const tc = useTranslations('common');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          {tc('appName')}
        </Link>
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

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {tc('appName')}. {t('allRightsReserved')}
      </footer>
    </div>
  );
}
