import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { MessageSquare } from "lucide-react";
import { appGet } from "../../utils/appApi";

type StudentCard = {
  id: string;
  name: string;
  grade: string;
  track: string;
  gpa: number;
  goal: string;
  status: "danger" | "warning" | "normal";
  completion: number;
  counselNeeded: boolean;
};

export function CompletionStatus() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetch = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await appGet<StudentCard[]>("/v1/students");
        if (active) setStudents(response);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "학생 목록을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetch();
    return () => { active = false; };
  }, []);

  const lowStudents = students
    .filter((s) => s.completion < 50)
    .sort((a, b) => a.completion - b.completion);

  const above80 = students.filter((s) => s.completion >= 80).length;
  const between5080 = students.filter((s) => s.completion >= 50 && s.completion < 80).length;
  const avgCompletion =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.completion, 0) / students.length)
      : 0;

  return (
    <div>
      <Breadcrumb items={[{ label: "학생 관리" }, { label: "학습 완료 현황" }]} />
      <PageTitle title="학습 완료 현황" subtitle="학급 전체의 학습 완료 현황을 확인하세요." />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {
            label: "학급 평균 완료율",
            value: isLoading ? "-" : `${avgCompletion}%`,
            color: "text-primary",
          },
          {
            label: "80% 이상 학생",
            value: isLoading ? "-" : `${above80}명`,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "50~80% 학생",
            value: isLoading ? "-" : `${between5080}명`,
            color: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "50% 미만 학생",
            value: isLoading ? "-" : `${lowStudents.length}명`,
            color: "text-red-500",
          },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-foreground">학습 이행 저조 학생</h3>
          <span className="text-xs text-muted-foreground">(완료율 50% 미만)</span>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              학생 현황을 불러오고 있습니다.
            </div>
          ) : lowStudents.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              학습 이행 저조 학생이 없습니다.
            </div>
          ) : (
            lowStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/teacher/students/${s.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <StatusBadge
                      variant={s.status}
                      label={s.status === "danger" ? "위험" : "주의"}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs">
                      <div
                        className="h-full rounded-full bg-red-400"
                        style={{ width: `${s.completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-red-500 font-medium">{s.completion}%</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{s.goal}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.track}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate("/teacher/counseling/requests"); }}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors flex-shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> 상담
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
