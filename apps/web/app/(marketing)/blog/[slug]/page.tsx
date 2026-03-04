import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const t = await getTranslations('blog');

  // TODO: Fetch blog post by slug from CMS or MDX
  if (!slug) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">{slug}</h1>
      <p className="mt-4 text-muted-foreground">{t('placeholder')}</p>
    </article>
  );
}
