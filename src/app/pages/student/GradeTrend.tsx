import React, { useState, useEffect, useRef } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { ChartCard } from "../../components/ChartCard";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import {
  loadFinalGradeChartData,
  loadExamScoreChartData,
  loadPracticeChartData,
  type ChartResult,
  type ChartMode,
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

// ── 색상 헬퍼 ─────────────────────────────────────────────────────────────────
const gradeBadge = (v: number) =>
  v <= 1.5 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
  v <= 2.5 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";

const scoreBadge = (v: number) =>
  v >= 90 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
  v >= 80 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
  v >= 70 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";

// ── Component ─────────────────────────────────────────────────────────────────
export function GradeTrend() {
  const navigate = useNavigate();

  const [chartMode, setChartMode]       = useState<ChartMode>("final");
  const [dataMap,   setDataMap]         = useState<DataMap>(loadAll);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() =>
    loadFinalGradeChartData().lines.map(l => l.dataKey)
  );

  // ref: chartMode를 focus 핸들러에서 최신 값으로 읽기
  const chartModeRef = useRef(chartMode);
  useEffect(() => { chartModeRef.current = chartMode; }, [chartMode]);

  // 페이지 포커스 시 localStorage 재읽기
  useEffect(() => {
    const refresh = () => {
      const newMap = loadAll();
      setDataMap(newMap);
      // 현재 모드의 새 과목만 추가 (기존 선택 유지)
      setSelectedSubjects(prev => {
        const newKeys = newMap[chartModeRef.current].lines
          .map(l => l.dataKey)
          .filter(k => !prev.includes(k));
        return newKeys.length ? [...prev, ...newKeys] : prev;
      });
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  // 모드 전환: selected subjects 리셋
  const handleModeChange = (mode: ChartMode) => {
    setChartMode(mode);
    setSelectedSubjects(dataMap[mode].lines.map(l => l.dataKey));
  };

  const toggleSubject = (key: string) => {
    setSelectedSubjects(prev =>
      prev.includes(key)
        ? prev.length > 1 ? prev.filter(s => s !== key) : prev
        : [...prev, key]
    );
  };

  const currentData = dataMap[chartMode];
  const config      = CHART_MODE_CONFIG[chartMode];
  const chartLines  = currentData.lines.map(l => ({
    ...l,
    hidden: !selectedSubjects.includes(l.dataKey),
  }));
  const tableSubjects = currentData.lines.filter(l => selectedSubjects.includes(l.dataKey));

  return (
    <div>
      <Breadcrumb items={[{ label: "학업 관리" }, { label: "성적 변화 추이" }]} />
      <PageTitle
        title="성적 변화 추이"
        subtitle="학기 최종 성적, 중간/기말 시험, 모의고사 세 가지 차트로 성적 흐름을 확인하세요."
      />

      {/* ── 차트 모드 선택 버튼 ───────────────────────────────────────────────── */}
      <div className="flex bg-muted/50 rounded-xl p-1 gap-0.5 mb-5 w-fit">
        {CHART_MODE_TABS.map(m => (
          <button
            key={m.key}
            onClick={() => handleModeChange(m.key)}
            className={`px-4 h-8 rounded-lg text-sm transition-colors whitespace-nowrap ${
              chartMode === m.key
                ? "bg-card text-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── 실제 데이터 없음 안내 ─────────────────────────────────────────────── */}
      {!currentData.hasRealData && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            ⚠️ {config.noDataMsg} 현재는 샘플 데이터입니다.
            &nbsp;<strong>{config.noDataHint}</strong>
          </p>
          <button
            onClick={() => navigate("/student/grades/input")}
            className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline flex-shrink-0"
          >
            성적 입력 <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── 과목 필터 pills ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {currentData.lines.map(line => (
          <button
            key={line.dataKey}
            onClick={() => toggleSubject(line.dataKey)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${
              selectedSubjects.includes(line.dataKey)
                ? "border-transparent text-white font-medium"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
            style={selectedSubjects.includes(line.dataKey) ? { background: line.color } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: line.color }} />
            {line.label}
          </button>
        ))}
      </div>

      {/* ── 차트 ──────────────────────────────────────────────────────────────── */}
      <ChartCard
        title={config.chartTitle}
        subtitle={config.chartSubtitle}
        data={currentData.data}
        xKey="period"
        lines={chartLines}
        height={320}
        reversed={config.reversed}
        className="mb-5"
      />

      {/* ── 데이터 테이블 ─────────────────────────────────────────────────────── */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-foreground">
              {chartMode === "final"    ? "학기 최종 성적 데이터" :
               chartMode === "exam"    ? "시험 성적 데이터" : "모의고사 데이터"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{config.chartSubtitle}</p>
          </div>
          {!currentData.hasRealData && (
            <span className="text-xs text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20">
              샘플 데이터
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">구분</th>
                {tableSubjects.map(s => (
                  <th key={s.dataKey} className="text-center px-4 py-3 text-xs font-medium" style={{ color: s.color }}>
                    {s.label}
                  </th>
                ))}
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">평균</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentData.data.map((row, rowIdx) => {
                const vals = tableSubjects
                  .map(s => typeof row[s.dataKey] === "number" ? (row[s.dataKey] as number) : null)
                  .filter((v): v is number => v !== null);
                const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;

                return (
                  <tr key={`row-${rowIdx}`} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 text-sm text-foreground">{row.period}</td>
                    {tableSubjects.map(s => {
                      const v = typeof row[s.dataKey] === "number" ? (row[s.dataKey] as number) : null;
                      return (
                        <td key={s.dataKey} className="px-4 py-3 text-center">
                          {v !== null ? (
                            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                              chartMode === "exam" ? scoreBadge(v) : gradeBadge(v)
                            }`}>
                              {chartMode === "exam" ? `${v}점` : `${v}${config.valueUnit}`}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                      {avg !== null
                        ? chartMode === "exam"
                          ? `${Math.round(avg)}점`
                          : `${avg.toFixed(2)}${config.valueUnit}`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border bg-secondary/20">
          <p className="text-xs text-muted-foreground">
            💡 성적 입력에서 저장한 데이터가 탭별로 자동 반영됩니다.
            {!currentData.hasRealData && " 현재는 샘플 데이터가 표시됩니다."}
          </p>
        </div>
      </div>
    </div>
  );
}
