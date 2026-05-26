"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/post-card";
import { Search } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  weekNumber: number;
  excerpt?: string | null;
  content: string;
  publishedAt?: Date | null;
  tags: { id: string; name: string }[];
}

export function SearchResults({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        (post.excerpt ?? "").toLowerCase().includes(q) ||
        post.content.replace(/<[^>]+>/g, "").toLowerCase().includes(q) ||
        post.tags.some((t) => t.name.toLowerCase().includes(q))
    );
  }, [query, posts]);

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      {query && (
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length === 0 && query ? (
        <p className="text-muted-foreground italic font-serif text-lg py-8 text-center">
          No posts found for &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
