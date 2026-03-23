import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getPostBySlug, getAllPosts } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const t = await getTranslations('blog');
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; {t('backToList')}
      </Link>

      <h1 className="mt-4 text-4xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {new Date(post.date).toLocaleDateString()} · {post.author}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-3 flex gap-2">
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

      <div
        className="prose prose-neutral dark:prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
      />
    </article>
  );
}

/** Minimal markdown → HTML for blog posts (no external deps). */
function markdownToHtml(md: string): string {
  return md
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    // Ordered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Unordered lists
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n+/g, '</p><p>')
    // Wrap in paragraph
    .replace(/^(.+)$/s, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '');
}
