import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { AlertCard } from "../../components/AlertCard";
import { User, GraduationCap, BookOpen, MessageSquare, TrendingUp, ArrowRight, RefreshCw } from "lucide-react";
import { appGet } from "../../utils/appApi";

// ── 타입 ─────────────────────────────────────────────────────────────────────
interface StudentDetailData {
  student: {
    id: string;
    name: string;
    grade: string;
    track: string;
    gpa: number;
    goal: string;
    status: "normal" | "warning" | "danger";
    completion: number;
    counselNeeded: boolean;
  };
  alerts: Array<{
    id: string;
    type: string;
    category: string;
    title: string;
    body: string;
    time: string;
    read: boolean;
  }>;
  recentMemos: Array<{
    id: string;
    teacher: string;
    date: string;
    subject: string;
    content: string;
  }>;
}

interface GrowthReport {
  avgFinalGrade: number | null;
  bestSubject: { name: string; grade: number } | null;
  worstSubject: { name: string; grade: number } | null;
  latestSubjects: { name: string; finalGrade: string; credit: string }[];
  hasRealData: boolean;
}

export function StudentDetail() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const [data, setData]       = useState<StudentDetailData | null>(null);
  const [report, setReport]   = useState<GrowthReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!studentId) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const fetchAll = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [detail, growth] = await Promise.all([
          appGet<StudentDetailData>(`/v1/students/${studentId}`),
          appGet<GrowthReport>(`/v1/growth-report?studentId=${studentId}`),
        ]);
        if (active) {
          setData(detail);
          setReport(growth);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "학생 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetchAll();
    return () => { active = false; };
  }, [studentId]);

  // studentId 없으면 선택 안내
  if (!studentId) {
    return (
      <div>
        <Breadcrumb items={[{ label: "학생 관리" }, { label: "학생 상세" }]} />
        <div className="bg-card rounded-xl border border-border p-12 text-center mt-4">
          <User className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">학생 목록에서 학생을 선택하세요.</p>
          <button
            onClick={() => navigate("/teacher/students/list")}
            className="mt-4 flex items-center gap-1 text-xs text-primary hover:underline mx-auto"
          >
            학생 목록 <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: "학생 관리" }, { label: "학생 상세" }]} />
        <div className="bg-card rounded-xl border border-border p-12 text-center mt-4">
          <p className="text-sm text-muted-foreground">학생 정보를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Breadcrumb items={[{ label: "학생 관리" }, { label: "학생 상세" }]} />
        <div className="bg-card rounded-xl border border-border p-12 text-center mt-4">
          <p className="text-sm text-destructive">{error || "학생 정보를 찾을 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  const { student, alerts, recentMemos } = data;

  // 성적 카드: 실제 데이터 우선, 없으면 빈 상태
  const gradeCards = report?.hasRealData && report.latestSubjects.length > 0
    ? report.latestSubjects.slice(0, 6).map(s => ({
        sub:   s.name,
        grade: `${s.finalGrade}등급`,
        trend: "→ 최종 확정",
        isReal: true,
      }))
    : [];

  return (
    <div>
      <Breadcrumb items={[{ label: "학생 관리" }, { label: "학생 상세" }]} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-foreground">{student.name}</h1>
              <StatusBadge
                variant={student.status}
                label={student.status === "danger" ? "위험" : student.status === "warning" ? "주의" : "정상"}
              />
            </div>
            <p className="text-sm text-muted-foreground">{student.grade} · {student.track}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/teacher/counseling/memo")}
            className="flex items-center gap-1.5 px-4 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" /> 상담 메모
          </button>
          <button
            onClick={() => navigate("/teacher/students/trend")}
            className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" /> 성적 추이
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile summary */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">학업 프로필</h3>
            <div className="space-y-2.5">
              {[
                { label: "평균 내신",   value: report?.hasRealData && report.avgFinalGrade != null ? `${report.avgFinalGrade}등급` : `${student.gpa}등급` },
                { label: "학습 완료율", value: `${student.completion}%` },
                { label: "상담 필요",   value: student.counselNeeded ? "예" : "아니오" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-medium ${
                    item.label === "상담 필요" && item.value === "예"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-foreground"
                  }`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 목표 카드 */}
          <div className={`rounded-xl border p-5 ${
            student.goal && student.goal !== "목표없음"
              ? "bg-primary/5 border-primary/20"
              : "bg-card border-border"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">목표 현황</h3>
            </div>
            <div className="flex items-start gap-2">
              <GraduationCap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{student.goal || "목표 미설정"}</p>
                {student.goal && student.goal !== "목표없음" ? (
                  <p className="text-xs text-primary mt-0.5">✓ 학생 직접 설정</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">아직 목표를 설정하지 않았습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grade summary + alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">최근 성적 요약</h3>
              <button
                onClick={() => navigate("/teacher/students/trend")}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                성적 추이 <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {gradeCards.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {gradeCards.map((s) => (
                  <div key={s.sub} className="bg-secondary/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{s.grade}</p>
                    <p className="text-xs mt-0.5 text-muted-foreground">{s.trend}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                아직 입력된 성적이 없습니다.
              </p>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">최근 알림</h3>
            {alerts.length > 0 ? (
              <div className="space-y-2.5">
                {alerts.map((a) => (
                  <AlertCard key={a.id} alert={a as any} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">최근 알림이 없습니다.</p>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">최근 상담 메모</h3>
              <button
                onClick={() => navigate("/teacher/counseling/memo")}
                className="text-xs text-primary hover:underline"
              >
                메모 작성
              </button>
            </div>
            {recentMemos.length > 0 ? (
              <div className="space-y-3">
                {recentMemos.map((memo) => (
                  <div key={memo.id} className="bg-secondary/40 rounded-xl p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{memo.date} · {memo.teacher}</p>
                    <p className="text-xs font-medium text-foreground mb-1">{memo.subject}</p>
                    <p className="text-sm text-foreground leading-relaxed">{memo.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">작성된 상담 메모가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
