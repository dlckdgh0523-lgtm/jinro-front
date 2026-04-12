import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { PriorityBadge } from "../../components/StatusBadge";
import { useStudyPlan } from "../../context/StudyPlanContext";
import { Plus, CheckCircle, Circle } from "lucide-react";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export function WeeklyPlan() {
  const { tasks, toggleTask, addTask, removeTask } = useStudyPlan();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    subject: "",
    task: "",
    day: "월",
    priority: "medium" as "high" | "medium" | "low",
  });

  const handleAdd = () => {
    if (!newTask.subject || !newTask.task) return;
    addTask(newTask);
    setNewTask({ subject: "", task: "", day: "월", priority: "medium" });
    setShowAddModal(false);
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      <Breadcrumb items={[{ label: "학습 실행" }, { label: "주간 학습 계획" }]} />
      <PageTitle
        title="주간 학습 계획"
        subtitle="이번 주 해야 할 일을 과목별로 관리하세요. 추가한 항목은 학습 완료 체크에도 반영됩니다."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 학습 계획 추가
          </button>
        }
      />

      {/* Progress */}
      <div className="bg-card rounded-xl border border-border p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-foreground">이번 주 목표 달성</p>
            <p className="text-xs text-muted-foreground mt-0.5">{completedCount}개 완료 / 전체 {totalCount}개</p>
          </div>
          <span className="text-2xl font-semibold text-primary">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        {pct >= 70 ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">🎉 잘 하고 있어요! 이 페이스로 계속 나아가세요.</p>
        ) : (
          <p className="text-xs text-muted-foreground mt-2">💪 오늘도 천천히 해봐요. 작은 진전도 큰 의미가 있어요.</p>
        )}
      </div>

      {/* Weekly summary */}
      <div className="grid grid-cols-7 gap-2 mb-5">
        {DAYS.map((day) => {
          const dayTasks = tasks.filter((t) => t.day === day);
          const dayDone = dayTasks.filter((t) => t.done).length;
          return (
            <div
              key={day}
              className={`rounded-xl border p-2.5 text-center ${
                dayDone === dayTasks.length && dayTasks.length > 0
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-700"
                  : "border-border bg-card"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">{day}</p>
              <p className="text-sm font-medium text-foreground">{dayDone}/{dayTasks.length}</p>
            </div>
          );
        })}
      </div>

      {/* Task list by day */}
      <div className="space-y-4">
        {DAYS.map((day) => {
          const dayTasks = tasks.filter((t) => t.day === day);
          if (dayTasks.length === 0) return null;
          return (
            <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{day}요일</span>
                <span className="text-xs text-muted-foreground">
                  {dayTasks.filter((t) => t.done).length}/{dayTasks.length} 완료
                </span>
              </div>
              <div className="divide-y divide-border">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors cursor-pointer group"
                    onClick={() => toggleTask(task.id)}
                  >
                    <button className="flex-shrink-0">
                      {task.done
                        ? <CheckCircle className="w-5 h-5 text-primary" />
                        : <Circle className="w-5 h-5 text-muted-foreground/40" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-muted-foreground">{task.subject}</p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
                      className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive px-1.5 py-0.5 rounded transition-all"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">아직 학습 계획이 없어요. 추가해보세요!</p>
        </div>
      )}

      {/* Add task modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl">
            <h3 className="text-foreground mb-4">학습 계획 추가</h3>
            <p className="text-xs text-muted-foreground mb-4 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
              📌 추가한 항목은 <strong>학습 완료 체크</strong> 페이지에도 즉시 반영됩니다.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">과목</label>
                <input
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  placeholder="과목명"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">할 일</label>
                <input
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  placeholder="학습 내용을 입력하세요"
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">요일</label>
                  <select
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none"
                    value={newTask.day}
                    onChange={(e) => setNewTask({ ...newTask, day: e.target.value })}
                  >
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">우선순위</label>
                  <select
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "high" | "medium" | "low" })}
                  >
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
