import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

const TASKS = [
  { id: "1", subject: "수학", task: "수열 단원 복습 p.120~135", priority: "높음" as const, done: true, day: "월" },
  { id: "2", subject: "국어", task: "독서 지문 3개 풀기", priority: "중간" as const, done: true, day: "월" },
  { id: "5", subject: "수학", task: "확률 단원 예제 풀기", priority: "중간" as const, done: true, day: "수" },
  { id: "9", subject: "화학Ⅰ", task: "기출 문제 풀기", priority: "높음" as const, done: true, day: "금" },
  { id: "3", subject: "영어", task: "EBS 어법 20문항", priority: "높음" as const, done: false, day: "화" },
  { id: "4", subject: "화학Ⅰ", task: "산화환원 개념 정리", priority: "높음" as const, done: false, day: "화" },
  { id: "6", subject: "생명과학Ⅰ", task: "세포 단원 정리", priority: "낮음" as const, done: false, day: "수" },
  { id: "7", subject: "국어", task: "문학 작품 분석", priority: "중간" as const, done: false, day: "목" },
  { id: "8", subject: "영어", task: "독해 지문 10개", priority: "높음" as const, done: false, day: "목" },
  { id: "10", subject: "수학", task: "통계 단원 복습", priority: "중간" as const, done: false, day: "토" },
];

const priorityStyle = {
  높음: { bg: "rgba(212,72,72,0.1)", text: "#D44848" },
  중간: { bg: "rgba(212,149,106,0.1)", text: "#D4956A" },
  낮음: { bg: "rgba(107,174,138,0.1)", text: "#6BAE8A" },
};

export default function StudyCheck() {
  const [tasks, setTasks] = useState(TASKS);
  const done = tasks.filter((t) => t.done);
  const notDone = tasks.filter((t) => !t.done);
  const pct = Math.round((done.length / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const subjectStats = Array.from(new Set(tasks.map((t) => t.subject))).map((s) => ({
    subject: s,
    total: tasks.filter((t) => t.subject === s).length,
    done: tasks.filter((t) => t.subject === s && t.done).length,
  }));

  return (
    <div>
      <h1 className="mb-1" style={{ color: "var(--brand-text)", fontWeight: 700 }}>학습 완료 체크</h1>
      <p className="text-sm mb-6" style={{ color: "var(--brand-text-muted)" }}>이번 주 학습 완료 현황을 확인하고 체크하세요</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "전체 과제", value: tasks.length, color: "var(--brand-text)" },
          { label: "완료", value: done.length, color: "#6BAE8A" },
          { label: "미완료", value: notDone.length, color: "#D4956A" },
          { label: "이행률", value: `${pct}%`, color: "var(--brand-coral)" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--brand-text-muted)" }}>{stat.label}</p>
            <p className="text-2xl" style={{ color: stat.color, fontWeight: 700 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex justify-between mb-2">
          <span className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>이번 주 전체 이행률</span>
          <span className="text-sm" style={{ color: "var(--brand-coral)", fontWeight: 700 }}>{pct}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-4" style={{ background: "var(--muted)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #C17B6E, #D4956A)" }}
          />
        </div>
        {/* Subject breakdown */}
        <div className="grid grid-cols-2 gap-2">
          {subjectStats.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--brand-text-muted)" }}>{s.subject}</span>
                <span className="text-xs" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>{s.done}/{s.total}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round(s.done / s.total * 100)}%`,
                    background: s.done === s.total ? "#6BAE8A" : "var(--brand-coral)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Completed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} style={{ color: "#6BAE8A" }} />
            <h3 className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>완료된 과제 ({done.length})</h3>
          </div>
          <div className="space-y-2">
            {done.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{ background: "rgba(107,174,138,0.06)", border: "1px solid rgba(107,174,138,0.15)", opacity: 0.8 }}
                onClick={() => toggleTask(task.id)}
              >
                <CheckCircle size={16} style={{ color: "#6BAE8A", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs" style={{ color: "#6BAE8A", fontWeight: 600 }}>{task.subject}</span>
                  <p className="text-sm" style={{ color: "var(--brand-text-muted)", textDecoration: "line-through" }}>{task.task}</p>
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: priorityStyle[task.priority].bg, color: priorityStyle[task.priority].text, fontWeight: 600 }}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Not completed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Circle size={16} style={{ color: "#D4956A" }} />
            <h3 className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>미완료 과제 ({notDone.length})</h3>
          </div>
          <div className="space-y-2">
            {notDone.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-accent"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                onClick={() => toggleTask(task.id)}
              >
                <Circle size={16} style={{ color: "var(--brand-text-light)", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}>{task.subject}</span>
                  <p className="text-sm mt-0.5" style={{ color: "var(--brand-text)" }}>{task.task}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-light)" }}>{task.day}요일</p>
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: priorityStyle[task.priority].bg, color: priorityStyle[task.priority].text, fontWeight: 600 }}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
