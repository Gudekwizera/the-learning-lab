"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    setLoading(true);
    await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="shrink-0 text-muted-foreground hover:text-destructive"
    >
      <Trash2 size={15} />
    </Button>
  );
}
