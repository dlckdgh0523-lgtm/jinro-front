import React from "react";

type BadgeVariant =
  | "danger" | "warning" | "normal" | "success"
  | "challenge" | "suitable" | "safe"
  | "info" | "pending" | "in_progress" | "completed";

const variantStyles: Record<BadgeVariant, string> = {
  danger:      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  warning:     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  normal:      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  success:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  info:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  challenge:   "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  suitable:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  safe:        "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  pending:     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const variantLabels: Record<BadgeVariant, string> = {
  danger:      "위험",
  warning:     "주의",
  normal:      "정상",
  success:     "완료",
  info:        "정보",
  challenge:   "도전",
  suitable:    "적정",
  safe:        "안정",
  pending:     "대기중",
  in_progress: "진행중",
  completed:   "완료",
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ variant, label, size = "md" }: StatusBadgeProps) {
  const text = label ?? variantLabels[variant];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantStyles[variant]}`}>
      {text}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
}
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const map = {
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    low: "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400",
  };
  const labels = { high: "높음", medium: "중간", low: "낮음" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[priority]}`}>
      {labels[priority]}
    </span>
  );
}
