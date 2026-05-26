"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CommentForm({ postId, onSuccess }: { postId: string; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setMessage("");
        onSuccess();
      } else {
        const data = await res.json();
        setStatus("error");
        setError(data.error ?? "Failed to post comment.");
      }
    } catch {
      setStatus("error");
      setError("Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-primary font-medium text-sm py-4">
        Comment posted! Thanks for sharing your thoughts.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
      />
      <Textarea
        placeholder="Leave a comment…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        maxLength={1000}
        rows={4}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Posting…" : "Post comment"}
      </Button>
    </form>
  );
}
