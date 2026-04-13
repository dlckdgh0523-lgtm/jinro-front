import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { Search, ChevronDown } from "lucide-react";
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

export function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [trackFilter, setTrackFilter] = useState("전체");

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

  const filtered = students.filter((s) => {
    if (search && !s.name.includes(search) && !s.goal.includes(search)) return false;
    if (statusFilter !== "전체") {
      if (statusFilter === "위험" && s.status !== "danger") return false;
      if (statusFilter === "주의" && s.status !== "warning") return false;
      if (statusFilter === "정상" && s.status !== "normal") return false;
    }
    if (trackFilter !== "전체" && s.track !== trackFilter) return false;
    return true;
  });

  return (
    <div>
      <Breadcrumb items={[{ label: "학생 관리" }, { label: "학생 목록" }]} />
      <PageTitle
        title="학생 목록"
        subtitle={isLoading ? "불러오는 중..." : `${students.length}명의 학생을 관리하고 있습니다.`}
      />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full h-9 pl-9 pr-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            placeholder="학생 이름 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["전체", "위험", "주의", "정상"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 h-9 rounded-xl text-sm border transition-colors ${
                statusFilter === f
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <select
            className="h-9 pl-3 pr-8 rounded-xl border border-border bg-card text-foreground text-sm appearance-none focus:outline-none"
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
          >
            {["전체", "이공계", "인문계", "예체능"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">학생</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">상태</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">목표</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">내신 평균</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">학습 완료율</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">상담</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    학생 목록을 불러오고 있습니다.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    {students.length === 0 ? "연결된 학생이 없습니다." : "검색 결과가 없습니다."}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teacher/students/${s.id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.grade} · {s.track}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge
                        variant={s.status}
                        label={s.status === "danger" ? "위험" : s.status === "warning" ? "주의" : "정상"}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-foreground">{s.goal}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-sm font-semibold ${
                        s.gpa <= 2 ? "text-emerald-600 dark:text-emerald-400" :
                        s.gpa <= 3 ? "text-amber-600 dark:text-amber-400" :
                        "text-red-500"
                      }`}>{s.gpa > 0 ? `${s.gpa}등급` : "-"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.completion >= 70 ? "bg-emerald-500" :
                              s.completion >= 50 ? "bg-amber-400" : "bg-red-400"
                            }`}
                            style={{ width: `${s.completion}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{s.completion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {s.counselNeeded
                        ? <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">필요</span>
                        : <span className="text-xs text-muted-foreground">-</span>
                      }
                    </td>
                    <td className="pr-4 text-center">
                      <button className="text-xs text-primary hover:underline">상세</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
