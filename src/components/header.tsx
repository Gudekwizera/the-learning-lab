import Link from "next/link";
import { Search } from "lucide-react";
import { DarkModeToggle } from "./dark-mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          The Learning Lab
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/about"
            className="hidden sm:block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
          >
            About
          </Link>
          <Link
            href="/search"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </Link>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
