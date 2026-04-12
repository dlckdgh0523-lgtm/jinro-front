import React, { useState, useEffect } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { AlertCard, AlertItem } from "../../components/AlertCard";
import { Bell, Check, GraduationCap } from "lucide-react";

const TEACHER_ALERT_KEY = "jinro_teacher_goal_alerts";

const STATIC_ALERTS: AlertItem[] = [
  {
    id: 1,
    type: "danger",
    category: "성적",
    title: "박지호 학생 수학 급락",
    body: "박지호 학생의 수학 성적이 3등급에서 5등급으로 하락했습니다. 즉각적인 상담이 필요합니다.",
    time: "30분 전",
    read: false,
  },
  {
    id: 2,
    type: "danger",
    category: "학습",
    title: "오승우 학생 학습 미이행",
    body: "오승우 학생이 2주 연속 학습 계획을 30% 미만으로 이행하고 있습니다.",
    time: "1시간 전",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    category: "상담",
    title: "상담 미완료 학생 3명",
    body: "이번 주 상담 예정이었던 이서연, 정도현, 오승우 학생의 상담이 아직 미완료 상태입니다.",
    time: "3시간 전",
    read: false,
  },
  {
    id: 4,
    type: "warning",
    category: "진로",
    title: "목표 미설정 학생 3명",
    body: "박지호, 오승우, 정도현 학생이 아직 목표 대학/학과를 설정하지 않았습니다.",
    time: "어제",
    read: true,
  },
  {
    id: 5,
    type: "info",
    category: "시스템",
    title: "2026 수시 원서 접수 안내",
    body: "2026학년도 수시 원서 접수 일정이 업데이트되었습니다. 학생들에게 안내해 주세요.",
    time: "2일 전",
    read: true,
  },
  {
    id: 6,
    type: "success",
    category: "학습",
    title: "김민준 학생 목표 달성",
    body: "김민준 학생이 이번 주 학습 목표 100%를 달성했습니다! 칭찬 메모를 남겨보세요.",
    time: "3일 전",
    read: true,
  },
];

function loadStudentAlerts(): AlertItem[] {
  try {
    const raw = localStorage.getItem(TEACHER_ALERT_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw) as any[];
    return items.map((item, idx) => ({
      id: 10000 + idx,
      type: item.type ?? "info",
      category: item.category ?? "진로",
      title: item.title ?? "학생 알림",
      body: item.body ?? "",
      time: item.time ?? "방금",
      read: item.read ?? false,
    }));
  } catch {
    return [];
  }
}

export function TeacherAlertCenter() {
  const [studentAlerts, setStudentAlerts] = useState<AlertItem[]>(loadStudentAlerts);
  const [staticAlerts, setStaticAlerts] = useState<AlertItem[]>(STATIC_ALERTS);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "important">("all");

  // 페이지 포커스 시 학생 발송 알림 재로드
  useEffect(() => {
    const refresh = () => setStudentAlerts(loadStudentAlerts());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  // 합산 알림 목록 (학생 발송이 먼저)
  const allAlerts = [...studentAlerts, ...staticAlerts];

  const markRead = (id: number) => {
    if (id >= 10000) {
      setStudentAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    } else {
      setStaticAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    }
  };
  const markAllRead = () => {
    setStudentAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    setStaticAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unread    = allAlerts.filter((a) => !a.read);
  const important = allAlerts.filter((a) => a.type === "danger" || a.type === "warning");
  const displayed =
    activeTab === "unread" ? unread : activeTab === "important" ? important : allAlerts;

  return (
    <div>
      <Breadcrumb items={[{ label: "알림" }, { label: "교사 알림 센터" }]} />
      <PageTitle
        title="교사 알림 센터"
        subtitle="학생 성적, 학습 이행, 상담 요청, 학생 발송 진로 목표 알림을 확인하세요."
        action={
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> 모두 읽음 표시
          </button>
        }
      />

      {/* 학생 발송 알림 배너 */}
      {studentAlerts.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-primary">
            <strong>학생 발송 알림 {studentAlerts.length}건</strong>이 새로 도착했습니다.
            학생이 진로 목표를 설정하거나 변경하면 이 목록에 추가됩니다.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-xl font-semibold text-foreground">{allAlerts.length}</p>
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
