'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTranslations } from 'next-intl';

const themes = ['light', 'dark', 'system'] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('common');

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;

  const icons = { light: Sun, dark: Moon, system: Monitor } as const;
  const current = (theme ?? 'system') as (typeof themes)[number];
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  const Icon = icons[current];

  const themeLabels: Record<string, string> = {
    light: t('themeLight'),
    dark: t('themeDark'),
    system: t('themeSystem'),
  };

  return (
    <button
      onClick={() => setTheme(next)}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
      aria-label={t('theme')}
      title={themeLabels[current] ?? current}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
