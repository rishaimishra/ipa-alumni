import Link from "next/link";
import { auth } from "@/lib/auth";
import { listActiveAnnouncementsForUser } from "@/lib/services/announcement-service";
import { AnnouncementPopup } from "@/components/announcement-popup";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const announcements = session?.user
    ? await listActiveAnnouncementsForUser(session.user.id)
    : [];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-semibold">IPAM Alumni Portal</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/id-card">ID Card</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <AnnouncementPopup announcements={announcements} />
    </div>
  );
}
