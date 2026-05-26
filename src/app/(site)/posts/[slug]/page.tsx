import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { CommentsSection } from "@/components/comments-section";
import { formatDate, readingTime } from "@/lib/utils";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { tags: true, comments: { where: { approved: true }, orderBy: { createdAt: "asc" } } },
  });

  if (!post) notFound();

  const allPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, weekNumber: true },
  });

  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = allPosts[idx + 1] ?? null;
  const nextPost = allPosts[idx - 1] ?? null;
  const minutes = readingTime(post.content);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      {/* Article header */}
      <header className="mb-10 max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <span className="font-medium text-primary">Week {post.weekNumber}</span>
          <span>·</span>
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {minutes} min read
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.name}`}>
                <Badge variant="secondary" className="bg-brand-subtle text-primary hover:bg-brand-subtle/80">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Article body */}
      <article
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Prev / next nav */}
      <nav className="mt-16 grid grid-cols-2 gap-4">
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.slug}`}
            className="group col-start-1 flex flex-col gap-1 rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-all"
          >
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowLeft size={12} /> Previous
            </span>
            <span className="font-serif font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
              Week {prevPost.weekNumber} — {prevPost.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextPost && (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="group col-start-2 flex flex-col gap-1 rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-all text-right"
          >
            <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
              Next <ArrowRight size={12} />
            </span>
            <span className="font-serif font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
              Week {nextPost.weekNumber} — {nextPost.title}
            </span>
          </Link>
        )}
      </nav>

      {/* Comments */}
      <CommentsSection postId={post.id} initialComments={post.comments} />
    </div>
  );
}
