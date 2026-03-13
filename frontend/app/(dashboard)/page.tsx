import type { Booking, DashboardStats } from "../lib/api";
import { fetchBookings, fetchStats } from "../lib/api";
import {
  CampusMapCard,
  FacilityUsage,
  RecentBookings,
  StatsOverview,
} from "../components/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let bookings: Booking[] = [];
  let bookingsError: string | null = null;
  let stats: DashboardStats | null = null;

  const results = await Promise.allSettled([
    fetchBookings(),
    fetchStats(),
  ]);

  if (results[0].status === "fulfilled") {
    bookings = results[0].value;
  } else {
    bookingsError =
      results[0].reason instanceof Error
        ? results[0].reason.message
        : "Failed to load bookings";
  }

  if (results[1].status === "fulfilled") {
    stats = results[1].value;
  }

  return (
    <>
      <StatsOverview stats={stats} />

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RecentBookings bookings={bookings} error={bookingsError} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <FacilityUsage />
          <CampusMapCard />
        </div>
      </section>
    </>
  );
}
