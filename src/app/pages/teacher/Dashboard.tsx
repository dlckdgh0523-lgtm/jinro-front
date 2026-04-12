import React from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle, StatCard } from "../../components/AppShell";
import { AlertCard } from "../../components/AlertCard";
import { StatusBadge } from "../../components/StatusBadge";
import { STUDENTS, COUNSELING_REQUESTS } from "../../data/mock";
import { Users, AlertTriangle, Target, BookOpen, MessageSquare, ArrowRight, Copy } from "lucide-react";

const TEACHER_ALERTS = [
  { id: 1, type: "danger" as const, category: "성적", title: "박지호 학생 성적 급락", body: "박지호 학생의 수학 성적이 2등급에서 4등급으로 하락했습니다.", time: "30분 전", read: false },
  { id: 2, type: "warning" as const, category: "학습", title: "오승우 학생 학습 미이행", body: "오승우 학생이 이번 주 학습 계획을 거의 이행하지 않고 있습니다.", time: "2시간 전", read: false },
  { id: 3, type: "info" as const, category: "상담", title: "새 상담 요청 2건", body: "이서연, 박지호 학생이 상담을 요청했습니다.", time: "3시간 전", read: true },
];

export function TeacherDashboard() {
  const navigate = useNavigate();
  const dangerStudents = STUDENTS.filter((s) => s.status === "danger");
  const warningStudents = STUDENTS.filter((s) => s.status === "warning");
  const noGoalStudents = STUDENTS.filter((s) => s.goal === "미설정");
  const lowCompletion = STUDENTS.filter((s) => s.completion < 50);

  return (
    <div>
      <Breadcrumb items={[{ label: "대시보드" }, { label: "교사 홈" }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-foreground">박지영 선생님, 안녕하세요 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">한빛고등학교 · 3학년 B반 · 학생 {STUDENTS.length}명</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 rounded-xl border border-primary/20">
          <div>
            <p className="text-xs text-muted-foreground">초대코드</p>
            <p className="text-sm font-semibold text-primary">HB-2026-3B</p>
          </div>
          <button className="ml-2 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors text-muted-foreground">
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="전체 학생" value={`${STUDENTS.length}명`} icon={<Users className="w-4 h-4" />} color="default" />
        <StatCard label="상담 필요 학생" value={`${dangerStudents.length + warningStudents.length}명`} sub="위험 2명 포함" icon={<MessageSquare className="w-4 h-4" />} color="danger" />
        <StatCard label="목표 미설정" value={`${noGoalStudents.length}명`} icon={<Target className="w-4 h-4" />} color="warning" />
        <StatCard label="학습 이행 저조" value={`${lowCompletion.length}명`} sub="50% 미만" icon={<BookOpen className="w-4 h-4" />} color="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Student list summary */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-foreground">주의 학생 현황</h3>
            <button onClick={() => navigate("/teacher/students/list")} className="text-xs text-primary hover:underline flex items-center gap-1">
              전체 목록 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-medium">학생</th>
                  <th className="text-center px-4 py-2.5 text-xs text-muted-foreground font-medium">상태</th>
                  <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">목표</th>
                  <th className="text-center px-4 py-2.5 text-xs text-muted-foreground font-medium">완료율</th>
                  <th className="text-center px-4 py-2.5 text-xs text-muted-foreground font-medium">상담</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {STUDENTS.filter((s) => s.status !== "normal").map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => navigate("/teacher/students/detail")}
                  >
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.grade} · {s.track}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge variant={s.status as any} label={s.status === "danger" ? "위험" : "주의"} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-foreground truncate max-w-28">{s.goal}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${
                        s.completion >= 70 ? "text-emerald-600 dark:text-emerald-400" :
                        s.completion >= 50 ? "text-amber-600 dark:text-amber-400" :
                        "text-red-500"
                      }`}>{s.completion}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {s.counselNeeded && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">필요</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent alerts */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">최근 위험 알림</h3>
              <button onClick={() => navigate("/teacher/alerts")} className="text-xs text-primary hover:underline">더 보기</button>
            </div>
            <div className="space-y-2">
              {TEACHER_ALERTS.slice(0, 2).map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          </div>

          {/* Recent counseling memos */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">최근 상담 요청</h3>
              <button onClick={() => navigate("/teacher/counseling/requests")} className="text-xs text-primary hover:underline">전체 보기</button>
            </div>
            <div className="space-y-2.5">
              {COUNSELING_REQUESTS.slice(0, 3).map((req) => (
                <div key={req.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-foreground">{req.student}</p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{req.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{req.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
