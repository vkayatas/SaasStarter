'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
] as const;

export function LocaleSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('common');

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  if (collapsed) {
    // Cycle through locales when collapsed
    const currentIndex = locales.findIndex((l) => l.code === locale);
    const next = locales[(currentIndex + 1) % locales.length] ?? locales[0];
    return (
      <button
        onClick={() => switchLocale(next.code)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label={t('language')}
        title={locale.toUpperCase()}
      >
        <Languages className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Languages className="h-4 w-4 text-muted-foreground" />
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => switchLocale(l.code)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            locale === l.code
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
