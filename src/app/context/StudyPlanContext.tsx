import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { appDelete, appGet, appPatch, appPost } from "../utils/appApi";

export interface StudyTask {
  id: string;
  subject: string;
  task: string;
  day: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

type StudyPlanResponse = {
  planId: string;
  weekStartDate: string;
  weekEndDate: string;
  tasks: StudyTask[];
  completion: {
    percentage: number;
    completedCount: number;
    totalCount: number;
  };
};

interface StudyPlanContextType {
  tasks: StudyTask[];
  toggleTask: (id: string) => Promise<void>;
  addTask: (task: Omit<StudyTask, "id" | "done">) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string;
}

const StudyPlanContext = createContext<StudyPlanContextType>({
  tasks: [],
  toggleTask: async () => {},
  addTask: async () => {},
  removeTask: async () => {},
  isLoading: false,
  error: ""
});

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "학습 계획을 불러오지 못했습니다.";

export function StudyPlanProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshPlan = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const plan = await appGet<StudyPlanResponse>("/v1/study-plans/current");
      setTasks(plan.tasks);
    } catch (requestError) {
      setTasks([]);
      setError(normalizeError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPlan();
  }, [refreshPlan]);

  const toggleTask = useCallback(
    async (id: string) => {
      const currentTask = tasks.find((task) => task.id === id);

      if (!currentTask) {
        return;
      }

      try {
        const updated = await appPatch<StudyTask>(`/v1/study-plans/current/tasks/${id}`, {
          done: !currentTask.done
        });

        setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      } catch (requestError) {
        setError(normalizeError(requestError));
      }
    },
    [tasks]
  );

  const addTask = useCallback(async (task: Omit<StudyTask, "id" | "done">) => {
    try {
      const created = await appPost<StudyTask>("/v1/study-plans/current/tasks", task);
      setTasks((prev) => [...prev, created]);
    } catch (requestError) {
      setError(normalizeError(requestError));
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    try {
      await appDelete<{ deleted: true }>(`/v1/study-plans/current/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (requestError) {
      setError(normalizeError(requestError));
    }
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      toggleTask,
      addTask,
      removeTask,
      isLoading,
      error
    }),
    [addTask, error, isLoading, removeTask, tasks, toggleTask]
  );

  return <StudyPlanContext.Provider value={value}>{children}</StudyPlanContext.Provider>;
}

export function useStudyPlan() {
  return useContext(StudyPlanContext);
}
