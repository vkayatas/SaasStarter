import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // TODO: Fetch blog post by slug from CMS or MDX
  if (!slug) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">{slug}</h1>
      <p className="mt-4 text-muted-foreground">Blog post content goes here.</p>
    </article>
  );
}
