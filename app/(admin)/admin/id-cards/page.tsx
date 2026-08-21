import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/admin/badge";
import { PhysicalCardStatusSelect, PaymentVerifiedCheckbox } from "./request-row";

const STATUS_COLOR: Record<string, "warning" | "primary" | "success" | "error" | "light"> = {
  REQUESTED: "warning",
  PRINTING: "primary",
  SHIPPED: "primary",
  DELIVERED: "success",
  CANCELLED: "error",
};

export default async function AdminIdCardsPage() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const [requests, virtualCardCount] = await Promise.all([
    prisma.physicalCardRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { include: { alumniProfile: true } } },
    }),
    prisma.virtualIdCard.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
          ID Card Management
        </h1>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          {virtualCardCount} virtual card{virtualCardCount === 1 ? "" : "s"} issued
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <table className="w-full text-left text-theme-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-5 py-3 font-medium">Alumni</th>
              <th className="px-5 py-3 font-medium">Delivery Address</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No physical card requests yet.
                </td>
              </tr>
            )}
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
              >
                <td className="px-5 py-3">
                  <div className="text-gray-800 dark:text-white/90">
                    {req.user.alumniProfile?.fullName ?? req.user.phone}
                  </div>
                  <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                    {req.user.phone}
                  </div>
                </td>
                <td className="max-w-xs px-5 py-3 text-gray-500 dark:text-gray-400">
                  {req.deliveryAddress}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <PaymentVerifiedCheckbox
                      requestId={req.id}
                      verified={req.paymentVerified}
                    />
                    <Badge color={req.paymentVerified ? "success" : "warning"}>
                      {req.paymentVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Badge color={STATUS_COLOR[req.status] ?? "light"}>
                      {req.status}
                    </Badge>
                    <PhysicalCardStatusSelect requestId={req.id} status={req.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
