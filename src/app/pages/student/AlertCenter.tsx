import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { AlertCard, AlertItem } from "../../components/AlertCard";
import { ALERTS } from "../../data/mock";
import { Bell, Check } from "lucide-react";

const EXTRA_ALERTS: AlertItem[] = [
  { id: 6, type: "warning", category: "성적", title: "영어 모의고사 3등급 이하", body: "최근 영어 모의고사 성적이 3등급 이하입니다. 집중적인 학습이 필요합니다.", time: "3일 전", read: false },
  { id: 7, type: "info", category: "입시", title: "2026 수시 원서 접수 일정", body: "2026학년도 수시 원서 접수가 9월에 시작됩니다. 미리 준비하세요.", time: "1주일 전", read: true },
  { id: 8, type: "success", category: "학습", title: "주간 목표 달성!", body: "이번 주 학습 목표 80%를 달성했습니다. 훌륭해요!", time: "1주일 전", read: true },
];

const ALL_ALERTS: AlertItem[] = [...ALERTS as AlertItem[], ...EXTRA_ALERTS];

export function AlertCenter() {
  const [alerts, setAlerts] = useState(ALL_ALERTS);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "important">("all");

  const markRead = (id: number) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unread = alerts.filter((a) => !a.read);
  const important = alerts.filter((a) => a.type === "danger" || a.type === "warning");

  const displayed =
    activeTab === "unread" ? unread :
    activeTab === "important" ? important :
    alerts;

  return (
    <div>
      <Breadcrumb items={[{ label: "학습 실행" }, { label: "실시간 알림" }]} />
      <PageTitle
        title="실시간 알림 센터"
        subtitle="성적, 학습, 상담, 입시 관련 알림을 확인하세요."
        action={
          <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
            <Check className="w-3.5 h-3.5" /> 모두 읽음 표시
          </button>
        }
      />

      {/* Stats */}
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

      {/* Tabs */}
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
            {tab === "all" ? "전체" : tab === "unread" ? `미확인 (${unread.length})` : `중요 (${important.length})`}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">알림이 없습니다.</p>
          </div>
        ) : (
          displayed.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onMarkRead={markRead} />
          ))
        )}
      </div>
    </div>
  );
}
