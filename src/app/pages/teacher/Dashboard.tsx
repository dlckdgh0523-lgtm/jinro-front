import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle, StatCard } from "../../components/AppShell";
import { AlertCard } from "../../components/AlertCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Users, Target, BookOpen, MessageSquare, ArrowRight, Copy } from "lucide-react";
import { appGet } from "../../utils/appApi";
import { useNotification } from "../../context/NotificationContext";

type TeacherDashboardResponse = {
  classroom: {
    schoolName: string;
    grade: string;
    className: string;
    inviteCode: string;
    studentCount: number;
  } | null;
  stats: {
    totalStudents: number;
    counselNeeded: number;
    noGoal: number;
    lowCompletion: number;
  };
  students: Array<{
    id: string;
    name: string;
    grade: string;
    track: string;
    gpa: number;
    goal: string;
    status: "danger" | "warning" | "normal";
    completion: number;
    counselNeeded: boolean;
  }>;
  counselingRequests: Array<{
    id: string;
    student: string;
    type: string;
    date: string;
    status: "pending" | "in_progress" | "completed";
  }>;
};

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { notifications } = useNotification();
  const [dashboard, setDashboard] = useState<TeacherDashboardResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await appGet<TeacherDashboardResponse>("/v1/teacher/dashboard");

        if (active) {
          setDashboard(response);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "교사 대시보드를 불러오지 못했습니다.");
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

  const classroom = dashboard?.classroom;
  const recentAlerts = notifications.slice(0, 2);

  return (
    <div>
      <Breadcrumb items={[{ label: "대시보드" }, { label: "교사 홈" }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-foreground">교사 대시보드</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {classroom
              ? `${classroom.schoolName} · ${classroom.grade} ${classroom.className} · 학생 ${classroom.studentCount}명`
              : "반 정보가 아직 연결되지 않았습니다."}
          </p>
        </div>
        {classroom && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <div>
              <p className="text-xs text-muted-foreground">초대코드</p>
              <p className="text-sm font-semibold text-primary">{classroom.inviteCode}</p>
            </div>
            <button className="ml-2 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors text-muted-foreground">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="전체 학생" value={`${dashboard?.stats.totalStudents ?? 0}명`} icon={<Users className="w-4 h-4" />} color="default" />
        <StatCard label="상담 필요 학생" value={`${dashboard?.stats.counselNeeded ?? 0}명`} icon={<MessageSquare className="w-4 h-4" />} color="danger" />
        <StatCard label="목표 미설정" value={`${dashboard?.stats.noGoal ?? 0}명`} icon={<Target className="w-4 h-4" />} color="warning" />
        <StatCard label="학습 이행 저조" value={`${dashboard?.stats.lowCompletion ?? 0}명`} sub="50% 미만" icon={<BookOpen className="w-4 h-4" />} color="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      학생 현황을 불러오고 있습니다.
                    </td>
                  </tr>
                ) : (dashboard?.students.length ?? 0) === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      표시할 학생 상태 정보가 없습니다.
                    </td>
                  </tr>
                ) : (
                  dashboard!.students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-secondary/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/teacher/students/${student.id}`)}
                    >
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.grade} · {student.track}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge variant={student.status} label={student.status === "danger" ? "위험" : student.status === "warning" ? "주의" : "정상"} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-foreground truncate max-w-28">{student.goal}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-sm font-medium ${
                            student.completion >= 70
                              ? "text-emerald-600 dark:text-emerald-400"
                              : student.completion >= 50
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-500"
                          }`}
                        >
                          {student.completion}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {student.counselNeeded && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            필요
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">최근 위험 알림</h3>
              <button onClick={() => navigate("/teacher/alerts")} className="text-xs text-primary hover:underline">
                더 보기
              </button>
            </div>
            <div className="space-y-2">
              {recentAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">표시할 알림이 없습니다.</p>
              ) : (
                recentAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">최근 상담 요청</h3>
              <button onClick={() => navigate("/teacher/counseling/requests")} className="text-xs text-primary hover:underline">
                전체 보기
              </button>
            </div>
            <div className="space-y-2.5">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">상담 요청을 불러오고 있습니다.</p>
              ) : (dashboard?.counselingRequests.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">최근 상담 요청이 없습니다.</p>
              ) : (
                dashboard!.counselingRequests.map((request) => (
                  <div key={request.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-foreground">{request.student}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{request.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{request.type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
