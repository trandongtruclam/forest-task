import { CalendarDays, Clock, TreePine, Users } from "lucide-react";
import type { DashboardStats } from "../../lib/api";
import { StatCard } from "../ui/StatCard";

type StatsOverviewProps = {
  stats: DashboardStats | null;
};

export function StatsOverview({ stats }: StatsOverviewProps) {
  const fmt = (n: number | undefined) =>
    n !== undefined ? n.toLocaleString() : "\u2014";

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Bookings"
        value={fmt(stats?.totalBookings)}
        icon={<CalendarDays size={20} />}
      />
      <StatCard
        label="Active Facilities"
        value={fmt(stats?.activeFacilities)}
        icon={<TreePine size={20} />}
      />
      <StatCard
        label="Registered Users"
        value={fmt(stats?.registeredUsers)}
        icon={<Users size={20} />}
      />
      <StatCard
        label="Pending Requests"
        value={fmt(stats?.pendingRequests)}
        badge={stats?.pendingRequests ? "New" : undefined}
        icon={<Clock size={20} />}
      />
    </section>
  );
}
