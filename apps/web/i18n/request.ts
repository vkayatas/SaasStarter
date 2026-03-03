import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // TODO: Detect locale from cookie, header, or URL
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
