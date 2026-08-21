import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { SidebarToggleButton } from "./sidebar-toggle";

export function AdminHeader({
  userEmail,
  userRole,
}: {
  userEmail: string | null | undefined;
  userRole: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:px-6">
      <SidebarToggleButton />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
            {userEmail}
          </p>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            {userRole}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin-login" });
          }}
        >
          <button
            type="submit"
            aria-label="Sign out"
            className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <LogOut className="size-5" />
          </button>
        </form>
      </div>
    </header>
  );
}
