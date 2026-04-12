import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { GraduationCap, ArrowRight, BookOpen, ChevronDown } from "lucide-react";

const RECOMMENDATIONS = [
  {
    id: 1,
    university: "서울대학교",
    department: "컴퓨터공학부",
    fit: "challenge" as const,
    reason: "수학·과학 성적이 우수하고 AI 관심도가 높습니다. 현재 내신 1.8등급에서 1.5등급으로 향상 시 도전 가능합니다.",
    subjects: ["수학", "물리학Ⅰ", "화학Ⅰ"],
    cutGrade: "1.2등급",
    match: 68,
  },
  {
    id: 2,
    university: "연세대학교",
    department: "컴퓨터과학과",
    fit: "suitable" as const,
    reason: "현재 내신 성적과 목표 점수를 고려할 때 적정한 목표입니다. 소프트웨어 역량을 집중적으로 키워보세요.",
    subjects: ["수학", "영어", "생명과학Ⅰ"],
    cutGrade: "1.5등급",
    match: 78,
  },
  {
    id: 3,
    university: "고려대학교",
    department: "AI학과",
    fit: "suitable" as const,
    reason: "AI 분야에 관심이 있고 이공계 성적이 양호합니다. 꾸준히 준비하면 충분히 합격 가능한 목표입니다.",
    subjects: ["수학", "물리학Ⅰ"],
    cutGrade: "1.6등급",
    match: 82,
  },
  {
    id: 4,
    university: "서강대학교",
    department: "소프트웨어학과",
    fit: "safe" as const,
    reason: "현재 내신 성적으로 충분히 합격 가능한 안정권 대학입니다. 수시 학생부종합 전형을 노려보세요.",
    subjects: ["수학", "영어"],
    cutGrade: "1.8등급",
    match: 91,
  },
  {
    id: 5,
    university: "한양대학교",
    department: "컴퓨터공학과",
    fit: "safe" as const,
    reason: "성적 안정권이며 소프트웨어 중심 교육으로 유명합니다. 최우선 안전 지원 대학으로 추천합니다.",
    subjects: ["수학", "과학"],
    cutGrade: "2.0등급",
    match: 95,
  },
];

const FIT_LABELS = { challenge: "도전", suitable: "적정", safe: "안정" };
const FIT_COLORS = {
  challenge: "border-rose-200 dark:border-rose-700",
  suitable: "border-amber-200 dark:border-amber-700",
  safe: "border-teal-200 dark:border-teal-700",
};

export function UniversityRecommendation() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "challenge" | "suitable" | "safe">("all");

  const filtered = filter === "all" ? RECOMMENDATIONS : RECOMMENDATIONS.filter((r) => r.fit === filter);

  return (
    <div>
      <Breadcrumb items={[{ label: "진로 / 입시" }, { label: "대학·학과 추천" }]} />
      <PageTitle
        title="대학·학과 추천"
        subtitle="AI 진로 탐색 결과와 성적 데이터를 바탕으로 맞춤 추천을 제공합니다."
        action={
          <button onClick={() => navigate("/student/career/admissions")} className="flex items-center gap-1.5 px-4 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
            입시 데이터 확인 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      />

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(["all", "challenge", "suitable", "safe"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 h-8 rounded-xl text-sm border transition-colors ${
              filter === f
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {f === "all" ? "전체" : FIT_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((rec) => (
          <div key={rec.id} className={`bg-card rounded-xl border-2 p-5 ${FIT_COLORS[rec.fit]} hover:shadow-sm transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-foreground">{rec.university}</p>
                <p className="text-sm text-muted-foreground">{rec.department}</p>
              </div>
              <StatusBadge variant={rec.fit} label={FIT_LABELS[rec.fit]} />
            </div>

            {/* Match rate */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>나와의 적합도</span>
                <span className="font-medium text-foreground">{rec.match}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${rec.match}%` }} />
              </div>
            </div>

            {/* Reason */}
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.reason}</p>

            {/* Related subjects */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1.5">관련 과목</p>
              <div className="flex flex-wrap gap-1.5">
                {rec.subjects.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Cut grade */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">등급컷 <span className="text-foreground font-medium">{rec.cutGrade}</span></span>
              </div>
              <button
                onClick={() => navigate("/student/career/admissions")}
                className="text-xs text-primary hover:underline flex items-center gap-0.5"
              >
                입시 데이터 <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Next step CTA */}
      <div className="mt-6 bg-secondary/40 rounded-xl border border-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-medium text-foreground mb-1">다음 단계로 진행하세요</p>
          <p className="text-sm text-muted-foreground">입시 데이터를 확인하고 주간 학습 계획을 세워보세요.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => navigate("/student/career/admissions")} className="px-4 h-9 rounded-xl border border-border text-sm text-foreground hover:bg-secondary transition-colors">
            최근 입시 데이터
          </button>
          <button onClick={() => navigate("/student/study/plan")} className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
            학습 계획 세우기 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
