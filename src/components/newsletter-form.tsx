"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're subscribed! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-8 sm:p-10 text-center">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
        Get new posts in your inbox
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
        Every week, one reflection. No noise, no spam — just what I learned.
      </p>

      {status === "success" ? (
        <p className="text-primary font-medium">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background"
          />
          <Button type="submit" disabled={status === "loading"} className="shrink-0">
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      )}

      {status === "error" && (
        <p className="text-destructive text-sm mt-3">{message}</p>
      )}
    </section>
  );
}
