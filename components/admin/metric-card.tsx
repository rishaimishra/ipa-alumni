import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        <Icon className="size-6 text-gray-800 dark:text-white/90" />
      </div>
      <div className="mt-5">
        <span className="text-theme-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
          {value}
        </h4>
      </div>
    </div>
  );
}
