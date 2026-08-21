"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export function SidebarToggleButton() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      onClick={() => {
        if (window.innerWidth >= 1024) {
          toggleSidebar();
        } else {
          toggleMobileSidebar();
        }
      }}
      className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
    >
      <Menu className="size-5" />
    </button>
  );
}
