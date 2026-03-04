import { CollectionsList } from '@/components/collections-list';

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Collections</h2>
        <p className="text-muted-foreground">
          Organize your items into collections.
        </p>
      </div>
      <CollectionsList />
    </div>
  );
}
