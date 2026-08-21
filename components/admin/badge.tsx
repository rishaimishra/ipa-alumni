type BadgeColor = "primary" | "success" | "error" | "warning" | "light";

const colorClasses: Record<BadgeColor, string> = {
  primary: "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
  success:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  error: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
  warning:
    "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
  light: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
};

export function Badge({
  color = "light",
  children,
}: {
  color?: BadgeColor;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-theme-xs font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
}
