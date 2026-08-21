import { requireRole } from "@/lib/dal";
import { listAllAnnouncements } from "@/lib/services/announcement-service";
import { AnnouncementForm } from "./announcement-form";
import { AnnouncementActions } from "./announcement-row";

export default async function AdminAnnouncementsPage() {
  await requireRole(["ADMIN", "MODERATOR"]);
  const announcements = await listAllAnnouncements();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
        Announcements
      </h1>

      <AnnouncementForm />

      <div className="flex flex-col gap-3">
        {announcements.length === 0 && (
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            No announcements yet.
          </p>
        )}
        {announcements.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {a.title}
                  </p>
                  <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                    {a.type}
                  </span>
                </div>
                <p className="mt-1 text-theme-sm text-gray-600 dark:text-gray-300">
                  {a.body}
                </p>
                {a.endsAt && (
                  <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    Expires {a.endsAt.toLocaleString()}
                  </p>
                )}
              </div>
              <AnnouncementActions id={a.id} isActive={a.isActive} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
