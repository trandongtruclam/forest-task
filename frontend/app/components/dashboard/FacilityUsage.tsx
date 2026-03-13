import { TrendingUp } from "lucide-react";

const USAGE_DATA = [
  { label: "Old Oak Trail", value: 84, color: "bg-green-600" },
  { label: "Zen Garden Deck", value: 72, color: "bg-emerald-500" },
  { label: "Silent Pods", value: 61, color: "bg-teal-500" },
  { label: "Crystal Spring", value: 48, color: "bg-cyan-500" },
  { label: "Birch Hut", value: 35, color: "bg-slate-400" },
];

function UsageBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-medium text-slate-700">{label}</span>
        <span className="text-[13px] font-semibold text-slate-900 tabular-nums">
          {value}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export function FacilityUsage() {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Facility Usage
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Last 7 days utilization
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-50"
        >
          Details
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {USAGE_DATA.map((item) => (
          <UsageBar key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg bg-green-50 px-3.5 py-3">
        <TrendingUp size={14} className="text-green-600 shrink-0" />
        <div>
          <p className="text-xs text-slate-500">Most popular this week</p>
          <p className="text-[13px] font-semibold text-slate-900">
            Old Oak Forest Trail
          </p>
        </div>
      </div>
    </div>
  );
}
