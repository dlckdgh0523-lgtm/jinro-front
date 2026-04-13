import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { ChartCard } from "../../components/ChartCard";
import { ChevronDown, ArrowRight, Info, User } from "lucide-react";
import { appGet } from "../../utils/appApi";
import {
  type ChartResult,
  type ChartMode,
  CHART_MODE_TABS,
  CHART_MODE_CONFIG,
  getSubjectColor,
} from "../../utils/gradeStorage";

// ── 타입 ─────────────────────────────────────────────────────────────────────
interface StudentCard {
  id: string;
  name: string;
  grade: string;
  track: string;
  gpa: number | null;
  status: string;
  goal: string | null;
}

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

const normalizeChart = (r: ChartResult): ChartResult => ({
  ...r,
  lines: r.lines.map((l, i) => ({ ...l, color: l.color || getSubjectColor(l.label, i) })),
});

const EMPTY_CHART: ChartResult = { data: [], lines: [], hasRealData: false };

// ── Component ─────────────────────────────────────────────────────────────────
export function TeacherGradeTrend() {
  const navigate = useNavigate();

  const [students, setStudents]   = useState<StudentCard[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [chartMode, setChartMode] = useState<ChartMode>("final");

  const [chartData, setChartData] = useState<ChartResult>(EMPTY_CHART);
  const [chartLoading, setChartLoading] = useState(false);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // 학생 목록 로드
  useEffect(() => {
    const fetch = async () => {
      setStudentsLoading(true);
      try {
        const data = await appGet<StudentCard[]>("/v1/students");
        setStudents(data);
        if (data.length > 0 && data[0]) {
          setSelectedStudentId(data[0].id);
        }
      } catch {
        // 학생 목록 로드 실패
      } finally {
        setStudentsLoading(false);
      }
    };
    void fetch();
  }, []);

  // 학생/모드 변경 시 성적 데이터 로드
  useEffect(() => {
    if (!selectedStudentId) return;

    const fetch = async () => {
      setChartLoading(true);
      try {
        const data = await appGet<ChartResult>(
          `/v1/grades/chart?mode=${chartMode}&studentId=${selectedStudentId}`
        );
        const normalized = normalizeChart(data);
        setChartData(normalized);
        setSelectedSubjects(normalized.lines.map(l => l.dataKey));
      } catch {
        setChartData(EMPTY_CHART);
        setSelectedSubjects([]);
      } finally {
        setChartLoading(false);
      }
    };
    void fetch();
  }, [selectedStudentId, chartMode]);

  const toggleSubject = (key: string) =>
    setSelectedSubjects(prev =>
      prev.includes(key)
        ? prev.length > 1 ? prev.filter(s => s !== key) : prev
        : [...prev, key]
    );

  const currentStudent = students.find(s => s.id === selectedStudentId);
  const config = CHART_MODE_CONFIG[chartMode];
  const subjectLines = chartData.lines.map(l => ({
    ...l,
    hidden: !selectedSubjects.includes(l.dataKey),
  }));

  return (
    <div>
      <Breadcrumb items={[{ label: "학생 관리" }, { label: "학생 성적 추이" }]} />
      <PageTitle
        title="학생 성적 추이"
        subtitle={
          currentStudent
            ? `${currentStudent.name} 학생의 과목별 성적 흐름을 확인하세요.`
            : "학생을 선택하면 성적 흐름을 확인할 수 있습니다."
        }
        action={
          studentsLoading ? null : (
            <div className="relative">
              <select
                className="h-9 pl-3.5 pr-8 rounded-xl border border-border bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
                value={selectedStudentId}
                onChange={e => {
                  setSelectedStudentId(e.target.value);
                  setChartMode("final");
                }}
              >
                {students.length === 0 && (
                  <option value="">학생 없음</option>
                )}
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          )
        }
      />

      {/* 학생 목록 로드 중 */}
      {studentsLoading && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">학생 목록을 불러오고 있습니다...</p>
        </div>
      )}

      {/* 학생 없음 */}
      {!studentsLoading && students.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <Info className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">연결된 학생이 없습니다.</p>
        </div>
      )}

      {/* 학생 선택 뷰 */}
      {!studentsLoading && currentStudent && (
        <>
          {/* 학생 정보 배너 */}
          <div className="bg-card rounded-xl border border-border p-4 mb-5 flex flex-wrap items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{currentStudent.name}</span>
                <span className="text-xs text-muted-foreground">{currentStudent.grade} · {currentStudent.track}</span>
                {currentStudent.gpa !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gradeBadge(currentStudent.gpa)}`}>
                    GPA {currentStudent.gpa}등급
                  </span>
                )}
              </div>
              {currentStudent.goal && (
                <p className="text-xs text-muted-foreground mt-0.5">{currentStudent.goal}</p>
              )}
            </div>
            <button
              onClick={() => navigate(`/teacher/students/${currentStudent.id}`)}
              className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
            >
              학생 상세 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 차트 데이터 없음 안내 */}
          {!chartLoading && !chartData.hasRealData && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {config.noDataMsg} 학생이 성적을 입력하면 자동 반영됩니다.
              </p>
            </div>
          )}

          {/* 차트 모드 선택 */}
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

          {/* 로딩 중 */}
          {chartLoading && (
            <div className="bg-card rounded-xl border border-border p-8 text-center mb-5">
              <p className="text-sm text-muted-foreground">성적 데이터를 불러오고 있습니다...</p>
            </div>
          )}

          {!chartLoading && (
            <>
              {/* 과목 필터 pills */}
              {chartData.lines.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {chartData.lines.map(line => (
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
              )}

              {/* 차트 */}
              {chartData.data.length > 0 && (
                <ChartCard
                  title={config.chartTitle}
                  subtitle={`${currentStudent.name} · ${config.chartSubtitle}`}
                  data={chartData.data}
                  xKey="period"
                  lines={subjectLines}
                  height={320}
                  reversed={config.reversed}
                  className="mb-5"
                />
              )}

              {/* 데이터 테이블 */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-foreground">
                      {chartMode === "final" ? "학기 최종 성적 데이터" :
                       chartMode === "exam"  ? "시험 점수 데이터" : "모의고사 데이터"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentStudent.name} · {config.chartSubtitle}
                    </p>
                  </div>
                  {chartData.hasRealData ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                      실제 데이터
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                      데이터 없음
                    </span>
                  )}
                </div>

                {chartData.data.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-muted-foreground">아직 입력된 성적이 없습니다.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">구분</th>
                          {chartData.lines
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
                        {chartData.data.map((row, rowIdx) => {
                          const visLines = chartData.lines.filter(l => selectedSubjects.includes(l.dataKey));
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
                )}
                <div className="px-5 py-3 border-t border-border bg-secondary/20">
                  <p className="text-xs text-muted-foreground">
                    💡 학생이 성적 입력에서 저장한 데이터가 탭별로 실시간 반영됩니다.
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
