import { getCollection } from '@/lib/queries/collections';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { NotesList } from '@/components/notes-list';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const { id } = await params;
  const collection = await getCollection(id, session.user.id);
  if (!collection) notFound();

  return (
    <div>
      <NotesList collectionId={collection.id} collectionName={collection.name} />
    </div>
  );
}
