import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About The Learning Lab — weekly reflections on learning, building, and growing.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">About</h1>
        <div className="w-12 h-1 bg-primary rounded-full" />
      </header>

      <div className="prose-blog">
        <div className="flex items-start gap-6 mb-10">
          <div className="w-20 h-20 shrink-0 rounded-full bg-brand-subtle flex items-center justify-center text-primary text-3xl font-serif font-bold">
            B
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold mb-1">Hey, I&apos;m Bertrand</h2>
            <p className="text-muted-foreground text-sm">
              Builder, learner, and writer of weekly notes.
            </p>
          </div>
        </div>

        <p>
          Welcome to <strong>The Learning Lab</strong> — a place where I document what I learn every
          week. Each post is an honest reflection: what clicked, what confused me, what I built,
          and what I want to explore next.
        </p>

        <p>
          I started this blog because I believe learning in public is one of the most powerful
          things you can do. Writing forces clarity. Sharing invites connection. And looking back
          at old posts reminds you how far you&apos;ve come.
        </p>

        <p>
          Posts go up every week — no exceptions. Some weeks the insight is deep, some weeks it&apos;s
          just a small thing I noticed. Either way, it gets written down.
        </p>

        <h2>What you&apos;ll find here</h2>
        <ul>
          <li>Weekly reflections on things I&apos;m learning (code, ideas, life)</li>
          <li>Notes from projects I&apos;m building</li>
          <li>Books, talks, and resources that shaped my week</li>
          <li>Honest takes — including when things went wrong</li>
        </ul>

        <h2>Get in touch</h2>
        <p>
          I&apos;d love to hear from you. Leave a comment on any post, or reach out directly:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:bertrand.ishimwe@gmail.com">bertrand.ishimwe@gmail.com</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
