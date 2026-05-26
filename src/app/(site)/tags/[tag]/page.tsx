import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const tagName = decodeURIComponent(tag);

  const tagRecord = await prisma.tag.findUnique({
    where: { name: tagName },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { tags: true },
      },
    },
  });

  if (!tagRecord) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-subtle text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          #{tagRecord.name}
        </div>
        <h1 className="font-serif text-3xl font-bold">
          {tagRecord.posts.length} {tagRecord.posts.length === 1 ? "post" : "posts"}
        </h1>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {tagRecord.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
