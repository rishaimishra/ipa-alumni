"use client";

import { useSidebar } from "./sidebar-context";

export function AdminContentShell({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const expanded = isExpanded || isHovered || isMobileOpen;

  return (
    <div
      className={`transition-all duration-300 ${
        expanded ? "lg:ml-[260px]" : "lg:ml-[90px]"
      }`}
    >
      {children}
    </div>
  );
}
