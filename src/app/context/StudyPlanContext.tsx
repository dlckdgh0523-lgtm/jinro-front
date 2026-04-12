import React, { createContext, useContext, useState, useCallback } from "react";
import { WEEKLY_PLAN } from "../data/mock";

// ── 타입 ─────────────────────────────────────────────────────────────────────
export interface StudyTask {
  id: number;
  subject: string;
  task: string;
  day: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

interface StudyPlanContextType {
  tasks: StudyTask[];
  toggleTask: (id: number) => void;
  addTask: (task: Omit<StudyTask, "id" | "done">) => void;
  removeTask: (id: number) => void;
}

const StudyPlanContext = createContext<StudyPlanContextType>({
  tasks: [],
  toggleTask: () => {},
  addTask: () => {},
  removeTask: () => {},
});

// ── localStorage 유틸 ─────────────────────────────────────────────────────────
const STORAGE_KEY = "jinro_study_tasks";

function loadTasks(): StudyTask[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as StudyTask[];
  } catch {}
  // 첫 방문 시 mock 데이터를 초기값으로 사용
  return WEEKLY_PLAN.map((t) => ({
    ...t,
    priority: t.priority as "high" | "medium" | "low",
  }));
}

function persist(tasks: StudyTask[]): StudyTask[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return tasks;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function StudyPlanProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<StudyTask[]>(loadTasks);

  const toggleTask = useCallback((id: number) => {
    setTasks((prev) => persist(prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))));
  }, []);

  const addTask = useCallback((task: Omit<StudyTask, "id" | "done">) => {
    setTasks((prev) => persist([...prev, { ...task, id: Date.now(), done: false }]));
  }, []);

  const removeTask = useCallback((id: number) => {
    setTasks((prev) => persist(prev.filter((t) => t.id !== id)));
  }, []);

  return (
    <StudyPlanContext.Provider value={{ tasks, toggleTask, addTask, removeTask }}>
      {children}
    </StudyPlanContext.Provider>
  );
}

export function useStudyPlan() {
  return useContext(StudyPlanContext);
}
