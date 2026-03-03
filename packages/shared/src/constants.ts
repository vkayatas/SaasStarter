export const APP_NAME = 'SaaS Starter';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const RATE_LIMITS = {
  PUBLIC: { limit: 60, window: '1m' },
  AUTHENTICATED: { limit: 120, window: '1m' },
  SENSITIVE: { limit: 10, window: '1m' },
} as const;

export const SUPPORTED_LOCALES = ['en', 'de'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en';
