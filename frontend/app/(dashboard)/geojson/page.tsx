import { Layers } from "lucide-react";

export default function GeoJsonPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Layers size={24} />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-slate-900">GeoJSON Layers</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage geographic data layers for the campus map.
      </p>
    </div>
  );
}
