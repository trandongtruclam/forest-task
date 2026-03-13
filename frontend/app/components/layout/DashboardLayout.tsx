"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 shrink-0 border-b border-slate-200/60 bg-white/80 px-4 py-2.5 backdrop-blur-lg sm:px-6 lg:px-8">
            <MobileHeader
              onMenuClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            />
            <Header className="hidden lg:flex" />
          </div>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1280px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
