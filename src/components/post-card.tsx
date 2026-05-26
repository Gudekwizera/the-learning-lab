import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";

interface PostCardProps {
  post: {
    title: string;
    slug: string;
    weekNumber: number;
    excerpt?: string | null;
    content: string;
    publishedAt?: Date | null;
    tags: { id: string; name: string }[];
  };
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const minutes = readingTime(post.content);

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article
        className={`rounded-xl border border-border bg-card p-6 h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 ${
          featured ? "sm:p-8" : ""
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="font-medium text-primary">Week {post.weekNumber}</span>
          <span>·</span>
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {minutes} min read
          </span>
        </div>

        <h2
          className={`font-serif font-bold text-foreground group-hover:text-primary transition-colors mb-3 ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {post.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs bg-brand-subtle text-primary hover:bg-brand-subtle/80 cursor-pointer"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
