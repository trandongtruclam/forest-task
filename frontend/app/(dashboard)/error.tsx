"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <AlertTriangle size={24} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        Something went wrong
      </h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {error.message || "An unexpected error occurred while loading the dashboard."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  );
}
