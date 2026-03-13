"use client";

import {
  BarChart3,
  BookOpen,
  Home,
  Layers,
  MapPin,
  Settings,
  TreePine,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { cn } from "../../lib/utils";

type NavItem = {
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Facilities", icon: TreePine, href: "/facilities" },
  { label: "Booking Rules", icon: BookOpen, href: "/booking-rules" },
  { label: "GeoJSON Layers", icon: Layers, href: "/geojson" },
  { label: "Users", icon: Users, href: "/users" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
];

function SidebarItem({
  active,
  label,
  icon: Icon,
  href,
}: {
  active: boolean;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium transition-all duration-150",
        active
          ? "bg-green-50 text-green-800"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon
        size={18}
        className={cn(
          active
            ? "text-green-700"
            : "text-slate-400 group-hover:text-slate-600 transition-colors"
        )}
      />
      <span>{label}</span>
    </Link>
  );
}

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-[232px] shrink-0 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 ease-out",
        "fixed inset-y-0 left-0 z-50 shadow-lg lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 lg:shadow-none",
        "max-h-screen lg:max-h-none lg:min-h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-green-800">
              <MapPin size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 leading-tight">
                Forestinc
              </div>
              <div className="truncate text-[11px] text-slate-400 leading-tight">
                Campus Admin
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          <p className="px-3 pb-1.5 pt-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Menu
          </p>
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              active={
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              }
              label={item.label}
              icon={item.icon}
              href={item.href}
            />
          ))}
        </nav>

        <div className="border-t border-slate-100 px-3 py-3">
          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings
              size={18}
              className="text-slate-400 group-hover:text-slate-600 transition-colors"
            />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
