import { prisma } from "@/lib/prisma";
import { SearchResults } from "@/components/search-results";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search" };

export default async function SearchPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold mb-2">Search</h1>
        <p className="text-muted-foreground">Search across all posts by title, content, or tag.</p>
      </header>
      <SearchResults posts={posts} />
    </div>
  );
}
