'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@saas/ui';
import { Loader2, AlertTriangle } from 'lucide-react';

export function DangerZone() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setDeleting(true);
    try {
      await authClient.deleteUser();
      toast.success('Account deleted');
      router.push('/');
      router.refresh();
    } catch {
      toast.error(tc('error'));
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {t('dangerZone')}
        </CardTitle>
        <CardDescription>{t('deleteAccountDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {confirming && (
          <p className="mb-4 text-sm text-destructive">
            {t('deleteAccountConfirm')}
          </p>
        )}
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirming ? tc('delete') : t('deleteAccount')}
          </Button>
          {confirming && (
            <Button
              variant="outline"
              onClick={() => setConfirming(false)}
              disabled={deleting}
            >
              {tc('cancel')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
