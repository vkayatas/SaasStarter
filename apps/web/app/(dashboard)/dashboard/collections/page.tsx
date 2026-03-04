import { getTranslations } from 'next-intl/server';
import { CollectionsList } from '@/components/collections-list';

export default async function CollectionsPage() {
  const t = await getTranslations('collections');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <CollectionsList />
    </div>
  );
}
