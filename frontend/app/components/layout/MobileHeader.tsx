import { MapPin, Menu } from "lucide-react";
import { Avatar } from "../ui/Avatar";

type MobileHeaderProps = {
  onMenuClick?: () => void;
  className?: string;
};

export function MobileHeader({
  onMenuClick,
  className = "",
}: MobileHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        type="button"
        onClick={onMenuClick}
        className="flex items-center gap-2.5 rounded-lg p-1 -ml-1 hover:bg-slate-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-slate-600" />
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-green-800">
            <MapPin size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">
            Forestinc
          </span>
        </div>
      </button>
      <Avatar initials="EW" />
    </div>
  );
}
