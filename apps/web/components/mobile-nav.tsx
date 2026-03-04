'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, FolderOpen, Settings, Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';

const navItems = [
  { href: '/dashboard' as const, icon: Home, labelKey: 'home' as const },
  { href: '/dashboard/collections' as const, icon: FolderOpen, labelKey: 'collections' as const },
  { href: '/dashboard/settings' as const, icon: Settings, labelKey: 'settings' as const },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent md:hidden"
        aria-label={tc('openMenu')}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-lg font-bold">{tc('appName')}</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3 space-y-2">
          <LocaleSwitcher />
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
