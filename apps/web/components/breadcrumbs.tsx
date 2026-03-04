'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

/** Map URL segments to i18n keys */
const segmentKeys: Record<string, { ns: string; key: string }> = {
  dashboard: { ns: 'dashboard', key: 'title' },
  collections: { ns: 'collections', key: 'title' },
  settings: { ns: 'settings', key: 'title' },
  notes: { ns: 'notes', key: 'title' },
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const tDashboard = useTranslations('dashboard');
  const tCollections = useTranslations('collections');
  const tSettings = useTranslations('settings');
  const tNotes = useTranslations('notes');

  const translators: Record<string, (key: string) => string> = {
    dashboard: tDashboard,
    collections: tCollections,
    settings: tSettings,
    notes: tNotes,
  };

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return null; // Don't show on /dashboard root

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const mapping = segmentKeys[seg];
    let label: string;
    if (mapping) {
      const t = translators[mapping.ns];
      label = t ? t(mapping.key) : seg;
    } else {
      // Dynamic segment (e.g. collection ID) — show truncated
      label = seg.length > 12 ? seg.slice(0, 12) + '…' : seg;
    }
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href as any} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
