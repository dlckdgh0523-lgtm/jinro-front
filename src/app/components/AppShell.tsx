import React, { useState } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { NotificationProvider } from "../context/NotificationContext";
import { StudyPlanProvider } from "../context/StudyPlanContext";
import { NotificationToast } from "./NotificationToast";
import { readAuthSession } from "../utils/authApi";

interface AppShellProps {
  role: "student" | "teacher";
  userName?: string;
  schoolName?: string;
  alertCount?: number;
}

export function AppShell({ role, userName, schoolName, alertCount }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = readAuthSession();
  const resolvedUserName = session?.user.name || userName;
  const resolvedSchoolName = session?.user.schoolName || schoolName;

  return (
    <NotificationProvider role={role}>
      <StudyPlanProvider>
        <div className="min-h-screen bg-background">
          <Header
            role={role}
            userName={resolvedUserName}
            schoolName={resolvedSchoolName}
            alertCount={alertCount}
            onMenuOpen={() => setSidebarOpen(true)}
          />
          <Sidebar
            role={role}
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          {/* 실시간 알림 팝업 */}
          <NotificationToast />
          {/* Desktop: offset by sidebar width. Mobile: no offset */}
          <main className="md:ml-56 pt-14 min-h-screen">
            <div className="p-4 md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </StudyPlanProvider>
    </NotificationProvider>
  );
}

// ─── Shared sub-components ───────────────────────────────────────────────────

interface BreadcrumbProps {
  items: { label: string; path?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span>/</span>}
          <span
            className={
              idx === items.length - 1
                ? "text-foreground font-medium"
                : "hover:text-foreground cursor-pointer"
            }
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  color?: "default" | "danger" | "warning" | "success" | "info";
}

const colorMap = {
  default: "bg-card",
  danger: "bg-red-50 dark:bg-red-900/10",
  warning: "bg-amber-50 dark:bg-amber-900/10",
  success: "bg-emerald-50 dark:bg-emerald-900/10",
  info: "bg-blue-50 dark:bg-blue-900/10",
};

export function StatCard({ label, value, sub, icon, color = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl border border-border p-5 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
