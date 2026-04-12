// ── 공통 성적 데이터 로딩 유틸리티 ─────────────────────────────────────────────
// GradeInput에서 저장한 localStorage 데이터를 차트용으로 변환

export const GRADE_SAVE_KEY = "jinro_grade_data";

const SUBJECT_COLORS: Record<string, string> = {
  "국어":     "#C5614A",
  "수학":     "#8FB8A8",
  "영어":     "#E8A598",
  "한국사":   "#A8C4B8",
  "과학":     "#80C0C8",
  "물리학Ⅰ": "#A8B4E8",
  "화학Ⅰ":   "#F0B870",
  "생명과학Ⅰ":"#C8A8E8",
  "지구과학Ⅰ":"#E8D0A0",
  "사회문화": "#B8E0A8",
  "한국지리": "#D8B4F8",
};
const FALLBACK_COLORS = ["#F8C4A0", "#A0D8F8", "#F8A0B8", "#C0F8A0", "#A0B8F8"];

export function getSubjectColor(name: string, idx: number): string {
  return SUBJECT_COLORS[name] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

export interface SubjectLine { dataKey: string; label: string; color: string; }
export interface ChartResult {
  data:        Record<string, string | number>[];
  lines:       SubjectLine[];
  hasRealData: boolean;
}
export interface SummaryStats {
  avgFinalGrade: number | null;
  bestSubject:   { name: string; grade: number } | null;
  worstSubject:  { name: string; grade: number } | null;
  latestSubjects: { name: string; finalGrade: string; credit: string }[];
  hasRealData:   boolean;
}

// ── 샘플 폴백 데이터 ───────────────────────────────────────────────────────────
const MOCK_FINAL: Record<string, string | number>[] = [
  { period: "2024 1학기", 국어: 2.1, 수학: 1.7, 영어: 3.2, 과학: 2.5 },
  { period: "2024 2학기", 국어: 1.9, 수학: 1.5, 영어: 3.0, 과학: 2.3 },
  { period: "2025 1학기", 국어: 1.8, 수학: 1.4, 영어: 2.7, 과학: 2.1 },
  { period: "2025 2학기", 국어: 1.7, 수학: 1.3, 영어: 2.5, 과학: 1.9 },
];
const MOCK_EXAM: Record<string, string | number>[] = [
  { period: "2025 1학기 중간", 국어: 82, 수학: 91, 영어: 73 },
  { period: "2025 1학기 기말", 국어: 85, 수학: 94, 영어: 76 },
  { period: "2025 2학기 중간", 국어: 88, 수학: 93, 영어: 79 },
  { period: "2025 2학기 기말", 국어: 90, 수학: 95, 영어: 81 },
];
const MOCK_PRACTICE: Record<string, string | number>[] = [
  { period: "2024 6월 모의", 국어: 2, 수학: 1, 영어: 3 },
  { period: "2024 9월 모의", 국어: 2, 수학: 1, 영어: 3 },
  { period: "2025 3월 모의", 국어: 2, 수학: 1, 영어: 3 },
  { period: "2025 6월 모의", 국어: 2, 수학: 1, 영어: 2 },
];

const DEFAULT_NAMES_FINAL    = ["국어", "수학", "영어", "과학"];
const DEFAULT_NAMES_EXAM     = ["국어", "수학", "영어"];
const DEFAULT_NAMES_PRACTICE = ["국어", "수학", "영어"];

function makeLines(names: string[]): SubjectLine[] {
  return names.map((n, i) => ({ dataKey: n, label: n, color: getSubjectColor(n, i) }));
}

function parseAll(): Record<string, any> {
  try {
    const raw = localStorage.getItem(GRADE_SAVE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

// ── 학기 최종 성적 차트 데이터 ──────────────────────────────────────────────────
export function loadFinalGradeChartData(): ChartResult {
  const all  = parseAll();
  const keys = Object.keys(all).filter(k => k.endsWith("_학기최종")).sort();
  if (!keys.length) return { data: MOCK_FINAL, lines: makeLines(DEFAULT_NAMES_FINAL), hasRealData: false };

  const subjectIdx = new Map<string, number>();
  const rows: Record<string, string | number>[] = [];

  for (const k of keys) {
    const e      = all[k];
    const period = (e.semester as string) ?? k.replace("_학기최종", "");
    const row: Record<string, string | number> = { period };
    for (const s of (e.subjects ?? [])) {
      if (s.name && s.finalGrade) {
        const g = parseFloat(s.finalGrade);
        if (!isNaN(g) && g > 0) {
          row[s.name] = g;
          if (!subjectIdx.has(s.name)) subjectIdx.set(s.name, subjectIdx.size);
        }
      }
    }
    rows.push(row);
  }

  const lines = Array.from(subjectIdx.entries())
    .map(([n, i]) => ({ dataKey: n, label: n, color: getSubjectColor(n, i) }));
  if (!lines.length) return { data: MOCK_FINAL, lines: makeLines(DEFAULT_NAMES_FINAL), hasRealData: false };
  return { data: rows, lines, hasRealData: true };
}

// ── 중간/기말 시험 점수 차트 데이터 ────────────────────────────────────────────
export function loadExamScoreChartData(): ChartResult {
  const all  = parseAll();
  const keys = Object.keys(all).filter(k => k.endsWith("_중간") || k.endsWith("_기말")).sort();
  if (!keys.length) return { data: MOCK_EXAM, lines: makeLines(DEFAULT_NAMES_EXAM), hasRealData: false };

  const subjectIdx = new Map<string, number>();
  const rows: Record<string, string | number>[] = [];

  for (const k of keys) {
    const e      = all[k];
    const suffix = k.endsWith("_중간") ? "중간" : "기말";
    const period = `${(e.semester as string) ?? ""} ${suffix}`.trim();
    const row: Record<string, string | number> = { period };
    for (const s of (e.subjects ?? [])) {
      if (s.name && s.score) {
        const sc = parseFloat(s.score);
        if (!isNaN(sc)) {
          row[s.name] = sc;
          if (!subjectIdx.has(s.name)) subjectIdx.set(s.name, subjectIdx.size);
        }
      }
    }
    rows.push(row);
  }

  const lines = Array.from(subjectIdx.entries())
    .map(([n, i]) => ({ dataKey: n, label: n, color: getSubjectColor(n, i) }));
  if (!lines.length) return { data: MOCK_EXAM, lines: makeLines(DEFAULT_NAMES_EXAM), hasRealData: false };
  return { data: rows, lines, hasRealData: true };
}

// ── 모의고사 등급 차트 데이터 ───────────────────────────────────────────────────
export function loadPracticeChartData(): ChartResult {
  const all  = parseAll();
  const keys = Object.keys(all).filter(k => k.endsWith("_모의")).sort();
  if (!keys.length) return { data: MOCK_PRACTICE, lines: makeLines(DEFAULT_NAMES_PRACTICE), hasRealData: false };

  const subjectIdx = new Map<string, number>();
  const rows: Record<string, string | number>[] = [];

  for (const k of keys) {
    const e      = all[k];
    const period = `${(e.semester as string) ?? ""} 모의`.trim();
    const row: Record<string, string | number> = { period };
    for (const s of (e.subjects ?? [])) {
      if (s.name && s.grade) {
        const g = parseFloat(s.grade);
        if (!isNaN(g) && g > 0) {
          row[s.name] = g;
          if (!subjectIdx.has(s.name)) subjectIdx.set(s.name, subjectIdx.size);
        }
      }
    }
    rows.push(row);
  }

  const lines = Array.from(subjectIdx.entries())
    .map(([n, i]) => ({ dataKey: n, label: n, color: getSubjectColor(n, i) }));
  if (!lines.length) return { data: MOCK_PRACTICE, lines: makeLines(DEFAULT_NAMES_PRACTICE), hasRealData: false };
  return { data: rows, lines, hasRealData: true };
}

// ── 성적 요약 통계 ─────────────────────────────────────────────────────────────
export function loadGradeSummaryStats(): SummaryStats {
  const all  = parseAll();
  const keys = Object.keys(all).filter(k => k.endsWith("_학기최종")).sort();

  if (!keys.length) {
    return {
      avgFinalGrade: 1.8,
      bestSubject:   { name: "수학", grade: 1.3 },
      worstSubject:  { name: "영어", grade: 2.5 },
      latestSubjects: [],
      hasRealData:   false,
    };
  }

  const latest  = all[keys[keys.length - 1]];
  const subs    = (latest.subjects ?? []) as { name: string; finalGrade: string; credit: string }[];
  const graded  = subs.filter(s => s.name && s.finalGrade && parseFloat(s.finalGrade) > 0);

  if (!graded.length) {
    return { avgFinalGrade: null, bestSubject: null, worstSubject: null, latestSubjects: [], hasRealData: false };
  }

  const grades = graded.map(s => ({ name: s.name, grade: parseFloat(s.finalGrade) }));
  const avg    = grades.reduce((a, b) => a + b.grade, 0) / grades.length;
  const best   = grades.reduce((a, b) => a.grade < b.grade ? a : b);
  const worst  = grades.reduce((a, b) => a.grade > b.grade ? a : b);

  return {
    avgFinalGrade:  Math.round(avg * 100) / 100,
    bestSubject:    best,
    worstSubject:   worst,
    latestSubjects: graded,
    hasRealData:    true,
  };
}

// ── 차트 모드 설정 (공통) ──────────────────────────────────────────────────────
export type ChartMode = "final" | "exam" | "practice";

export const CHART_MODE_TABS: { key: ChartMode; label: string }[] = [
  { key: "final",    label: "학기 최종 성적" },
  { key: "exam",     label: "중간/기말 시험" },
  { key: "practice", label: "모의고사" },
];

export const CHART_MODE_CONFIG: Record<ChartMode, {
  chartTitle:   string;
  chartSubtitle: string;
  reversed:     boolean;
  valueUnit:    string;
  noDataMsg:    string;
  noDataHint:   string;
}> = {
  final: {
    chartTitle:    "학기 최종 성적 변화 추이",
    chartSubtitle: "학기별 확정 내신 등급 변화 · 등급 수치가 낮을수록 성적이 높습니다",
    reversed:      true,
    valueUnit:     "등급",
    noDataMsg:     "학기 최종 성적이 아직 입력되지 않았습니다.",
    noDataHint:    "성적 입력 → 학기 최종 성적 탭에서 등급을 저장하세요.",
  },
  exam: {
    chartTitle:    "중간/기말 시험 성적 추이",
    chartSubtitle: "시험별 과목 점수 변화 · 높을수록 높은 점수",
    reversed:      false,
    valueUnit:     "점",
    noDataMsg:     "중간/기말 시험 성적이 아직 입력되지 않았습니다.",
    noDataHint:    "성적 입력 → 중간고사/기말고사 탭에서 점수를 저장하세요.",
  },
  practice: {
    chartTitle:    "모의고사 변화 추이",
    chartSubtitle: "모의고사별 등급 변화 · 등급 수치가 낮을수록 성적이 높습니다",
    reversed:      true,
    valueUnit:     "등급",
    noDataMsg:     "모의고사 성적이 아직 입력되지 않았습니다.",
    noDataHint:    "성적 입력 → 모의고사 탭에서 점수와 등급을 저장하세요.",
  },
};
