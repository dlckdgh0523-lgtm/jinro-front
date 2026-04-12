import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { ChartCard } from "../../components/ChartCard";
import { ArrowRight, Info } from "lucide-react";
import {
  loadFinalGradeChartData,
  loadExamScoreChartData,
  loadPracticeChartData,
  loadGradeSummaryStats,
  type ChartResult,
  type ChartMode,
  type SummaryStats,
  CHART_MODE_TABS,
  CHART_MODE_CONFIG,
} from "../../utils/gradeStorage";

type DataMap = Record<ChartMode, ChartResult>;

function loadAll(): DataMap {
  return {
    final:    loadFinalGradeChartData(),
    exam:     loadExamScoreChartData(),
    practice: loadPracticeChartData(),
  };
}

// 등급 기반 progress bar 값 (등급 낮을수록 progress 높음)
function gradeToProgress(grade: number): number {
  return Math.max(0, Math.min(100, Math.round((9 - grade) / 8 * 100)));
}
function gradeStatus(grade: number): "good" | "ok" | "bad" {
  return grade <= 2 ? "good" : grade >= 4 ? "bad" : "ok";
}

// ── Component ─────────────────────────────────────────────────────────────────
export function GrowthReport() {
  const navigate = useNavigate();

  const [chartMode, setChartMode] = useState<ChartMode>("final");
  const [dataMap, setDataMap]     = useState<DataMap>(loadAll);
  const [stats, setStats]         = useState<SummaryStats>(() => loadGradeSummaryStats());

  const chartModeRef = useRef(chartMode);
  useEffect(() => { chartModeRef.current = chartMode; }, [chartMode]);

  useEffect(() => {
    const refresh = () => {
      setDataMap(loadAll());
      setStats(loadGradeSummaryStats());
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const currentData = dataMap[chartMode];
  const config      = CHART_MODE_CONFIG[chartMode];

  // 차트 라인 — GrowthReport에서는 필터 없이 전체 표시
  const chartLines = currentData.lines;

  // 요약 카드 값 계산
  const avgStr    = stats.avgFinalGrade != null ? `${stats.avgFinalGrade}등급` : "미입력";
  const bestStr   = stats.bestSubject   ? stats.bestSubject.name  : "미입력";
  const bestSub   = stats.bestSubject   ? `${stats.bestSubject.grade}등급`  : "-";
  const worstStr  = stats.worstSubject  ? stats.worstSubject.name : "미입력";
  const worstSub  = stats.worstSubject  ? `${stats.worstSubject.grade}등급` : "-";

  // 선택 과목 현황: 실제 데이터 or 목업
  const displaySubjects = stats.latestSubjects.length > 0
    ? stats.latestSubjects.slice(0, 6).map(s => ({
        sub:      s.name,
        grade:    `${s.finalGrade}등급`,
        progress: gradeToProgress(parseFloat(s.finalGrade)),
        status:   gradeStatus(parseFloat(s.finalGrade)) as "good" | "ok" | "bad",
      }))
    : [
        { sub: "수학",    grade: "1.3등급", progress: 88, status: "good" as const },
        { sub: "국어",    grade: "1.8등급", progress: 72, status: "ok"   as const },
        { sub: "영어",    grade: "2.5등급", progress: 45, status: "bad"  as const },
        { sub: "물리학Ⅰ", grade: "1.9등급", progress: 70, status: "ok"   as const },
        { sub: "화학Ⅰ",   grade: "2.1등급", progress: 60, status: "ok"   as const },
      ];

  return (
    <div>
      <Breadcrumb items={[{ label: "학업 관리" }, { label: "성장 리포트" }]} />
      <PageTitle
        title="성장 리포트"
        subtitle="학업 전반의 성장 현황과 앞으로의 방향을 확인하세요."
      />

      {/* 학기 최종 성적 미입력 안내 */}
      {!stats.hasRealData && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              아래 데이터는 샘플입니다.
              <strong> 성적 입력 → 학기 최종 성적</strong> 탭에서 확정 등급을 저장하면 실제 데이터로 반영됩니다.
            </p>
          </div>
          <button
            onClick={() => navigate("/student/grades/input")}
            className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline flex-shrink-0"
          >
            성적 입력 <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── 요약 카드 4개 ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {
            label: "현재 평균 내신",
            value: avgStr,
            sub:   "학기 최종 성적 기준" + (stats.hasRealData ? "" : " (샘플)"),
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "강점 과목",
            value: bestStr,
            sub:   bestSub + " 유지 중",
            color: "text-primary",
          },
          {
            label: "보완 과목",
            value: worstStr,
            sub:   worstSub + " → 집중 필요",
            color: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "학습 완료율",
            value: "71%",
            sub:   "지난주 대비 +9%",
            color: "text-blue-600 dark:text-blue-400",
          },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 성적 변화 그래프 (3가지 모드) ────────────────────────────────────── */}

      {/* 차트 헤더 + 모드 선택 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-foreground">성적 변화 그래프</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {config.chartSubtitle}
          </p>
        </div>
        <div className="flex bg-muted/50 rounded-xl p-1 gap-0.5">
          {CHART_MODE_TABS.map(m => (
            <button
              key={m.key}
              onClick={() => setChartMode(m.key)}
              className={`px-3.5 h-7 rounded-lg text-xs transition-colors whitespace-nowrap ${
                chartMode === m.key
                  ? "bg-card text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 데이터 없음 안내 */}
      {!currentData.hasRealData && (
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/40 rounded-xl px-3 py-2.5 mb-4">
          <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {config.noDataMsg} {config.noDataHint}
          </p>
        </div>
      )}

      {/* ChartCard — 독립 카드로 렌더 */}
      <ChartCard
        title=""
        subtitle=""
        data={currentData.data}
        xKey="period"
        lines={chartLines}
        height={260}
        reversed={config.reversed}
        className="mb-5"
      />

      {/* ── 선택 과목 현황 + 강점/보완점 ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">

        {/* 선택 과목 현황 */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground">선택 과목 현황</h3>
            <span className="text-xs text-muted-foreground">
              {stats.hasRealData ? "학기 최종 성적 기준" : "샘플 데이터"}
            </span>
          </div>
          <div className="space-y-2.5">
            {displaySubjects.map(s => (
              <div key={s.sub}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{s.sub}</span>
                  <span className={`font-medium ${
                    s.status === "good" ? "text-emerald-600 dark:text-emerald-400" :
                    s.status === "bad"  ? "text-red-500" : "text-amber-600 dark:text-amber-400"
                  }`}>{s.grade}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.status === "good" ? "bg-emerald-500" :
                      s.status === "bad"  ? "bg-red-400" : "bg-amber-400"
                    }`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {stats.hasRealData && (
            <p className="text-xs text-muted-foreground mt-3">
              총 {stats.latestSubjects.length}개 과목 · 최근 학기 최종 성적 기준
            </p>
          )}
        </div>

        {/* 강점 & 보완점 */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-foreground mb-3">강점 &amp; 보완점</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">✅ 강점</p>
              {stats.hasRealData && stats.latestSubjects.length > 0
                ? stats.latestSubjects
                    .filter(s => parseFloat(s.finalGrade) <= 2)
                    .slice(0, 3)
                    .map(s => (
                      <div key={s.name} className="flex items-start gap-2 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                        <p className="text-xs text-foreground">
                          {s.name} 최종 {s.finalGrade}등급 달성
                        </p>
                      </div>
                    ))
                : [
                    "수학 문제 해결 능력이 뛰어남 (최종 1.3등급)",
                    "과학 이론 이해도가 높음",
                    "주간 학습 계획 준수율 높음",
                  ].map(s => (
                    <div key={s} className="flex items-start gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                      <p className="text-xs text-foreground">{s}</p>
                    </div>
                  ))
              }
              {stats.hasRealData && stats.latestSubjects.filter(s => parseFloat(s.finalGrade) <= 2).length === 0 && (
                <p className="text-xs text-muted-foreground">2등급 이내 과목이 없습니다.</p>
              )}
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-2">⚠️ 보완점</p>
              {stats.hasRealData && stats.latestSubjects.length > 0
                ? stats.latestSubjects
                    .filter(s => parseFloat(s.finalGrade) >= 3)
                    .slice(0, 3)
                    .map(s => (
                      <div key={s.name} className="flex items-start gap-2 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                        <p className="text-xs text-foreground">
                          {s.name} {s.finalGrade}등급 → 집중 보완 필요
                        </p>
                      </div>
                    ))
                : [
                    "영어 독해 연습이 더 필요함 (최종 2.5등급)",
                    "국어 문학 파트 심화 학습 권장",
                  ].map(s => (
                    <div key={s} className="flex items-start gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      <p className="text-xs text-foreground">{s}</p>
                    </div>
                  ))
              }
              {stats.hasRealData && stats.latestSubjects.filter(s => parseFloat(s.finalGrade) >= 3).length === 0 && (
                <p className="text-xs text-muted-foreground">3등급 이상 과목이 없습니다. 훌륭합니다!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI 추천 요약 ─────────────────────────────────────────────────────── */}
      <div className="bg-secondary/40 rounded-xl border border-border p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-foreground mb-1">AI 추천 요약</p>
            <p className="text-sm text-muted-foreground">
              {stats.hasRealData && stats.bestSubject && stats.worstSubject
                ? `${stats.bestSubject.name}(${stats.bestSubject.grade}등급) 강점을 유지하고, ${stats.worstSubject.name}(${stats.worstSubject.grade}등급) 집중 보완을 권장합니다. 학기 최종 성적 기준으로 학습 계획을 재점검해 보세요.`
                : "서울대학교 컴퓨터공학부 목표 기준, 수학·과학 유지 및 영어 집중 보완이 필요합니다. 학기 최종 성적을 입력한 뒤 입시 데이터를 기반으로 학습 계획을 재점검해 보세요."}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => navigate("/student/career/admissions")}
              className="px-4 h-9 rounded-xl border border-border text-sm text-foreground hover:bg-secondary transition-colors"
            >
              입시 데이터
            </button>
            <button
              onClick={() => navigate("/student/study/plan")}
              className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
            >
              학습 계획 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}