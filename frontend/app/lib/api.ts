export type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export type Booking = {
  id: number;
  facilityName: string;
  employeeName: string;
  dateTime: string;
  status: BookingStatus;
};

export type DashboardStats = {
  totalBookings: number;
  activeFacilities: number;
  registeredUsers: number;
  pendingRequests: number;
};

export type CreateBookingInput = {
  facilityName: string;
  employeeName: string;
  dateTime: string;
  status?: string;
};

export type UpdateBookingInput = Partial<CreateBookingInput>;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ??
  "http://localhost:8081/api";

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch bookings (${res.status})`);
  }
  return (await res.json()) as Booking[];
}

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch stats (${res.status})`);
  }
  return (await res.json()) as DashboardStats;
}

export async function createBooking(
  input: CreateBookingInput
): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      status: input.status ?? "Pending",
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? `Failed to create (${res.status})`
    );
  }
  return (await res.json()) as Booking;
}

export async function updateBooking(
  id: number,
  input: UpdateBookingInput
): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? `Failed to update (${res.status})`
    );
  }
  return (await res.json()) as Booking;
}

export async function deleteBooking(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/bookings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? `Failed to delete (${res.status})`
    );
  }
}
