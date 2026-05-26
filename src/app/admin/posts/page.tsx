import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PenLine, Eye } from "lucide-react";

export default async function AdminPostsPage() {
  await requireAdmin();

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: true, _count: { select: { comments: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PenLine size={15} />
          New post
        </Link>
      </div>

      <div className="space-y-2">
        {posts.length === 0 && (
          <p className="text-muted-foreground italic text-center py-10">No posts yet.</p>
        )}
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 bg-card border border-border rounded-xl px-5 py-4 hover:border-primary/40 transition-all"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={post.status === "PUBLISHED" ? "default" : "secondary"}
                  className={`text-xs ${post.status === "PUBLISHED" ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {post.status === "PUBLISHED" ? "Published" : "Draft"}
                </Badge>
                <span className="text-xs text-muted-foreground">Week {post.weekNumber}</span>
                {post.publishedAt && (
                  <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
                )}
              </div>
              <p className="font-medium truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {post._count.comments} comments · {post.tags.map((t) => t.name).join(", ") || "no tags"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {post.status === "PUBLISHED" && (
                <Link
                  href={`/posts/${post.slug}`}
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="View post"
                >
                  <Eye size={15} />
                </Link>
              )}
              <Link
                href={`/admin/posts/${post.id}`}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Edit"
              >
                <PenLine size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
