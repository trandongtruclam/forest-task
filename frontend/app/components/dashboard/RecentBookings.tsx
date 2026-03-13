import {
  Bath,
  Building2,
  ChevronRight,
  Leaf,
  Monitor,
  TreePine,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { Booking } from "../../lib/api";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700 ring-green-200/60",
  pending: "bg-amber-50 text-amber-700 ring-amber-200/60",
  completed: "bg-blue-50 text-blue-700 ring-blue-200/60",
  cancelled: "bg-slate-50 text-slate-600 ring-slate-200/60",
  canceled: "bg-slate-50 text-slate-600 ring-slate-200/60",
};

function StatusBadge({ status }: { status: string }) {
  const cls =
    STATUS_STYLES[status.toLowerCase()] ??
    "bg-slate-50 text-slate-600 ring-slate-200/60";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        cls
      )}
    >
      {status}
    </span>
  );
}

type FacilityIconConfig = {
  icon: typeof Building2;
  colorClass: string;
};

const FACILITY_ICON_MAP: { keywords: string[]; config: FacilityIconConfig }[] = [
  {
    keywords: ["oak", "trail", "forest"],
    config: { icon: TreePine, colorClass: "text-green-600 bg-green-50" },
  },
  {
    keywords: ["crystal", "spring", "bath"],
    config: { icon: Bath, colorClass: "text-cyan-600 bg-cyan-50" },
  },
  {
    keywords: ["zen", "garden", "deck"],
    config: { icon: Leaf, colorClass: "text-emerald-600 bg-emerald-50" },
  },
  {
    keywords: ["silent", "pod"],
    config: { icon: Monitor, colorClass: "text-violet-600 bg-violet-50" },
  },
  {
    keywords: ["birch", "hut"],
    config: { icon: Building2, colorClass: "text-amber-600 bg-amber-50" },
  },
];

const DEFAULT_FACILITY_ICON: FacilityIconConfig = {
  icon: Building2,
  colorClass: "text-slate-500 bg-slate-50",
};

function FacilityIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const match = FACILITY_ICON_MAP.find((entry) =>
    entry.keywords.some((kw) => n.includes(kw))
  );
  const { icon: Icon, colorClass } = match?.config ?? DEFAULT_FACILITY_ICON;

  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
        colorClass
      )}
    >
      <Icon size={15} />
    </span>
  );
}

type RecentBookingsProps = {
  bookings: Booking[];
  error?: string | null;
};

export function RecentBookings({ bookings, error }: RecentBookingsProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Recent Bookings
        </h3>
        <div className="mt-3 rounded-lg bg-amber-50 p-4 ring-1 ring-inset ring-amber-200/60">
          <p className="text-sm text-slate-700">
            Couldn&apos;t load bookings. Ensure the backend is running.
          </p>
          <p className="mt-1 text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Recent Bookings
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Latest facility reservations
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-50"
        >
          View all
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-slate-500">
                Facility
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-slate-500">
                Employee
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-slate-500">
                Date & Time
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-16 text-center text-sm text-slate-400"
                >
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.slice(0, 6).map((b) => (
                <tr
                  key={b.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <FacilityIcon name={b.facilityName} />
                      <span className="font-medium text-slate-900">
                        {b.facilityName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {b.employeeName}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDateTime(b.dateTime)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {bookings.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-2.5 sm:hidden">
          <p className="text-[11px] text-slate-400">
            Swipe to view all columns
          </p>
        </div>
      )}
    </div>
  );
}
