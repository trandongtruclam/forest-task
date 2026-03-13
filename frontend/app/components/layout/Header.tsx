"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar } from "../ui/Avatar";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/facilities": "Facilities",
  "/booking-rules": "Booking Rules",
  "/geojson": "GeoJSON Layers",
  "/users": "Users",
  "/reports": "Reports",
};

type HeaderProps = {
  className?: string;
};

export function Header({ className = "" }: HeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-900 shrink-0">
          {title}
        </h1>

        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <div className="text-[13px] font-medium text-slate-900 leading-tight">
              Elena Wood
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              Super Admin
            </div>
          </div>
          <Avatar initials="EW" />
        </div>
      </div>
    </header>
  );
}
