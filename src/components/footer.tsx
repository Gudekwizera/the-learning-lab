export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="font-serif italic">The Learning Lab</p>
        <p>© {new Date().getFullYear()} — Weekly reflections on learning, building, and growing.</p>
      </div>
    </footer>
  );
}
