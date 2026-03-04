'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Loader2, Monitor, Smartphone, Globe, Trash2 } from 'lucide-react';

interface SessionItem {
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  expiresAt: Date;
}

function getDeviceIcon(userAgent?: string | null) {
  if (!userAgent) return <Globe className="h-4 w-4" />;
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return <Smartphone className="h-4 w-4" />;
  }
  return <Monitor className="h-4 w-4" />;
}

function parseUserAgent(
  userAgent: string | null | undefined,
  unknownDevice: string,
  unknownBrowser: string,
  unknownOS: string,
  formatBrowserOs: (values: { browser: string; os: string }) => string,
): string {
  if (!userAgent) return unknownDevice;
  // Simple extraction of browser and OS
  const browsers = ['Firefox', 'Chrome', 'Safari', 'Edge', 'Opera'];
  const browser = browsers.find((b) => userAgent.includes(b)) ?? unknownBrowser;
  const osPatterns: [RegExp, string][] = [
    [/Windows NT/i, 'Windows'],
    [/Mac OS X/i, 'macOS'],
    [/Linux/i, 'Linux'],
    [/Android/i, 'Android'],
    [/iPhone|iPad/i, 'iOS'],
  ];
  const os = osPatterns.find(([re]) => re.test(userAgent))?.[1] ?? unknownOS;
  return formatBrowserOs({ browser, os });
}

export function SessionsList() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await authClient.listSessions();
      if (res.data) {
        setSessions(res.data as unknown as SessionItem[]);
      }
    } catch {
      toast.error(tc('error'));
    } finally {
      setLoading(false);
    }
  }, [tc]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  async function handleRevoke(token: string) {
    setRevokingToken(token);
    try {
      await authClient.revokeSession({ token });
      toast.success(t('sessionRevoked'));
      setSessions((prev) => prev.filter((s) => s.token !== token));
    } catch {
      toast.error(tc('error'));
    } finally {
      setRevokingToken(null);
    }
  }

  async function handleRevokeAll() {
    setRevokingAll(true);
    try {
      await authClient.revokeSessions();
      toast.success(t('allSessionsRevoked'));
      // After revoking all other sessions, refetch — only current session remains
      await fetchSessions();
    } catch {
      toast.error(tc('error'));
    } finally {
      setRevokingAll(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {t('sessions')}
            </CardTitle>
            <CardDescription>{t('sessionsDescription')}</CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAll}
              disabled={revokingAll}
            >
              {revokingAll && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('revokeAllSessions')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {tc('loading')}
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, idx) => (
              <div
                key={session.token}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    {getDeviceIcon(session.userAgent)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {parseUserAgent(
                        session.userAgent,
                        t('unknownDevice'),
                        t('unknownBrowser'),
                        t('unknownOS'),
                        (v) => t('browserOnOs', v),
                      )}
                      {idx === 0 && (
                        <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                          {t('currentSession')}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.ipAddress ?? t('unknownIP')} &middot;{' '}
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {idx !== 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRevoke(session.token)}
                    disabled={revokingToken === session.token}
                  >
                    {revokingToken === session.token ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
