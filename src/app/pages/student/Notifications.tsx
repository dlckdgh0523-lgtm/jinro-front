import { useState } from "react";
import { AlertCard, AlertItem } from "../../components/ui/AlertCard";

const ALERTS: AlertItem[] = [
  { id: "1", title: "수학 모의고사 결과 업데이트", description: "4월 3회 수학 모의고사 결과가 입력되었습니다. 2등급 달성!", category: "성적", type: "success", time: "1시간 전", isRead: false },
  { id: "2", title: "박지영 선생님 메모 도착", description: "수시 지원 전략에 대한 메모가 도착했습니다. 확인해주세요.", category: "상담", type: "info", time: "3시간 전", isRead: false },
  { id: "3", title: "이번 주 학습 이행률 주의", description: "이번 주 학습 이행률이 60%입니다. 목표 80% 달성을 위해 조금 더 노력해봐요!", category: "계획", type: "warning", time: "어제 오후 4시", isRead: false },
  { id: "4", title: "목표 대학 입시 요강 업데이트", description: "연세대학교 2026 수시 모집 요강이 업데이트되었습니다.", category: "알림", type: "info", time: "2일 전", isRead: true },
  { id: "5", title: "영어 성적 하락 감지", description: "최근 영어 성적이 전 시험 대비 0.5등급 하락했습니다. 확인이 필요합니다.", category: "성적", type: "danger", time: "3일 전", isRead: true },
  { id: "6", title: "AI 진로 탐색 완료", description: "AI 진로 탐색 3단계가 완료되었습니다. 추천 결과를 확인해보세요!", category: "알림", type: "success", time: "4일 전", isRead: true },
  { id: "7", title: "박지영 선생님 상담 요청 수락", description: "상담 요청이 수락되었습니다. 이번 주 금요일 방과 후에 진행됩니다.", category: "상담", type: "info", time: "5일 전", isRead: true },
];

export default function Notifications() {
  const [alerts, setAlerts] = useState<AlertItem[]>(ALERTS);
  const [tab, setTab] = useState<"all" | "unread" | "important">("all");

  const unread = alerts.filter((a) => !a.isRead);
  const important = alerts.filter((a) => a.type === "danger" || a.type === "warning");
  const displayed = tab === "all" ? alerts : tab === "unread" ? unread : important;

  const markRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: "var(--brand-text)", fontWeight: 700 }}>실시간 알림</h1>
          <p className="text-sm mt-1" style={{ color: "var(--brand-text-muted)" }}>
            미확인 알림 <strong style={{ color: "var(--brand-coral)" }}>{unread.length}</strong>건
          </p>
        </div>
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm px-4 py-2 rounded-xl transition-colors hover:bg-accent"
            style={{ color: "var(--brand-coral)", fontWeight: 600, border: "1px solid var(--border)" }}
          >
            모두 읽음 처리
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ background: "var(--muted)" }}>
        {[
          { key: "all", label: `전체 (${alerts.length})` },
          { key: "unread", label: `미확인 (${unread.length})` },
          { key: "important", label: `중요 (${important.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={{
              background: tab === t.key ? "var(--card)" : "transparent",
              color: tab === t.key ? "var(--brand-coral)" : "var(--brand-text-muted)",
              fontWeight: tab === t.key ? 600 : 400,
              boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {displayed.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onMarkRead={markRead} />
        ))}
      </div>

      {displayed.length === 0 && (
        <div className="py-12 text-center rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <p className="text-2xl mb-2">🔔</p>
          <p className="text-sm" style={{ color: "var(--brand-text-muted)" }}>알림이 없어요</p>
        </div>
      )}
    </div>
  );
}
