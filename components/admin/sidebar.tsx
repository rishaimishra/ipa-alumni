"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Ticket, IdCard, Megaphone, Image as ImageIcon } from "lucide-react";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutGrid },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "ID Cards", href: "/admin/id-cards", icon: IdCard },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Ads", href: "/admin/ads", icon: ImageIcon },
  { name: "Support Tickets", href: "/admin/tickets", icon: Ticket },
];

export function AdminSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const showLabels = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white px-5 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
        showLabels ? "w-[260px]" : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center py-6 text-lg font-semibold text-gray-900 dark:text-white">
        {showLabels ? "IPAM Admin" : "IA"}
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`menu-item group ${
                active ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              <Icon
                className={`size-5 shrink-0 ${
                  active ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}
              />
              {showLabels && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
