import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { ChartCard } from "../../components/ChartCard";
import { TEACHER_GRADE_DATA, STUDENTS } from "../../data/mock";
import { ChevronDown, ArrowRight, Info, User, Database } from "lucide-react";
import {
  loadFinalGradeChartData,
  loadExamScoreChartData,
  loadPracticeChartData,
  loadGradeSummaryStats,
  type ChartResult,
  type ChartMode,
  CHART_MODE_TABS,
  CHART_MODE_CONFIG,
  getSubjectColor,
} from "../../utils/gradeStorage";

// ── 상수 ─────────────────────────────────────────────────────────────────────
/** localStorage와 연동되는 데모 학생 */
const DEMO_STUDENT = "김민준";

// 전체 비교 뷰에 쓸 학생 라인 색상
const STUDENT_LINE_COLORS: Record<string, string> = {
  "김민준": "#C5614A",
  "이서연": "#E8A598",
  "박지호": "#8FB8A8",
  "최아연": "#A8C4B8",
};

// ── 비데모 학생 목업 데이터 생성 (gpa 기반) ───────────────────────────────────
function generateMockChartResult(
  student: (typeof STUDENTS)[number],
  mode: ChartMode
): ChartResult {
  const base  = student.gpa;
  const names = ["국어", "수학", "영어", "한국사"];
  const lines = names.map((n, i) => ({ dataKey: n, label: n, color: getSubjectColor(n, i) }));

  if (mode === "final") {
    return {
      data: [
        {
          period: "2025 1학기",
          국어:   +(base + 0.3).toFixed(1),
          수학:   +(base - 0.2).toFixed(1),
          영어:   +(base + 0.5).toFixed(1),
          한국사: +(base - 0.1).toFixed(1),
        },
        {
          period: "2025 2학기",
          국어:   +(base + 0.2).toFixed(1),
          수학:   +(base - 0.3).toFixed(1),
          영어:   +(base + 0.4).toFixed(1),
          한국사: +(base - 0.2).toFixed(1),
        },
        {
          period: "2026 1학기",
          국어:   +(base + 0.1).toFixed(1),
          수학:   +(base - 0.4).toFixed(1),
          영어:   +(base + 0.3).toFixed(1),
          한국사: +(base - 0.3).toFixed(1),
        },
      ],
      lines,
      hasRealData: false,
    };
  }

  if (mode === "exam") {
    const sc = Math.min(Math.max(Math.round(100 - (base - 1) * 13), 50), 99);
    return {
      data: [
        { period: "2025 1학기 중간", 국어: sc - 3, 수학: sc + 4, 영어: sc - 6, 한국사: sc + 1 },
        { period: "2025 1학기 기말", 국어: sc - 1, 수학: sc + 5, 영어: sc - 4, 한국사: sc + 2 },
        { period: "2025 2학기 중간", 국어: sc,     수학: sc + 6, 영어: sc - 3, 한국사: sc + 3 },
        { period: "2025 2학기 기말", 국어: sc + 2, 수학: sc + 7, 영어: sc - 1, 한국사: sc + 4 },
      ],
      lines,
      hasRealData: false,
    };
  }

  // practice
  const g = Math.ceil(base);
  return {
    data: [
      { period: "2025 3월 모의", 국어: g,             수학: Math.max(1, g - 1), 영어: g + 1, 한국사: g },
      { period: "2025 6월 모의", 국어: g,             수학: Math.max(1, g - 1), 영어: g,     한국사: g },
      { period: "2025 9월 모의", 국어: Math.max(1, g - 1), 수학: Math.max(1, g - 1), 영어: g, 한국사: Math.max(1, g - 1) },
    ],
    lines,
    hasRealData: false,
  };
}

// ── 전체 비교 뷰 라인 생성 ────────────────────────────────────────────────────
const ALL_STUDENT_LINES = Object.entries(STUDENT_LINE_COLORS).map(([name, color]) => ({
  dataKey: name,
  label:   name,
  color,
}));

