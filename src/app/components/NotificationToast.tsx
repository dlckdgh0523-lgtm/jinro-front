import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, X, Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { useNotification, NotificationItem } from "../context/NotificationContext";

// ── 타입별 스타일 설정 ────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationItem["type"],
  { border: string; bg: string; icon: React.ReactNode; badge: string; dot: string }
> = {
  danger: {
    border: "border-l-red-500",
    bg: "bg-white dark:bg-card",
    icon: <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />,
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    dot: "bg-red-500",
  },
  warning: {
    border: "border-l-amber-500",
    bg: "bg-white dark:bg-card",
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  info: {
    border: "border-l-blue-500",
    bg: "bg-white dark:bg-card",
    icon: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  success: {
    border: "border-l-emerald-500",
    bg: "bg-white dark:bg-card",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

// ── 카테고리 → 이동 경로 맵핑 ────────────────────────────────────────────────
const STUDENT_PATHS: Record<string, string> = {
  "성적": "/student/grades/trend",
  "학습": "/student/study/plan",
  "상담": "/student/counseling",
  "진로": "/student/career/goal",
  "입시": "/student/career/admissions",
};

const TEACHER_PATHS: Record<string, string> = {
  "학생": "/teacher/students/list",
  "상담": "/teacher/counseling/requests",
  "출결": "/teacher/students/list",
  "학습": "/teacher/students/completion",
  "입시": "/teacher/alerts",
};

// ── 개별 알림 카드 ────────────────────────────────────────────────────────────
function NotificationCard({ notification }: { notification: NotificationItem }) {
  const { dismiss, role } = useNotification();
  const navigate = useNavigate();
  const cfg = TYPE_CONFIG[notification.type];

  const paths = role === "teacher" ? TEACHER_PATHS : STUDENT_PATHS;
  const defaultPath = role === "teacher" ? "/teacher/alerts" : "/student/study/alerts";

  // 카드 클릭 → 해당 카테고리 페이지 이동 + 팝업 닫기
  const handleCardClick = () => {
    navigate(paths[notification.category] ?? defaultPath);
    dismiss(notification.id);
  };

  // 확인 버튼 → 팝업만 닫기 (페이지 이동 없음)
  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismiss(notification.id);
  };

  // X 버튼 → 팝업만 닫기
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismiss(notification.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.94, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      onClick={handleCardClick}
      className={`
        w-[min(320px,calc(100vw-2rem))]
        rounded-xl border border-border border-l-4 ${cfg.border} ${cfg.bg}
        shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        overflow-hidden select-none cursor-pointer
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]
        hover:scale-[1.02] transition-transform duration-150
      `}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {cfg.icon}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge} shrink-0`}>
            {notification.category}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            <span className="text-xs text-muted-foreground">실시간</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span className="text-xs text-muted-foreground">{notification.time}</span>
          <button
            onClick={handleClose}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="알림 닫기"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 내용 */}
      <div className="px-3.5 pb-2">
        <p className="text-sm text-foreground leading-snug">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
          {notification.body}
        </p>
      </div>

      {/* 안내 문구 + 확인 버튼 */}
      <div className="flex items-center justify-between px-3.5 pb-3 pt-0.5">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Bell className="w-3 h-3" />
          <span>클릭하면 해당 페이지로 이동</span>
        </div>
        <button
          onClick={handleConfirm}
          className="px-3.5 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-95 transition-all"
        >
          확인
        </button>
      </div>
    </motion.div>
  );
}

// ── 토스트 컨테이너 ───────────────────────────────────────────────────────────
export function NotificationToast() {
  const { popups } = useNotification();

  return (
    <div
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[200] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="실시간 알림 팝업"
    >
      <AnimatePresence mode="popLayout">
        {popups.map((notif) => (
          <div key={notif.id} className="pointer-events-auto">
            <NotificationCard notification={notif} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
