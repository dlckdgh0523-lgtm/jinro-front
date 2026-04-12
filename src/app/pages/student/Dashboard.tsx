import React from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle, StatCard } from "../../components/AppShell";
import { AlertCard } from "../../components/AlertCard";
import { ALERTS, WEEKLY_PLAN } from "../../data/mock";
import {
  Target, Brain, BookOpen, TrendingUp, MessageSquare,
  CheckSquare, Bell, ArrowRight, BarChart2, GraduationCap,
  CheckCircle, Clock
} from "lucide-react";

export function StudentDashboard() {
  const navigate = useNavigate();
  const todayTasks = WEEKLY_PLAN.slice(0, 4);
  const recentAlerts = ALERTS.slice(0, 3);

  return (
    <div>
      <Breadcrumb items={[{ label: "대시보드" }, { label: "학생 홈" }]} />
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-foreground">안녕하세요, 김민준 학생 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">오늘도 천천히 해봐요. 목표를 향해 한 걸음씩!</p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border border-border">
          2026년 4월 11일 토요일
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="평균 내신 등급" value="1.8등급" sub="전월 대비 0.2 향상" icon={<TrendingUp className="w-4 h-4" />} color="success" />
        <StatCard label="이번 주 완료" value="5 / 7" sub="71% 달성" icon={<CheckSquare className="w-4 h-4" />} color="info" />
        <StatCard label="목표 달성도" value="75%" sub="서울대 컴퓨터공학부" icon={<Target className="w-4 h-4" />} color="default" />
        <StatCard label="미확인 알림" value="3건" sub="중요 알림 1건" icon={<Bell className="w-4 h-4" />} color="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Today's tasks */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">오늘 해야 할 일</h3>
            <button onClick={() => navigate("/student/study/plan")} className="text-xs text-primary hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  task.done ? "border-primary bg-primary" : "border-muted-foreground/30"
                }`}>
                  {task.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.subject} · {task.day}요일</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  task.priority === "high" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" :
                  task.priority === "medium" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-slate-100 text-slate-500 dark:bg-slate-700/30 dark:text-slate-400"
                }`}>
                  {task.priority === "high" ? "높음" : task.priority === "medium" ? "중간" : "낮음"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>완료 2/4 · 진행률 50%</span>
            </div>
            <button onClick={() => navigate("/student/study/check")} className="text-xs text-primary hover:underline">
              학습 완료 체크 →
            </button>
          </div>
        </div>

        {/* Goal summary */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">목표 진행도</h3>
              <button onClick={() => navigate("/student/career/goal")} className="text-xs text-primary hover:underline">편집</button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">서울대학교</p>
                <p className="text-xs text-muted-foreground">컴퓨터공학부</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "내신 목표", current: "1.8등급", target: "1.5등급", pct: 70 },
                { label: "수능 목표", current: "280점", target: "310점", pct: 55 },
              ].map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{g.label}</span>
                    <span>{g.current} / {g.target}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${g.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">추천 바로가기</h3>
            <div className="space-y-2">
              {[
                { icon: <Brain className="w-4 h-4 text-primary" />, label: "AI 진로 탐색", path: "/student/career/ai" },
                { icon: <BookOpen className="w-4 h-4 text-primary" />, label: "성적 입력", path: "/student/grades/input" },
                { icon: <BarChart2 className="w-4 h-4 text-primary" />, label: "성장 리포트", path: "/student/grades/report" },
                { icon: <MessageSquare className="w-4 h-4 text-primary" />, label: "상담 페이지", path: "/student/counseling" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-secondary/60 transition-colors text-left"
                >
                  {item.icon}
                  <span className="text-sm text-foreground">{item.label}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        {/* Recent alerts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">최근 알림</h3>
            <button onClick={() => navigate("/student/study/alerts")} className="text-xs text-primary hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {recentAlerts.map((alert) => (
              <button
                key={alert.id}
                className="w-full text-left rounded-xl transition-all hover:ring-2 hover:ring-primary/30 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary/40"
                onClick={() => {
                  const paths: Record<string, string> = {
                    "성적": "/student/grades/trend",
                    "학습": "/student/study/plan",
                    "상담": "/student/counseling",
                    "진로": "/student/career/goal",
                    "입시": "/student/career/admissions",
                  };
                  navigate(paths[alert.category] ?? "/student/study/alerts");
                }}
              >
                <AlertCard alert={alert} />
              </button>
            ))}
          </div>
        </div>

        {/* Growth report summary */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">성장 리포트 요약</h3>
            <button onClick={() => navigate("/student/grades/report")} className="text-xs text-primary hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "강점 과목", value: "수학", sub: "1.8등급 → 1.3등급" },
              { label: "보완 과목", value: "영어", sub: "2.5등급 유지 중" },
              { label: "학습 완료율", value: "71%", sub: "지난주 대비 +9%" },
              { label: "AI 추천 완료", value: "3/5", sub: "진로 탐색 60%" },
            ].map((s) => (
              <div key={s.label} className="bg-secondary/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                <p className="text-sm font-semibold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/student/counseling")}
            className="w-full h-10 rounded-xl border border-primary/30 text-primary text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            선생님께 상담 요청하기
          </button>
        </div>
      </div>
    </div>
  );
}