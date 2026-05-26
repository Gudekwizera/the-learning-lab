import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PenLine, MessageCircle, Users, BookOpen } from "lucide-react";

export default async function AdminDashboard() {
  await requireAdmin();

  const [postCount, draftCount, commentCount, subscriberCount] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.comment.count({ where: { approved: true } }),
    prisma.subscriber.count(),
  ]);

  const stats = [
    { label: "Published posts", value: postCount, icon: BookOpen, href: "/admin/posts" },
    { label: "Drafts", value: draftCount, icon: PenLine, href: "/admin/posts" },
    { label: "Comments", value: commentCount, icon: MessageCircle, href: "/admin/comments" },
    { label: "Subscribers", value: subscriberCount, icon: Users, href: "/admin/newsletter" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PenLine size={15} />
          New post
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all hover:-translate-y-0.5"
          >
            <Icon size={18} className="text-muted-foreground mb-3" />
            <p className="text-2xl font-bold font-serif">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
