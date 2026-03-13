import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down" };
  badge?: string;
  icon: ReactNode;
};

export function StatCard({ label, value, delta, badge, icon }: StatCardProps) {
  return (
    <div className="relative rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight text-slate-900">
              {value}
            </p>
            {badge && (
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/60">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
          {icon}
        </div>
      </div>

      {delta ? (
        <div className="mt-3 flex items-center gap-1">
          {delta.direction === "up" ? (
            <TrendingUp size={14} className="text-green-600" />
          ) : (
            <TrendingDown size={14} className="text-rose-500" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              delta.direction === "up" ? "text-green-600" : "text-rose-500"
            )}
          >
            {delta.value}
          </span>
          <span className="text-xs text-slate-400">vs last week</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">Updated today</p>
      )}
    </div>
  );
}
