import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { DeleteCommentButton } from "@/components/delete-comment-button";

export default async function AdminCommentsPage() {
  await requireAdmin();

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold">Comments</h1>

      {comments.length === 0 && (
        <p className="text-muted-foreground italic text-center py-10">No comments yet.</p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-sm">{comment.name}</span>
                <span className="text-xs text-muted-foreground">on</span>
                <span className="text-xs text-primary truncate max-w-[200px]">
                  {comment.post.title}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{comment.message}</p>
            </div>
            <DeleteCommentButton commentId={comment.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
