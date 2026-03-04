'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@saas/ui';
import { Loader2, User } from 'lucide-react';

export function ProfileForm() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.name ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await authClient.updateUser({ name });
      toast.success(t('profileUpdated'));
    } catch {
      toast.error(tc('error'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t('profile')}
        </CardTitle>
        <CardDescription>{t('profileDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={session?.user?.email ?? ''}
              disabled
              className="opacity-60"
            />
            <p className="text-xs text-muted-foreground">{t('emailDescription')}</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tc('save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
