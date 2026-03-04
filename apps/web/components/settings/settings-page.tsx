'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProfileForm } from '@/components/settings/profile-form';
import { PasswordForm } from '@/components/settings/password-form';
import { SessionsList } from '@/components/settings/sessions-list';
import { DangerZone } from '@/components/settings/danger-zone';
import { Separator } from '@saas/ui';
import { cn } from '@saas/ui';

const tabs = ['profile', 'security'] as const;
type Tab = (typeof tabs)[number];

export function SettingsPage() {
  const t = useTranslations('settings');
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      <Separator />

      {/* Tab content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <ProfileForm />
          <DangerZone />
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <PasswordForm />
          <SessionsList />
        </div>
      )}
    </div>
  );
}
