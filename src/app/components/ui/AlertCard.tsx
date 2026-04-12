import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export type AlertCategory = "성적" | "알림" | "상담" | "공지" | "계획" | "시스템";
export type AlertType = "danger" | "warning" | "success" | "info";

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  type: AlertType;
  time: string;
  isRead: boolean;
}

interface AlertCardProps {
  alert: AlertItem;
  onMarkRead?: (id: string) => void;
}

const typeIcon: Record<AlertType, React.ReactNode> = {
  danger:  <AlertTriangle size={15} color="#D44848" />,
  warning: <AlertTriangle size={15} color="#D4956A" />,
  success: <CheckCircle size={15} color="#6BAE8A" />,
  info:    <Info size={15} color="#8B9ED4" />,
};

const typeBg: Record<AlertType, string> = {
  danger:  "rgba(212, 72, 72, 0.06)",
  warning: "rgba(212, 149, 106, 0.06)",
  success: "rgba(107, 174, 138, 0.06)",
  info:    "rgba(139, 158, 212, 0.06)",
};

const typeBorder: Record<AlertType, string> = {
  danger:  "rgba(212, 72, 72, 0.2)",
  warning: "rgba(212, 149, 106, 0.2)",
  success: "rgba(107, 174, 138, 0.2)",
  info:    "rgba(139, 158, 212, 0.2)",
};

export function AlertCard({ alert, onMarkRead }: AlertCardProps) {
  return (
    <div
      className="flex gap-3 p-4 rounded-xl transition-all"
      style={{
        background: alert.isRead ? "var(--card)" : typeBg[alert.type],
        border: `1px solid ${alert.isRead ? "var(--border)" : typeBorder[alert.type]}`,
        opacity: alert.isRead ? 0.7 : 1,
      }}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: alert.isRead ? "var(--muted)" : typeBg[alert.type] }}
      >
        {typeIcon[alert.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm" style={{ color: "var(--foreground)", fontWeight: 600 }}>
              {alert.title}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                fontSize: "0.68rem",
              }}
            >
              {alert.category}
            </span>
            {!alert.isRead && <StatusBadge status="new" label="NEW" />}
          </div>
          {onMarkRead && !alert.isRead && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="flex-shrink-0 p-1 rounded hover:bg-accent transition-colors"
            >
              <X size={12} style={{ color: "var(--brand-text-muted)" }} />
            </button>
          )}
        </div>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          {alert.description}
        </p>
        <p className="text-xs mt-1.5" style={{ color: "var(--brand-text-light)" }}>
          {alert.time}
        </p>
      </div>
    </div>
  );
}
