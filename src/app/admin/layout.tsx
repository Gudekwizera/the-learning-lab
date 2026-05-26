import Link from "next/link";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif font-bold text-foreground">
              Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link href="/admin/posts" className="text-muted-foreground hover:text-foreground transition-colors">Posts</Link>
              <Link href="/admin/posts/new" className="text-muted-foreground hover:text-foreground transition-colors">New post</Link>
              <Link href="/admin/comments" className="text-muted-foreground hover:text-foreground transition-colors">Comments</Link>
              <Link href="/admin/newsletter" className="text-muted-foreground hover:text-foreground transition-colors">Newsletter</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← View site
            </Link>
            <DarkModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">{children}</main>
    </div>
  );
}
