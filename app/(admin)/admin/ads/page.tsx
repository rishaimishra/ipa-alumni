import { requireRole } from "@/lib/dal";
import { listAllBanners } from "@/lib/services/ad-service";
import { BannerForm } from "./banner-form";
import { BannerActions } from "./banner-row";

export default async function AdminAdsPage() {
  await requireRole(["ADMIN", "MODERATOR"]);
  const banners = await listAllBanners();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
        Ad Banners
      </h1>

      <BannerForm />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.length === 0 && (
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            No banners yet.
          </p>
        )}
        {banners.map((b) => (
          <div
            key={b.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.imageUrl} alt={b.title} className="h-32 w-full object-cover" />
            <div className="flex flex-col gap-2 p-4">
              <p className="font-medium text-gray-800 dark:text-white/90">{b.title}</p>
              <p className="truncate text-theme-xs text-gray-500 dark:text-gray-400">
                {b.linkUrl}
              </p>
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {b.impressionCount} impressions &middot; {b.clickCount} clicks
              </p>
              <BannerActions id={b.id} isActive={b.isActive} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
