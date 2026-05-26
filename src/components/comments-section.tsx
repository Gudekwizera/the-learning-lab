"use client";

import { useState } from "react";
import { CommentForm } from "./comment-form";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
}

export function CommentsSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);

  async function refreshComments() {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  }

  return (
    <section className="mt-16">
      <Separator className="mb-10" />
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle size={20} className="text-primary" />
        <h2 className="font-serif text-xl font-bold">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h2>
      </div>

      <div className="space-y-6 mb-10">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center text-primary font-semibold text-sm">
                  {comment.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{comment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{comment.message}</p>
            </div>
          ))
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-serif font-semibold mb-4">Leave a comment</h3>
        <CommentForm postId={postId} onSuccess={refreshComments} />
      </div>
    </section>
  );
}