// ── 배지 색상 ─────────────────────────────────────────────────────────────────
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
export function TeacherGradeTrend() {
  const navigate = useNavigate();

  // 학생 선택 — "전체"이면 비교 뷰, 특정 학생이면 과목별 3-모드 뷰
  const [selectedStudent, setSelectedStudent] = useState<string>(DEMO_STUDENT);

  // 전체 비교 뷰: 표시할 학생 필터
  const [visibleStudents, setVisibleStudents] = useState<string[]>(
    Object.keys(STUDENT_LINE_COLORS)
  );

  // 과목별 뷰 모드 + 과목 필터
  const [chartMode, setChartMode] = useState<ChartMode>("final");

  // 데모 학생 실제 데이터
  const [demoData, setDemoData] = useState<Record<ChartMode, ChartResult>>(() => ({
    final:    loadFinalGradeChartData(),
    exam:     loadExamScoreChartData(),
    practice: loadPracticeChartData(),
  }));
  const [demoStats, setDemoStats] = useState(() => loadGradeSummaryStats());

  const chartModeRef = useRef(chartMode);
  useEffect(() => { chartModeRef.current = chartMode; }, [chartMode]);

  // 선택 과목 초기화: 모드 전환 or 학생 전환 시
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // 페이지 포커스 시 localStorage 재읽기
  useEffect(() => {
    const refresh = () => {
      setDemoData({
        final:    loadFinalGradeChartData(),
        exam:     loadExamScoreChartData(),
        practice: loadPracticeChartData(),
      });
      setDemoStats(loadGradeSummaryStats());
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  // 학생/모드 변경 시 과목 필터 초기화
  useEffect(() => {
    const result = getStudentChartResult(selectedStudent, chartMode);
    setSelectedSubjects(result.lines.map(l => l.dataKey));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent, chartMode]);

  // ── 데이터 로딩 함수 ────────────────────────────────────────────────────────
  function getStudentChartResult(name: string, mode: ChartMode): ChartResult {
    if (name === DEMO_STUDENT) return demoData[mode];
    const studentRec = STUDENTS.find(s => s.name === name);
    return studentRec ? generateMockChartResult(studentRec, mode) : demoData[mode];
  }

  // 현재 뷰 데이터
  const isOverall = selectedStudent === "전체";
  const currentChartResult = isOverall ? null : getStudentChartResult(selectedStudent, chartMode);
  const config = CHART_MODE_CONFIG[chartMode];

  // 전체 뷰용 라인 (학생 필터 적용)
  const overallLines = ALL_STUDENT_LINES
    .filter(l => visibleStudents.includes(l.dataKey))
    .map(l => ({ ...l }));

  // 과목별 뷰용 라인 (과목 필터 적용)
  const subjectLines = currentChartResult?.lines.map(l => ({
    ...l,
    hidden: !selectedSubjects.includes(l.dataKey),
  })) ?? [];

  const toggleVisibleStudent = (name: string) =>
    setVisibleStudents(prev =>
      prev.includes(name)
        ? prev.length > 1 ? prev.filter(s => s !== name) : prev
        : [...prev, name]
    );

  const toggleSubject = (key: string) =>
    setSelectedSubjects(prev =>
      prev.includes(key)
        ? prev.length > 1 ? prev.filter(s => s !== key) : prev
        : [...prev, key]
    );

  // 학생 정보 (per-student 뷰용)
  const currentStudentRec = STUDENTS.find(s => s.name === selectedStudent);

  return (
    <div>
      <Breadcrumb items={[{ label: "학생 관리" }, { label: "학생 성적 추이" }]} />
      <PageTitle
        title="학생 성적 추이"
        subtitle={
          isOverall
            ? "반 전체 학생의 내신 등급 변화를 한눈에 비교하세요."
            : `${selectedStudent} 학생의 과목별 성적 흐름을 확인하세요.`
        }
        action={
          <div className="relative">
            <select
              className="h-9 pl-3.5 pr-8 rounded-xl border border-border bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
              value={selectedStudent}
              onChange={e => {
                setSelectedStudent(e.target.value);
                setChartMode("final");
              }}
            >
              <option value="전체">전체 비교</option>
              {STUDENTS.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        }
      />

      {/* ── 개별 학생 뷰 ─────────────────────────────────────────────────────── */}
      {!isOverall && currentChartResult && (
        <>
          {/* 학생 정보 배너 */}
          {currentStudentRec && (
            <div className="bg-card rounded-xl border border-border p-4 mb-5 flex flex-wrap items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{currentStudentRec.name}</span>
                  <span className="text-xs text-muted-foreground">{currentStudentRec.grade} · {currentStudentRec.track}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    currentStudentRec.status === "normal"  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    currentStudentRec.status === "warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    GPA {currentStudentRec.gpa}등급
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{currentStudentRec.goal}</p>
              </div>
              {/* 데모 학생: 실제 데이터 연동 표시 */}
              {selectedStudent === DEMO_STUDENT && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-primary">실시간 연동</span>
                </div>
              )}
              {selectedStudent !== DEMO_STUDENT && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border">
                  <span className="text-xs text-muted-foreground">샘플 데이터</span>
                </div>
              )}
              <button
                onClick={() => navigate("/teacher/students/detail")}
                className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
              >
                학생 상세 <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* 실제 데이터 없음 안내 */}
          {!currentChartResult.hasRealData && selectedStudent === DEMO_STUDENT && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  ⚠️ {config.noDataMsg} 현재는 샘플 데이터입니다. 학생이 성적을 입력하면 자동 반영됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 차트 모드 선택 버튼 */}
          <div className="flex bg-muted/50 rounded-xl p-1 gap-0.5 mb-5 w-fit">
            {CHART_MODE_TABS.map(m => (
              <button
                key={m.key}
                onClick={() => setChartMode(m.key)}
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

          {/* 과목 필터 pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {currentChartResult.lines.map(line => (
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

          {/* 차트 */}
          <ChartCard
            title={config.chartTitle}
            subtitle={`${selectedStudent} · ${config.chartSubtitle}`}
            data={currentChartResult.data}
            xKey="period"
            lines={subjectLines}
            height={320}
            reversed={config.reversed}
            className="mb-5"
          />

          {/* 데이터 테이블 */}
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-foreground">
                  {chartMode === "final"    ? "학기 최종 성적 데이터" :
                   chartMode === "exam"     ? "시험 점수 데이터" : "모의고사 데이터"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedStudent} · {config.chartSubtitle}
                </p>
              </div>
              {!currentChartResult.hasRealData && (
                <span className="text-xs text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20">
                  {selectedStudent === DEMO_STUDENT ? "샘플 데이터" : "목업 데이터"}
                </span>
              )}
              {currentChartResult.hasRealData && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  실제 데이터
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">구분</th>
                    {currentChartResult.lines
                      .filter(l => selectedSubjects.includes(l.dataKey))
                      .map(l => (
                        <th key={l.dataKey} className="text-center px-4 py-3 text-xs font-medium" style={{ color: l.color }}>
                          {l.label}
                        </th>
                      ))}
                    <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">평균</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentChartResult.data.map((row, rowIdx) => {
                    const visLines = currentChartResult.lines.filter(l => selectedSubjects.includes(l.dataKey));
                    const vals = visLines
                      .map(l => typeof row[l.dataKey] === "number" ? row[l.dataKey] as number : null)
                      .filter((v): v is number => v !== null);
                    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;

                    return (
                      <tr key={`row-${rowIdx}`} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-3 text-sm text-foreground">{row.period}</td>
                        {visLines.map(l => {
                          const v = typeof row[l.dataKey] === "number" ? row[l.dataKey] as number : null;
                          return (
                            <td key={l.dataKey} className="px-4 py-3 text-center">
                              {v !== null ? (
                                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                                  chartMode === "exam" ? scoreBadge(v) : gradeBadge(v)
                                }`}>
                                  {chartMode === "exam" ? `${v}점` : `${v}등급`}
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
                              : `${avg.toFixed(2)}등급`
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
                {selectedStudent === DEMO_STUDENT
                  ? "💡 학생이 성적 입력에서 저장한 데이터가 탭별로 자동 반영됩니다."
                  : "💡 해당 학생은 샘플 목업 데이터입니다. 실제 서비스에서는 학생별 데이터가 연동됩니다."}
              </p>
            </div>
          </div>

          {/* 학기 최종 성적 요약 카드 (final 모드 + 데모 학생일 때) */}
          {chartMode === "final" && selectedStudent === DEMO_STUDENT && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "평균 등급",
                  value: demoStats.hasRealData && demoStats.avgFinalGrade != null
                    ? `${demoStats.avgFinalGrade}등급`
                    : `${currentStudentRec?.gpa ?? "-"}등급`,
                  color: "text-primary",
                },
                {
                  label: "강점 과목",
                  value: demoStats.hasRealData && demoStats.bestSubject
                    ? `${demoStats.bestSubject.name} (${demoStats.bestSubject.grade}등급)`
                    : "수학",
                  color: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  label: "보완 과목",
                  value: demoStats.hasRealData && demoStats.worstSubject
                    ? `${demoStats.worstSubject.name} (${demoStats.worstSubject.grade}등급)`
                    : "영어",
                  color: "text-amber-600 dark:text-amber-400",
                },
                {
                  label: "입력 과목 수",
                  value: demoStats.hasRealData
                    ? `${demoStats.latestSubjects.length}과목`
                    : "미입력",
                  color: "text-foreground",
                },
              ].map(item => (
                <div key={item.label} className="bg-card rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── 전체 비교 뷰 ─────────────────────────────────────────────────────── */}
      {isOverall && (
        <>
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/40 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              전체 비교 뷰는 내신 등급 기준입니다. 특정 학생을 선택하면
              <strong> 학기 최종 성적 / 중간·기말 시험 / 모의고사</strong> 세 가지 차트로 상세 확인할 수 있습니다.
            </p>
          </div>

          {/* 학생 필터 pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {ALL_STUDENT_LINES.map(line => (
              <button
                key={line.dataKey}
                onClick={() => toggleVisibleStudent(line.dataKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  visibleStudents.includes(line.dataKey)
                    ? "border-transparent text-white font-medium"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
                style={visibleStudents.includes(line.dataKey) ? { background: line.color } : {}}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: line.color }} />
                {line.label}
              </button>
            ))}
          </div>

          <ChartCard
            title="학생별 내신 등급 비교"
            subtitle="최근 시험 기준 · 등급 수치가 낮을수록 성적이 높습니다"
            data={TEACHER_GRADE_DATA}
            xKey="period"
            lines={ALL_STUDENT_LINES.map(l => ({ ...l, hidden: !visibleStudents.includes(l.dataKey) }))}
            reversed
            height={320}
            className="mb-5"
          />

          {/* 전체 요약 테이블 */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-foreground">학생별 성적 변화 표</h3>
              <p className="text-xs text-muted-foreground mt-0.5">내신 등급 기준 · 샘플 데이터</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">시험 구분</th>
                    {ALL_STUDENT_LINES.map(l => (
                      <th key={l.dataKey} className="text-center px-4 py-3 text-xs font-medium" style={{ color: l.color }}>
                        {l.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TEACHER_GRADE_DATA.map((row, idx) => (
                    <tr key={`overall-${idx}`} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-3 text-sm text-foreground">{row.period}</td>
                      {ALL_STUDENT_LINES.map(l => {
                        const val = row[l.dataKey as keyof typeof row] as number | undefined;
                        return (
                          <td key={l.dataKey} className="px-4 py-3 text-center">
                            {val != null ? (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gradeBadge(val)}`}>
                                {val}등급
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                💡 특정 학생을 선택하면 과목별 상세 성적과 3가지 차트 모드를 확인할 수 있습니다.
              </p>
              <button
                onClick={() => setSelectedStudent(DEMO_STUDENT)}
                className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0 ml-4"
              >
                {DEMO_STUDENT} 상세보기 <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}