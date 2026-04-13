import React from "react";
import { Bell, AlertTriangle, CheckCircle, Info, BookOpen } from "lucide-react";

export interface AlertItem {
  id: string | number;
  type: "danger" | "warning" | "info" | "success";
  category: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const iconMap = {
  danger: <AlertTriangle className="w-4 h-4 text-red-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
};

const dotMap = {
  danger: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  success: "bg-emerald-500",
};

interface AlertCardProps {
  alert: AlertItem;
  onMarkRead?: (id: string | number) => void;
}

export function AlertCard({ alert, onMarkRead }: AlertCardProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
        alert.read
          ? "bg-card border-border"
          : "bg-secondary/40 border-primary/20"
      }`}
    >
      <div className="mt-0.5 flex-shrink-0">{iconMap[alert.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {alert.category}
          </span>
          {!alert.read && (
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[alert.type]}`} />
          )}
        </div>
        <p className={`text-sm font-medium ${alert.read ? "text-muted-foreground" : "text-foreground"}`}>
          {alert.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.body}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{alert.time}</span>
          {!alert.read && onMarkRead && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="text-xs text-primary hover:underline"
            >
              읽음 표시
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
