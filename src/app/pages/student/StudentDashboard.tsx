import { useNavigate } from "react-router";
import {
  TrendingUp, Target, CalendarDays, Bell, MessageCircle,
  FileText, ChevronRight, CheckCircle, AlertTriangle, Star
} from "lucide-react";
import { StatusBadge } from "../../components/ui/StatusBadge";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const todayTasks = [
    { id: 1, subject: "수학", task: "수열 단원 복습", done: true },
    { id: 2, subject: "영어", task: "EBS 어법 20문항", done: false },
    { id: 3, subject: "국어", task: "독서 지문 3개", done: false },
  ];

  const recentAlerts = [
    { id: "1", text: "국어 모의고사 성적이 업데이트되었어요", type: "success" as const, time: "1시간 전" },
    { id: "2", text: "박지영 선생님이 메모를 남겼어요", type: "info" as const, time: "3시간 전" },
    { id: "3", text: "이번 주 학습 이행률이 60%입니다", type: "warning" as const, time: "어제" },
  ];

  const typeColor: Record<string, string> = {
    success: "#6BAE8A",
    info: "#8B9ED4",
    warning: "#D4956A",
  };

  return (
    <div>
      {/* Welcome */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ color: "var(--brand-text)", fontWeight: 700 }}>
            안녕하세요, 김민준님 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--brand-text-muted)" }}>
            오늘도 천천히 해봐요. 목표를 향한 작은 한 걸음이 쌓여요.
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-xl text-xs"
          style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
        >
          2026.04.11 (토)
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "현재 평균 등급", value: "1.8", unit: "등급", icon: <Star size={16} />, color: "var(--brand-coral)" },
          { label: "목표 달성률", value: "68", unit: "%", icon: <Target size={16} />, color: "#6BAE8A" },
          { label: "이번 주 완료", value: "4/7", unit: "과제", icon: <CheckCircle size={16} />, color: "#8B9ED4" },
          { label: "미확인 알림", value: "3", unit: "건", icon: <Bell size={16} />, color: "#D4956A" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className="text-xs" style={{ color: "var(--brand-text-muted)" }}>{stat.label}</span>
            </div>
            <p className="text-2xl" style={{ color: stat.color, fontWeight: 700 }}>
              {stat.value}
              <span className="text-sm ml-1" style={{ fontWeight: 400, color: "var(--brand-text-muted)" }}>
                {stat.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 오늘 해야 할 일 */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              📋 오늘 해야 할 일
            </h3>
            <button
              onClick={() => navigate("/student/weekly-plan")}
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--brand-coral)" }}
            >
              전체보기 <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: task.done ? "var(--brand-success)" : "var(--muted)",
                    border: `1.5px solid ${task.done ? "var(--brand-success)" : "var(--border)"}`,
                  }}
                >
                  {task.done && <span className="text-white text-[9px]">✓</span>}
                </div>
                <div>
                  <span className="text-xs" style={{ color: "var(--brand-text-muted)", fontWeight: 600 }}>{task.subject}</span>
                  <p className="text-sm" style={{ color: task.done ? "var(--brand-text-muted)" : "var(--brand-text)", textDecoration: task.done ? "line-through" : "none" }}>
                    {task.task}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs" style={{ color: "var(--brand-text-muted)" }}>오늘 진행률</span>
              <span className="text-xs" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>33%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
              <div className="h-full rounded-full" style={{ width: "33%", background: "var(--brand-coral)" }} />
            </div>
          </div>
        </div>

        {/* 최근 성적 */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              📊 최근 성적 요약
            </h3>
            <button
              onClick={() => navigate("/student/grades")}
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--brand-coral)" }}
            >
              성적 입력 <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { subject: "국어", grade: "1등급", score: 95, trend: "→" },
              { subject: "수학", grade: "2등급", score: 88, trend: "↑" },
              { subject: "영어", grade: "1등급", score: 96, trend: "→" },
              { subject: "화학Ⅰ", grade: "2등급", score: 85, trend: "↑" },
            ].map((item) => (
              <div key={item.subject} className="flex items-center gap-3">
                <span className="text-sm w-16" style={{ color: "var(--brand-text)" }}>{item.subject}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                  <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: "var(--brand-coral)" }} />
                </div>
                <span
                  className="text-xs w-12 text-right"
                  style={{ color: "var(--brand-coral)", fontWeight: 600 }}
                >
                  {item.grade}
                </span>
                <span className="text-xs" style={{ color: item.trend === "↑" ? "#6BAE8A" : "var(--brand-text-muted)" }}>
                  {item.trend}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/student/grade-trend")}
            className="mt-3 text-xs flex items-center gap-1"
            style={{ color: "var(--brand-text-muted)" }}
          >
            <TrendingUp size={11} /> 추이 보기
          </button>
        </div>

        {/* 목표 진행도 */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              🎯 목표 진행도
            </h3>
            <button
              onClick={() => navigate("/student/goal")}
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--brand-coral)" }}
            >
              목표 보기 <ChevronRight size={12} />
            </button>
          </div>
          <div
            className="p-3 rounded-xl mb-3"
            style={{ background: "var(--brand-peach)" }}
          >
            <p className="text-sm" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>연세대학교</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-muted)" }}>컴퓨터공학과 · 학생부종합</p>
          </div>
          <div className="space-y-3">
            {[
              { label: "내신 등급 목표", current: "1.8", target: "1.5", pct: 75 },
              { label: "학습 이행률", current: "68%", target: "80%", pct: 68 },
              { label: "모의고사 목표", current: "2등급", target: "1등급", pct: 55 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{ color: "var(--brand-text-muted)" }}>{item.label}</span>
                  <span className="text-xs" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>{item.current} / {item.target}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: "var(--brand-coral)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 바로가기 */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h3 className="text-sm mb-4" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
            ✨ 추천 바로가기
          </h3>
          <div className="space-y-2">
            {[
              { label: "AI 진로 탐색 계속하기", path: "/student/ai-career", icon: "🧠", desc: "대화 이어가기" },
              { label: "대학·학과 추천 보기", path: "/student/university", icon: "🏫", desc: "나에게 맞는 추천" },
              { label: "최근 입시 데이터", path: "/student/admissions", icon: "📰", desc: "2026 최신 등급컷" },
              { label: "성장 리포트 확인", path: "/student/growth-report", icon: "📈", desc: "나의 성장 기록" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-accent text-left"
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>{item.label}</p>
                  <p className="text-xs" style={{ color: "var(--brand-text-muted)" }}>{item.desc}</p>
                </div>
                <ChevronRight size={14} className="ml-auto" style={{ color: "var(--brand-text-light)" }} />
              </button>
            ))}
          </div>
        </div>

        {/* 최근 알림 */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              🔔 최근 알림
            </h3>
            <button
              onClick={() => navigate("/student/notifications")}
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--brand-coral)" }}
            >
              전체보기 <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex gap-3 items-start p-3 rounded-xl"
                style={{ background: "var(--background)" }}
              >
                <AlertTriangle size={14} style={{ color: typeColor[alert.type], marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p className="text-sm" style={{ color: "var(--brand-text)" }}>{alert.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-light)" }}>{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 상담 진입 */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, #F5D5CC 0%, #FEE9E4 100%)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <h3 className="text-sm mb-2" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              💬 선생님께 상담 요청
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--brand-text-muted)", lineHeight: 1.6 }}>
              박지영 선생님에게 궁금한 점이나 도움이 필요한 내용을 전달하세요.
            </p>
            <div
              className="p-3 rounded-xl mb-4"
              style={{ background: "var(--card)" }}
            >
              <p className="text-xs" style={{ color: "var(--brand-text-muted)" }}>마지막 상담</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                수시 준비 방향 상담 · 3일 전
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/student/counseling")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-coral)", fontWeight: 600, fontSize: "0.9rem" }}
          >
            <MessageCircle size={16} />
            상담 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
