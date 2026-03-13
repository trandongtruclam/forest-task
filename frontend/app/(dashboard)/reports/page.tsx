import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
        <BarChart3 size={24} />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-slate-900">Reports</h1>
      <p className="mt-1 text-sm text-slate-500">
        View analytics and generate facility usage reports.
      </p>
    </div>
  );
}
