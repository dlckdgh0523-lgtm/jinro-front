import React from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { AlertCard } from "../../components/AlertCard";
import { ALERTS } from "../../data/mock";
import { User, GraduationCap, BookOpen, MessageSquare, TrendingUp, ArrowRight, RefreshCw, Database } from "lucide-react";
import { loadGradeSummaryStats } from "../../utils/gradeStorage";

const GOAL_KEY = "jinro_student_goal";

interface SavedGoal {
  university: string;
  department: string;
  field: string;
  targetGrade: string;
  targetScore: string;
  savedAt: string;
  changeCount: number;
}

function loadStudentGoal(): SavedGoal | null {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    return raw ? (JSON.parse(raw) as SavedGoal) : null;
  } catch {
    return null;
  }
}

export function StudentDetail() {
  const navigate = useNavigate();
  const savedGoal = loadStudentGoal();
  const gradeStats = loadGradeSummaryStats();

  const student = {
    name: "김민준", grade: "2학년", track: "자연계", school: "한빛고등학교",
    gpa: gradeStats.hasRealData && gradeStats.avgFinalGrade != null
      ? gradeStats.avgFinalGrade
      : 1.8,
    goal: savedGoal
      ? `${savedGoal.university} ${savedGoal.department}`
      : "서울대학교 컴퓨터공학과",
    status: "warning" as const,
    completion: 62, counselNeeded: true,
    subjects: ["국어", "수학", "영어", "한국사", "물리학Ⅰ", "화학Ⅰ"],
  };

  // 최근 성적 요약: 실제 데이터 우선, 없으면 목업
  const gradeCards = gradeStats.hasRealData && gradeStats.latestSubjects.length > 0
    ? gradeStats.latestSubjects.slice(0, 6).map(s => ({
        sub:   s.name,
        grade: `${s.finalGrade}등급`,
        trend: "→ 최종 확정",
        isReal: true,
      }))
    : [
        { sub: "국어",    grade: "1.8등급", trend: "↑ 0.2", isReal: false },
        { sub: "수학",    grade: "1.8등급", trend: "↑ 0.6", isReal: false },
        { sub: "영어",    grade: "2.0등급", trend: "↑ 0.3", isReal: false },
        { sub: "물리학Ⅰ", grade: "1.9등급", trend: "↑ 0.2", isReal: false },
        { sub: "화학Ⅰ",   grade: "2.2등급", trend: "→ 유지", isReal: false },
        { sub: "한국사",  grade: "1.5등급", trend: "↑ 0.1", isReal: false },
      ];

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
              <StatusBadge variant={student.status} label="주의" />
            </div>
            <p className="text-sm text-muted-foreground">{student.school} · {student.grade} · {student.track}</p>
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
                { label: "평균 내신",   value: `${student.gpa}등급` },
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

          {/* 목표 카드 — 학생이 설정/변경한 데이터가 반영됨 */}
          <div className={`rounded-xl border p-5 ${
            savedGoal
              ? "bg-primary/5 border-primary/20"
              : "bg-card border-border"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">목표 현황</h3>
              {savedGoal?.changeCount != null && savedGoal.changeCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <RefreshCw className="w-3 h-3" />
                  {savedGoal.changeCount}번 변경
                </div>
              )}
            </div>
            <div className="flex items-start gap-2">
              <GraduationCap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{student.goal}</p>
                {savedGoal ? (
                  <>
                    <p className="text-xs text-muted-foreground mt-1">
                      수시 학생부종합 · 목표 내신 {savedGoal.targetGrade}등급
                    </p>
                    <p className="text-xs text-primary mt-0.5">
                      ✓ 학생 직접 설정 · {new Date(savedGoal.savedAt).toLocaleDateString("ko-KR")}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    아직 목표를 설정하지 않았습니다.
                  </p>
                )}
              </div>
            </div>
            {savedGoal && (
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      Math.round(
                        ((parseFloat(savedGoal.targetGrade) > 0
                          ? (9 - parseFloat(savedGoal.targetGrade)) / 8
                          : 0.5) * 100)
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">선택 과목</h3>
            <div className="flex flex-wrap gap-1.5">
              {student.subjects.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-secondary text-xs text-muted-foreground border border-border"
                >
                  {s}
                </span>
              ))}
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
            <div className="grid grid-cols-3 gap-3">
              {gradeCards.map((s) => (
                <div key={s.sub} className="bg-secondary/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{s.grade}</p>
                  <p className={`text-xs mt-0.5 ${
                    s.trend.includes("↑") ? "text-emerald-600 dark:text-emerald-400" :
                    s.trend.includes("↓") ? "text-red-500" : "text-muted-foreground"
                  }`}>{s.trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">최근 알림</h3>
            <div className="space-y-2.5">
              {ALERTS.slice(0, 3).map((a) => (
                <AlertCard key={a.id} alert={a as any} />
              ))}
            </div>
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
            <div className="bg-secondary/40 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">2026-04-09 · 박지영 선생님</p>
              <p className="text-sm text-foreground leading-relaxed">
                김민준 학생과 면담 결과 수학에 대한 불안감이 해소되고 있는 상태.
                AI 진로 탐색 결과를 토대로 컴퓨터공학 방향으로 구체적인 전략을 세울 것.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}