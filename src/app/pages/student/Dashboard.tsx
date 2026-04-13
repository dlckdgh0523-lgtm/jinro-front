import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, StatCard } from "../../components/AppShell";
import { AlertCard, type AlertItem } from "../../components/AlertCard";
import {
  Target,
  Brain,
  BookOpen,
  TrendingUp,
  MessageSquare,
  CheckSquare,
  Bell,
  ArrowRight,
  BarChart2,
  GraduationCap,
  CheckCircle,
  Clock
} from "lucide-react";
import { appGet } from "../../utils/appApi";

type StudentDashboardResponse = {
  greetingName: string;
  todayLabel: string;
  stats: {
    averageGrade: number;
    weeklyCompletion: number;
    goalProgress: number;
    unreadAlerts: number;
  };
  todayTasks: Array<{
    id: string;
    subject: string;
    task: string;
    day: string;
    priority: "high" | "medium" | "low";
    done: boolean;
  }>;
  recentAlerts: AlertItem[];
  goalSummary: {
    university: string;
    department: string;
    targetGrade: number | null;
    targetScore: number | null;
  } | null;
};

export function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<StudentDashboardResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await appGet<StudentDashboardResponse>("/v1/student/dashboard");

        if (active) {
          setDashboard(response);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "대시보드를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchDashboard();

    return () => {
      active = false;
    };
  }, []);

  const todayTasks = dashboard?.todayTasks ?? [];
  const recentAlerts = dashboard?.recentAlerts ?? [];
  const completedTaskCount = todayTasks.filter((task) => task.done).length;

  return (
    <div>
      <Breadcrumb items={[{ label: "대시보드" }, { label: "학생 홈" }]} />
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-foreground">
            안녕하세요, {dashboard?.greetingName ?? "학생"} 님
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            오늘도 천천히, 하지만 목표를 향해 한 걸음씩 나아가 보아요.
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border border-border">
          {dashboard?.todayLabel ?? "로딩 중"}
        </span>
      </div>

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="평균 내신 등급"
          value={dashboard ? `${dashboard.stats.averageGrade.toFixed(1)}등급` : "-"}
          sub="백엔드 집계 기준"
          icon={<TrendingUp className="w-4 h-4" />}
          color="success"
        />
        <StatCard
          label="이번 주 완료"
          value={dashboard ? `${dashboard.stats.weeklyCompletion}%` : "-"}
          sub={`${completedTaskCount} / ${todayTasks.length || 0} 과제`}
          icon={<CheckSquare className="w-4 h-4" />}
          color="info"
        />
        <StatCard
          label="목표 달성도"
          value={dashboard ? `${dashboard.stats.goalProgress}%` : "-"}
          sub={dashboard?.goalSummary ? `${dashboard.goalSummary.university} ${dashboard.goalSummary.department}` : "저장된 목표 없음"}
          icon={<Target className="w-4 h-4" />}
          color="default"
        />
        <StatCard
          label="미확인 알림"
          value={dashboard ? `${dashboard.stats.unreadAlerts}건` : "-"}
          sub="실시간 알림 기준"
          icon={<Bell className="w-4 h-4" />}
          color="warning"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">오늘 해야 할 일</h3>
            <button
              onClick={() => navigate("/student/study/plan")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              전체 보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">오늘 할 일을 불러오고 있습니다.</p>
            ) : todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">등록된 학습 계획이 없습니다.</p>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.done ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}
                  >
                    {task.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.task}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.subject} · {task.day}요일
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.priority === "high"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                        : task.priority === "medium"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700/30 dark:text-slate-400"
                    }`}
                  >
                    {task.priority === "high" ? "높음" : task.priority === "medium" ? "중간" : "낮음"}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>
                완료 {completedTaskCount}/{todayTasks.length} · 진행률 {dashboard?.stats.weeklyCompletion ?? 0}%
              </span>
            </div>
            <button
              onClick={() => navigate("/student/study/check")}
              className="text-xs text-primary hover:underline"
            >
              학습 완료 체크 →
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">목표 진행도</h3>
              <button
                onClick={() => navigate("/student/career/goal")}
                className="text-xs text-primary hover:underline"
              >
                수정
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dashboard?.goalSummary?.university ?? "목표 대학 미설정"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dashboard?.goalSummary?.department ?? "목표 학과를 설정해 주세요"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>목표 내신</span>
                  <span>{dashboard?.goalSummary?.targetGrade ?? "-"}등급</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${dashboard?.stats.goalProgress ?? 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>목표 수능</span>
                  <span>{dashboard?.goalSummary?.targetScore ?? "-"}점</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${dashboard?.stats.goalProgress ?? 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">추천 바로가기</h3>
            <div className="space-y-2">
              {[
                { icon: <Brain className="w-4 h-4 text-primary" />, label: "AI 진로 탐색", path: "/student/career/ai" },
                { icon: <BookOpen className="w-4 h-4 text-primary" />, label: "성적 입력", path: "/student/grades/input" },
                { icon: <BarChart2 className="w-4 h-4 text-primary" />, label: "성장 리포트", path: "/student/grades/report" },
                { icon: <MessageSquare className="w-4 h-4 text-primary" />, label: "상담 페이지", path: "/student/counseling" }
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

      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">최근 알림</h3>
            <button
              onClick={() => navigate("/student/study/alerts")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              전체 보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">알림을 불러오고 있습니다.</p>
            ) : recentAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">최근 알림이 없습니다.</p>
            ) : (
              recentAlerts.map((alert) => (
                <button
                  key={alert.id}
                  className="w-full text-left rounded-xl transition-all hover:ring-2 hover:ring-primary/30 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary/40"
                  onClick={() => navigate("/student/study/alerts")}
                >
                  <AlertCard alert={alert} />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">성장 리포트 요약</h3>
            <button
              onClick={() => navigate("/student/grades/report")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              전체 보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {
                label: "평균 내신",
                value: dashboard ? `${dashboard.stats.averageGrade.toFixed(1)}등급` : "-",
                sub: "백엔드 집계 기준"
              },
              {
                label: "주간 완료율",
                value: dashboard ? `${dashboard.stats.weeklyCompletion}%` : "-",
                sub: "현재 계획 기준"
              },
              {
                label: "미확인 알림",
                value: dashboard ? `${dashboard.stats.unreadAlerts}건` : "-",
                sub: "실시간 알림 연결"
              },
              {
                label: "목표 진행도",
                value: dashboard ? `${dashboard.stats.goalProgress}%` : "-",
                sub: dashboard?.goalSummary ? "저장된 목표 기준" : "목표 설정 필요"
              }
            ].map((summary) => (
              <div key={summary.label} className="bg-secondary/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-0.5">{summary.label}</p>
                <p className="text-sm font-semibold text-foreground">{summary.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{summary.sub}</p>
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
