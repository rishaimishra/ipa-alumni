import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/admin/badge";
import { UserRoleSelect, UserStatusSelect } from "./user-row";

const STATUS_COLOR: Record<string, "success" | "warning" | "error"> = {
  ACTIVE: "success",
  PENDING_VERIFICATION: "warning",
  SUSPENDED: "error",
};

export default async function AdminUsersPage() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { alumniProfile: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
        Users
      </h1>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <table className="w-full text-left text-theme-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
              >
                <td className="px-5 py-3 text-gray-800 dark:text-white/90">
                  {user.alumniProfile?.fullName ?? "—"}
                </td>
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                  <div>{user.phone}</div>
                  {user.email && (
                    <div className="text-theme-xs">{user.email}</div>
                  )}
                </td>
                <td className="px-5 py-3">
                  <UserRoleSelect userId={user.id} role={user.role} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Badge color={STATUS_COLOR[user.status] ?? "light"}>
                      {user.status}
                    </Badge>
                    <UserStatusSelect userId={user.id} status={user.status} />
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
