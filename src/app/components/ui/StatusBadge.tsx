interface StatusBadgeProps {
  status: "danger" | "warning" | "success" | "challenge" | "fit" | "safe" | "info" | "unread" | "read" | "new";
  label?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  danger:    { bg: "rgba(212, 72, 72, 0.12)",   text: "#D44848", label: "위험" },
  warning:   { bg: "rgba(212, 149, 106, 0.15)", text: "#D4956A", label: "주의" },
  success:   { bg: "rgba(107, 174, 138, 0.15)", text: "#6BAE8A", label: "정상" },
  challenge: { bg: "rgba(212, 72, 72, 0.12)",   text: "#D44848", label: "도전" },
  fit:       { bg: "rgba(212, 149, 106, 0.15)", text: "#D4956A", label: "적정" },
  safe:      { bg: "rgba(107, 174, 138, 0.15)", text: "#6BAE8A", label: "안정" },
  info:      { bg: "rgba(139, 158, 212, 0.15)", text: "#8B9ED4", label: "정보" },
  unread:    { bg: "rgba(193, 123, 110, 0.15)", text: "#C17B6E", label: "미확인" },
  read:      { bg: "rgba(156, 114, 104, 0.1)",  text: "#9C7268", label: "확인됨" },
  new:       { bg: "rgba(193, 123, 110, 0.15)", text: "#C17B6E", label: "NEW" },
};

export function StatusBadge({ status, label, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.info;
  const displayLabel = label ?? config.label;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: config.bg,
        color: config.text,
        borderRadius: "6px",
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        fontSize: size === "sm" ? "0.7rem" : "0.78rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        lineHeight: 1.6,
      }}
    >
      {displayLabel}
    </span>
  );
}
