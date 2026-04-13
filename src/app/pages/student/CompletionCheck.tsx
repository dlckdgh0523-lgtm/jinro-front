import React from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { PriorityBadge } from "../../components/StatusBadge";
import { useStudyPlan } from "../../context/StudyPlanContext";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

// 과목별 달성 통계 계산
function subjectStats(tasks: ReturnType<typeof useStudyPlan>["tasks"]) {
  const subjects = Array.from(new Set(tasks.map((t) => t.subject)));
  return subjects.map((s) => ({
    subject: s,
    total: tasks.filter((t) => t.subject === s).length,
    done: tasks.filter((t) => t.subject === s && t.done).length,
  }));
}

export function CompletionCheck() {
  const navigate = useNavigate();
  const { tasks, toggleTask, isLoading, error } = useStudyPlan();

  const completed = tasks.filter((t) => t.done);
  const incomplete = tasks.filter((t) => !t.done);
  const pct = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
  const stats = subjectStats(tasks);

  return (
    <div>
      <Breadcrumb items={[{ label: "학습 실행" }, { label: "학습 완료 체크" }]} />
      <PageTitle
        title="학습 완료 체크"
        subtitle="완료한 학습을 체크하고 이번 주 달성률을 확인하세요. 주간 학습 계획과 실시간으로 연동됩니다."
        action={
          <button
            onClick={() => navigate("/student/study/plan")}
            className="flex items-center gap-1.5 px-4 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            계획 편집 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-semibold text-primary">{pct}%</p>
          <p className="text-xs text-muted-foreground mt-1">전체 달성률</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-700 p-4 text-center">
          <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{completed.length}</p>
          <p className="text-xs text-muted-foreground mt-1">완료된 과제</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-700 p-4 text-center">
          <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{incomplete.length}</p>
          <p className="text-xs text-muted-foreground mt-1">미완료 과제</p>
        </div>
      </div>

      {/* Progress bar + subject breakdown */}
      <div className="bg-card rounded-xl border border-border p-5 mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-foreground font-medium">이번 주 진행률</span>
          <span className="text-muted-foreground">{completed.length} / {tasks.length}</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden mb-4">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {pct >= 80 ? "🌟 훌륭해요! 목표를 향해 정말 잘 달려가고 있어요." :
           pct >= 50 ? "👍 절반 이상 완료했어요. 남은 과제도 화이팅!" :
           "💪 아직 시간이 있어요. 하나씩 차근차근 해봐요."}
        </p>
        {/* Subject breakdown */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{s.subject}</span>
                  <span className="text-xs text-primary font-medium">{s.done}/{s.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${s.total > 0 ? Math.round((s.done / s.total) * 100) : 0}%`,
                      background: s.done === s.total && s.total > 0 ? "#6BAE8A" : "var(--primary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-sm text-muted-foreground">
          학습 완료 현황을 불러오고 있습니다.
        </div>
      ) : (
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Incomplete */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-amber-50/50 dark:bg-amber-900/5 flex items-center justify-between">
            <h3 className="text-foreground">미완료 과제</h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{incomplete.length}개</span>
          </div>
          <div className="divide-y divide-border">
            {incomplete.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                🎉 모든 과제를 완료했어요!
              </div>
            ) : (
              incomplete.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.subject} · {task.day}요일</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-emerald-50/50 dark:bg-emerald-900/5 flex items-center justify-between">
            <h3 className="text-foreground">완료된 과제</h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{completed.length}개</span>
          </div>
          <div className="divide-y divide-border">
            {completed.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                아직 완료된 과제가 없어요.
              </div>
            ) : (
              completed.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground line-through">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.subject} · {task.day}요일</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
