import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('marketing');

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
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
    </div>
  );
}
