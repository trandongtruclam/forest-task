import { ExternalLink, MapPin } from "lucide-react";

export function CampusMapCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      {/* Map illustration */}
      <div className="relative h-36 overflow-hidden bg-linear-to-br from-green-800 via-green-700 to-emerald-600">
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.12]"
          viewBox="0 0 400 200"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0 140 Q60 100 120 120 T240 110 T360 100 L400 140 L400 200 L0 200Z"
            fill="white"
          />
          <path
            d="M0 160 Q80 130 160 150 T320 140 L400 160 L400 200 L0 200Z"
            fill="white"
          />
          <circle cx="80" cy="80" r="3" fill="white" opacity="0.5" />
          <circle cx="200" cy="60" r="4" fill="white" opacity="0.4" />
          <circle cx="300" cy="90" r="2.5" fill="white" opacity="0.5" />
          <circle cx="150" cy="100" r="2" fill="white" opacity="0.3" />
          <path
            d="M80 80 L200 60 L300 90 L150 100Z"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.2"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <MapPin size={24} className="mb-1.5 opacity-80" />
          <span className="text-xs font-medium tracking-wide opacity-70">
            CAMPUS MAP
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs text-slate-400">Updated 2h ago</p>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
        >
          Open Map
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}
