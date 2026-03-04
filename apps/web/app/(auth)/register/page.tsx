'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signUp, signIn } from '@/lib/auth-client';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signUp.email(
      { name, email, password },
      { onSuccess: () => router.push('/dashboard') },
    );
    if (err) setError(err.message ?? t('signUpFailed'));
    setLoading(false);
  }

  async function handleOAuth(provider: 'google' | 'github') {
    await signIn.social({ provider, callbackURL: '/dashboard' });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('signUp')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('signUpDescription')}</p>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-accent"
          >
            {t('continueWithGoogle')}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-accent"
          >
            {t('continueWithGitHub')}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('orContinueWith')}</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              {t('name')}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? '...' : t('signUp')}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t('haveAccount')}{' '}
          <Link href="/login" className="text-primary underline">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
