import { cn } from "../../lib/utils";

type AvatarProps = {
  initials: string;
  size?: "sm" | "md";
  className?: string;
};

export function Avatar({ initials, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-full bg-green-800 font-semibold text-white",
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs",
        className
      )}
    >
      {initials}
    </div>
  );
}
