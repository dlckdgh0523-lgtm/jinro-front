import React, { useMemo, useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { AlertCard, type AlertItem } from "../../components/AlertCard";
import { Bell, Check, GraduationCap } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const toAlertItem = (item: AlertItem) => item;

export function TeacherAlertCenter() {
  const { notifications, markRead, markAllRead, isLoading, error } = useNotification();
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "important">("all");

  const alerts = useMemo(() => notifications.map(toAlertItem), [notifications]);
  const unread = alerts.filter((item) => !item.read);
  const important = alerts.filter((item) => item.type === "danger" || item.type === "warning");
  const goalAlerts = alerts.filter((item) => item.category === "진로");

  const displayed =
    activeTab === "unread" ? unread : activeTab === "important" ? important : alerts;

  return (
    <div>
      <Breadcrumb items={[{ label: "알림" }, { label: "교사 알림 센터" }]} />
      <PageTitle
        title="교사 알림 센터"
        subtitle="학생 성적, 학습 이행, 상담 요청, 학생이 보낸 진로 목표 알림을 확인하세요."
        action={
          <button
            onClick={() => void markAllRead()}
            className="flex items-center gap-1.5 px-4 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> 모두 읽음 표시
          </button>
        }
      />

      {goalAlerts.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-primary">
            <strong>학생 진로 관련 알림 {goalAlerts.length}건</strong>이 도착했습니다.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-xl font-semibold text-foreground">{alerts.length}</p>
          <p className="text-xs text-muted-foreground mt-1">전체 알림</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-700 p-4 text-center">
          <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">{unread.length}</p>
          <p className="text-xs text-muted-foreground mt-1">미확인</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-700 p-4 text-center">
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">{important.length}</p>
          <p className="text-xs text-muted-foreground mt-1">중요 알림</p>
        </div>
      </div>

      <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit mb-5">
        {(["all", "unread", "important"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 h-8 rounded-lg text-sm transition-colors ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all"
              ? "전체"
              : tab === "unread"
                ? `미확인 (${unread.length})`
                : `중요 (${important.length})`}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">알림을 불러오고 있습니다.</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">알림이 없습니다.</p>
          </div>
        ) : (
          displayed.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onMarkRead={(id) => void markRead(String(id))} />
          ))
        )}
      </div>
    </div>
  );
}
