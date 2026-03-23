import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getAllPosts } from '@/lib/blog';

export default async function BlogIndexPage() {
  const t = await getTranslations('blog');
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>

      {posts.length === 0 ? (
        <p className="mt-8 text-muted-foreground">{t('noPosts')}</p>
      ) : (
        <div className="mt-8 space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b pb-6">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-2xl font-semibold group-hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString()} · {post.author}
              </p>
              {post.description && (
                <p className="mt-2 text-muted-foreground">{post.description}</p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
