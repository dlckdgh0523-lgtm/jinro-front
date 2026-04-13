import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { ChartCard } from "../../components/ChartCard";
import { ArrowRight, Info } from "lucide-react";
import { appGet } from "../../utils/appApi";
import {
  type ChartResult,
  type ChartMode,
  CHART_MODE_TABS,
  CHART_MODE_CONFIG,
} from "../../utils/gradeStorage";

interface GrowthReportData {
  avgFinalGrade: number | null;
  bestSubject: { name: string; grade: number } | null;
  worstSubject: { name: string; grade: number } | null;
  latestSubjects: { name: string; finalGrade: string; credit: string }[];
  hasRealData: boolean;
}

type DataMap = Record<ChartMode, ChartResult>;

const EMPTY_CHART: ChartResult = { data: [], lines: [], hasRealData: false };
const EMPTY_MAP: DataMap = { final: EMPTY_CHART, exam: EMPTY_CHART, practice: EMPTY_CHART };

function gradeToProgress(grade: number): number {
  return Math.max(0, Math.min(100, Math.round(((9 - grade) / 8) * 100)));
}
function gradeStatus(grade: number): "good" | "ok" | "bad" {
  return grade <= 2 ? "good" : grade >= 4 ? "bad" : "ok";
}

export function GrowthReport() {
  const navigate = useNavigate();

  const [chartMode, setChartMode] = useState<ChartMode>("final");
  const [dataMap, setDataMap] = useState<DataMap>(EMPTY_MAP);
  const [report, setReport] = useState<GrowthReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const chartModeRef = useRef(chartMode);
  useEffect(() => {
    chartModeRef.current = chartMode;
  }, [chartMode]);

  const fetchAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [final, exam, practice, growthReport] = await Promise.all([
        appGet<ChartResult>("/v1/grades/chart?mode=final"),
        appGet<ChartResult>("/v1/grades/chart?mode=exam"),
        appGet<ChartResult>("/v1/grades/chart?mode=practice"),
        appGet<GrowthReportData>("/v1/growth-report"),
      ]);
      setDataMap({ final, exam, practice });
      setReport(growthReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : "성장 리포트를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchAll();
    const refresh = () => void fetchAll();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const currentData = dataMap[chartMode];
  const config = CHART_MODE_CONFIG[chartMode];

  const avgStr = report?.avgFinalGrade != null ? `${report.avgFinalGrade}등급` : "미입력";
  const bestStr = report?.bestSubject ? report.bestSubject.name : "미입력";
  const bestSub = report?.bestSubject ? `${report.bestSubject.grade}등급` : "-";
  const worstStr = report?.worstSubject ? report.worstSubject.name : "미입력";
  const worstSub = report?.worstSubject ? `${report.worstSubject.grade}등급` : "-";

  const displaySubjects =
    report?.hasRealData && (report.latestSubjects.length ?? 0) > 0
      ? report.latestSubjects.slice(0, 6).map((s) => ({
          sub: s.name,
          grade: `${s.finalGrade}등급`,
          progress: gradeToProgress(parseFloat(s.finalGrade)),
          status: gradeStatus(parseFloat(s.finalGrade)) as "good" | "ok" | "bad",
        }))
      : [];

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: "학업 관리" }, { label: "성장 리포트" }]} />
        <PageTitle title="성장 리포트" subtitle="학업 전반의 성장 현황과 앞으로의 방향을 확인하세요." />
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">성장 리포트를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "학업 관리" }, { label: "성장 리포트" }]} />
      <PageTitle
        title="성장 리포트"
        subtitle="학업 전반의 성장 현황과 앞으로의 방향을 확인하세요."
      />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      {!report?.hasRealData && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              아직 입력된 학기 최종 성적이 없습니다.
              <strong> 성적 입력 → 학기 최종 성적</strong> 탭에서 확정 등급을 저장하세요.
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

      {/* 요약 카드 4개 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {
            label: "현재 평균 내신",
            value: avgStr,
            sub: "학기 최종 성적 기준",
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "강점 과목",
            value: bestStr,
            sub: bestSub + " 유지 중",
            color: "text-primary",
          },
          {
            label: "보완 과목",
            value: worstStr,
            sub: worstSub + " → 집중 필요",
            color: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "등록 과목 수",
            value: report?.hasRealData ? `${report.latestSubjects.length}개` : "-",
            sub: "최근 학기 기준",
            color: "text-blue-600 dark:text-blue-400",
          },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 성적 변화 그래프 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-foreground">성적 변화 그래프</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{config.chartSubtitle}</p>
        </div>
        <div className="flex bg-muted/50 rounded-xl p-1 gap-0.5">
          {CHART_MODE_TABS.map((m) => (
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

      {!currentData.hasRealData && (
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/40 rounded-xl px-3 py-2.5 mb-4">
          <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {config.noDataMsg} {config.noDataHint}
          </p>
        </div>
      )}

      {currentData.hasRealData ? (
        <ChartCard
          title=""
          subtitle=""
          data={currentData.data}
          xKey="period"
          lines={currentData.lines}
          height={260}
          reversed={config.reversed}
          className="mb-5"
        />
      ) : (
        <div className="bg-card rounded-xl border border-border p-8 text-center mb-5">
          <p className="text-sm text-muted-foreground">표시할 성적 데이터가 없습니다.</p>
        </div>
      )}

      {/* 선택 과목 현황 + 강점/보완점 */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground">선택 과목 현황</h3>
            <span className="text-xs text-muted-foreground">
              {report?.hasRealData ? "학기 최종 성적 기준" : "데이터 없음"}
            </span>
          </div>
          {displaySubjects.length > 0 ? (
            <div className="space-y-2.5">
              {displaySubjects.map((s) => (
                <div key={s.sub}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{s.sub}</span>
                    <span
                      className={`font-medium ${
                        s.status === "good"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : s.status === "bad"
                            ? "text-red-500"
                            : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {s.grade}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.status === "good"
                          ? "bg-emerald-500"
                          : s.status === "bad"
                            ? "bg-red-400"
                            : "bg-amber-400"
                      }`}
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-3">
                총 {report!.latestSubjects.length}개 과목 · 최근 학기 최종 성적 기준
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              학기 최종 성적을 입력하면 과목별 현황이 표시됩니다.
            </p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-foreground mb-3">강점 &amp; 보완점</h3>
          {report?.hasRealData && report.latestSubjects.length > 0 ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                  ✅ 강점
                </p>
                {report.latestSubjects
                  .filter((s) => parseFloat(s.finalGrade) <= 2)
                  .slice(0, 3)
                  .map((s) => (
                    <div key={s.name} className="flex items-start gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                      <p className="text-xs text-foreground">
                        {s.name} 최종 {s.finalGrade}등급 달성
                      </p>
                    </div>
                  ))}
                {report.latestSubjects.filter((s) => parseFloat(s.finalGrade) <= 2).length ===
                  0 && (
                  <p className="text-xs text-muted-foreground">2등급 이내 과목이 없습니다.</p>
                )}
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-2">
                  ⚠️ 보완점
                </p>
                {report.latestSubjects
                  .filter((s) => parseFloat(s.finalGrade) >= 3)
                  .slice(0, 3)
                  .map((s) => (
                    <div key={s.name} className="flex items-start gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      <p className="text-xs text-foreground">
                        {s.name} {s.finalGrade}등급 → 집중 보완 필요
                      </p>
                    </div>
                  ))}
                {report.latestSubjects.filter((s) => parseFloat(s.finalGrade) >= 3).length ===
                  0 && (
                  <p className="text-xs text-muted-foreground">3등급 이상 과목이 없습니다. 훌륭합니다!</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              학기 최종 성적을 입력하면 강점과 보완점이 분석됩니다.
            </p>
          )}
        </div>
      </div>

      {/* 학습 계획 바로가기 */}
      <div className="bg-secondary/40 rounded-xl border border-border p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-foreground mb-1">학습 계획 연결</p>
            <p className="text-sm text-muted-foreground">
              {report?.hasRealData && report.bestSubject && report.worstSubject
                ? `${report.bestSubject.name}(${report.bestSubject.grade}등급) 강점을 유지하고, ${report.worstSubject.name}(${report.worstSubject.grade}등급) 집중 보완을 권장합니다.`
                : "성적 데이터를 입력하면 맞춤형 학습 방향을 제안해 드립니다."}
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
