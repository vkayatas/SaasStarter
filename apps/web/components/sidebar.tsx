'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Home,
  FolderOpen,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';

const navItems = [
  { href: '/dashboard' as const, icon: Home, labelKey: 'home' as const },
  { href: '/dashboard/collections' as const, icon: FolderOpen, labelKey: 'collections' as const },
  { href: '/dashboard/settings' as const, icon: Settings, labelKey: 'settings' as const },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const t = useTranslations('dashboard');

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`hidden flex-col border-r bg-card transition-all duration-200 md:flex ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo / Brand */}
      <div className="flex h-14 items-center border-b px-4">
        {collapsed ? (
          <span className="mx-auto text-lg font-bold">S</span>
        ) : (
          <Link href="/dashboard" className="text-lg font-bold">
            SaaS Starter
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? t(item.labelKey) : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer — toggle, theme, locale */}
      <div className={`border-t p-2 ${collapsed ? 'space-y-1' : 'space-y-2'}`}>
        {/* Locale */}
        <div className={collapsed ? 'flex justify-center' : 'px-1'}>
          <LocaleSwitcher collapsed={collapsed} />
        </div>

        {/* Theme + Collapse toggle */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-1' : 'justify-between px-1'}`}>
          <ThemeToggle />
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
