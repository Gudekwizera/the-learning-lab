import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";

export default async function AdminNewsletterPage() {
  await requireAdmin();

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-3xl font-bold">Newsletter</h1>
        <div className="inline-flex items-center gap-1.5 bg-brand-subtle text-primary rounded-full px-3 py-1 text-sm font-medium">
          <Users size={13} />
          {subscribers.length} subscribers
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <p className="text-sm text-muted-foreground">
            Subscribers are notified automatically when you publish a new post.
          </p>
        </div>

        {subscribers.length === 0 ? (
          <p className="text-muted-foreground italic text-center py-10">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3">{sub.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
