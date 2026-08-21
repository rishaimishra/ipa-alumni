import { getActiveBanners } from "@/lib/services/ad-service";

export async function AdBanner() {
  const banners = await getActiveBanners();
  const banner = banners[0];
  if (!banner) return null;

  return (
    <a
      href={`/api/ads/${banner.id}/click`}
      className="block overflow-hidden rounded-lg border"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="h-auto w-full object-cover"
      />
    </a>
  );
}
