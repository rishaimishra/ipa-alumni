import { Users, Ticket, TicketCheck, GraduationCap, Megaphone, MousePointerClick } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { MetricCard } from "@/components/admin/metric-card";
import { RegistrationsChart } from "@/components/admin/registrations-chart";

const CHART_DAYS = 14;

function localDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildDailyCounts(dates: Date[]) {
  const days: { key: string; label: string }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      key: localDateKey(d),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  const counts = new Map(days.map((d) => [d.key, 0]));
  for (const date of dates) {
    const key = localDateKey(date);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return {
    categories: days.map((d) => d.label),
    data: days.map((d) => counts.get(d.key) ?? 0),
  };
}

export default async function AdminHomePage() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const since = new Date();
  since.setDate(since.getDate() - (CHART_DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const [
    userCount,
    alumniCount,
    ticketCount,
    openTicketCount,
    activeAnnouncementCount,
    adClicksAggregate,
    recentUsers,
    recentRegistrations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: ["ALUMNI", "STUDENT"] } } }),
    prisma.supportTicket.count(),
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.announcement.count({ where: { isActive: true } }),
    prisma.adBanner.aggregate({ _sum: { clickCount: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { alumniProfile: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  const chart = buildDailyCounts(recentRegistrations.map((u) => u.createdAt));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
        Executive Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <MetricCard label="Total Users" value={userCount} icon={Users} />
        <MetricCard
          label="Alumni & Students"
          value={alumniCount}
          icon={GraduationCap}
        />
        <MetricCard label="Total Tickets" value={ticketCount} icon={Ticket} />
        <MetricCard
          label="Open Tickets"
          value={openTicketCount}
          icon={TicketCheck}
        />
        <MetricCard
          label="Active Announcements"
          value={activeAnnouncementCount}
          icon={Megaphone}
        />
        <MetricCard
          label="Total Ad Clicks"
          value={adClicksAggregate._sum.clickCount ?? 0}
          icon={MousePointerClick}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h2 className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
          Registrations — last {CHART_DAYS} days
        </h2>
        <div className="mt-4">
          <RegistrationsChart categories={chart.categories} data={chart.data} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h2 className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
          Recent Registrations
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-theme-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Phone</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                >
                  <td className="py-2 pr-4 text-gray-800 dark:text-white/90">
                    {u.alumniProfile?.fullName ?? "—"}
                  </td>
                  <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">
                    {u.phone}
                  </td>
                  <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">
                    {u.role}
                  </td>
                  <td className="py-2 text-gray-500 dark:text-gray-400">
                    {u.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
