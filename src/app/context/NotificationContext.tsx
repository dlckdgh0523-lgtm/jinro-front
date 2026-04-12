import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export interface NotificationItem {
  id: string;
  type: "danger" | "warning" | "info" | "success";
  category: string;
  title: string;
  body: string;
  time: string;
}

interface NotificationContextType {
  popups: NotificationItem[];
  dismiss: (id: string) => void;
  role: "student" | "teacher";
}

const NotificationContext = createContext<NotificationContextType>({
  popups: [],
  dismiss: () => {},
  role: "student",
});

// ── 학생용 알림 풀 (순서대로 1회만 발송) ─────────────────────────────────────
const STUDENT_NOTIFICATIONS: Omit<NotificationItem, "id">[] = [
  {
    type: "danger",
    category: "성적",
    title: "수학 성적 하락 경고",
    body: "최근 수학 모의고사 성적이 3등급 이하로 하락했습니다. 집중적인 학습이 필요합니다.",
    time: "방금",
  },
  {
    type: "warning",
    category: "학습",
    title: "주간 학습 목표 미달성",
    body: "이번 주 목표 완료율이 42%입니다. 남은 과제를 확인해보세요.",
    time: "방금",
  },
  {
    type: "info",
    category: "상담",
    title: "선생님 메모가 도착했습니다",
    body: "박지영 선생님이 새 상담 메모를 남겼습니다. 확인해보세요.",
    time: "방금",
  },
  {
    type: "success",
    category: "진로",
    title: "AI 진로탐색 결과 준비됨",
    body: "나만을 위한 AI 분석 결과가 준비되었습니다. 지금 확인해보세요!",
    time: "방금",
  },
  {
    type: "info",
    category: "입시",
    title: "2026 수시 일정 업데이트",
    body: "서울대학교 수시 지원 일정이 업데이트되었습니다.",
    time: "방금",
  },
  {
    type: "success",
    category: "학습",
    title: "주간 목표 달성!",
    body: "이번 주 학습 목표 80%를 달성했습니다. 훌륭한 성과예요!",
    time: "방금",
  },
];

// ── 교사용 알림 풀 (순서대로 1회만 발송) ─────────────────────────────────────
const TEACHER_NOTIFICATIONS: Omit<NotificationItem, "id">[] = [
  {
    type: "warning",
    category: "학생",
    title: "성적 급락 학생 발생",
    body: "김민준 학생의 수학 성적이 2등급에서 4등급으로 급락했습니다.",
    time: "방금",
  },
  {
    type: "info",
    category: "상담",
    title: "새 상담 요청이 도착했습니다",
    body: "이서연 학생이 진로 상담을 요청했습니다.",
    time: "방금",
  },
  {
    type: "danger",
    category: "출결",
    title: "연속 결석 학생 주의",
    body: "박준혁 학생이 3일 연속 결석 중입니다. 확인이 필요합니다.",
    time: "방금",
  },
  {
    type: "success",
    category: "학습",
    title: "학급 전체 목표 달성!",
    body: "1반 전체 학생이 이번 주 학습 목표를 달성했습니다.",
    time: "방금",
  },
  {
    type: "info",
    category: "입시",
    title: "2026 수시 입시 데이터 업데이트",
    body: "주요 대학 수시 경쟁률 데이터가 업데이트되었습니다.",
    time: "방금",
  },
];

interface NotificationProviderProps {
  children: React.ReactNode;
  role?: "student" | "teacher";
}

export function NotificationProvider({ children, role = "student" }: NotificationProviderProps) {
  // localStorage 키 (역할별 분리)
  const pendingKey = `jinro_pending_${role}`;
  const shownKey  = `jinro_shown_${role}`;

  // 초기 상태: localStorage에서 미확인 팝업 복원
  const [popups, setPopups] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(pendingKey);
      return saved ? (JSON.parse(saved) as NotificationItem[]) : [];
    } catch {
      return [];
    }
  });

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── 확인 버튼: 팝업 제거 + localStorage 갱신 ─────────────────────────────
  const dismiss = useCallback(
    (id: string) => {
      setPopups((prev) => {
        const next = prev.filter((p) => p.id !== id);
        localStorage.setItem(pendingKey, JSON.stringify(next));
        return next;
      });
    },
    [pendingKey]
  );

  // ── 새 알림 추가 + localStorage 저장 ─────────────────────────────────────
  const addNotification = useCallback(
    (n: Omit<NotificationItem, "id">) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const item: NotificationItem = { ...n, id };
      setPopups((prev) => {
        const next = [...prev, item];
        localStorage.setItem(pendingKey, JSON.stringify(next));
        return next;
      });
    },
    [pendingKey]
  );

  // ── 미표시 알림만 1회씩 순서대로 발송 (반복 없음) ────────────────────────
  useEffect(() => {
    const pool = role === "teacher" ? TEACHER_NOTIFICATIONS : STUDENT_NOTIFICATIONS;
    const shownIdx = parseInt(localStorage.getItem(shownKey) ?? "0", 10);

    if (shownIdx >= pool.length) return; // 모든 알림 이미 발송 완료

    const remaining = pool.slice(shownIdx);

    remaining.forEach((notif, i) => {
      const timer = setTimeout(
        () => {
          addNotification(notif);
          localStorage.setItem(shownKey, String(shownIdx + i + 1));
        },
        2500 + i * 13000 // 2.5s → 15.5s → 28.5s … (반복 없음)
      );
      timersRef.current.push(timer);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [addNotification, role, shownKey]);

  return (
    <NotificationContext.Provider value={{ popups, dismiss, role }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
