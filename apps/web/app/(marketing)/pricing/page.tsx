import { useTranslations } from 'next-intl';

export default function PricingPage() {
  const t = useTranslations('pricing');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="max-w-xl text-center text-muted-foreground">{t('description')}</p>

      <div className="grid max-w-4xl gap-8 md:grid-cols-3">
        {/* Free Tier */}
        <div className="flex flex-col gap-4 rounded-lg border p-6">
          <h3 className="text-lg font-semibold">{t('free.name')}</h3>
          <p className="text-3xl font-bold">$0</p>
          <p className="text-sm text-muted-foreground">{t('free.description')}</p>
        </div>

        {/* Pro Tier */}
        <div className="flex flex-col gap-4 rounded-lg border-2 border-primary p-6">
          <h3 className="text-lg font-semibold">{t('pro.name')}</h3>
          <p className="text-3xl font-bold">$20</p>
          <p className="text-sm text-muted-foreground">{t('pro.description')}</p>
        </div>

        {/* Enterprise Tier */}
        <div className="flex flex-col gap-4 rounded-lg border p-6">
          <h3 className="text-lg font-semibold">{t('enterprise.name')}</h3>
          <p className="text-3xl font-bold">{t('enterprise.price')}</p>
          <p className="text-sm text-muted-foreground">{t('enterprise.description')}</p>
        </div>
      </div>
    </div>
  );
}
