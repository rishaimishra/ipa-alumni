export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-semibold">IPAM Alumni</span>
          <nav className="flex gap-4 text-sm">
            <a href="/jobs">Jobs</a>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
