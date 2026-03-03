'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { toast } from 'sonner';

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (isPending) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />;
  }

  if (!session?.user) {
    return (
      <a
        href="/login"
        className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Sign In
      </a>
    );
  }

  const initials = (session.user.name ?? session.user.email ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out');
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90"
        aria-label="User menu"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-md border bg-card p-1 shadow-lg">
          <div className="border-b px-3 py-2">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <a
            href="/dashboard/settings"
            className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Settings
          </a>
          <button
            onClick={handleSignOut}
            className="w-full rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
