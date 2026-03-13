import { BookOpen } from "lucide-react";

export default function BookingRulesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
        <BookOpen size={24} />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-slate-900">Booking Rules</h1>
      <p className="mt-1 text-sm text-slate-500">
        Configure booking policies and scheduling constraints.
      </p>
    </div>
  );
}
