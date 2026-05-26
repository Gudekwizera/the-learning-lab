import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { Pen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
  });

  const [featured, ...rest] = posts;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-full px-4 py-1.5 mb-2">
          <Pen size={13} />
          <span>Weekly reflections</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          The Learning Lab
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          Weekly reflections on learning, building, and growing. One post, every week.
        </p>
      </section>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-serif text-xl italic">No posts yet — the first one is coming soon.</p>
        </div>
      ) : (
        <section className="space-y-8">
          {featured && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Latest
              </p>
              <PostCard post={featured} featured />
            </div>
          )}

          {rest.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Past reflections
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Newsletter */}
      <NewsletterForm />
    </div>
  );
}
