'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Integrate Better-Auth sign-in
    console.log('Login:', { email, password });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('signIn')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('signInDescription')}</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-accent">
            {t('continueWithGoogle')}
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-accent">
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

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            {t('signIn')}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-primary underline">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
