import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">{t('notFoundTitle')}</h2>
      <p className="text-muted-foreground">{t('notFoundDescription')}</p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}
