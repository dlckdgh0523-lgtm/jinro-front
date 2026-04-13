// ── 성적 차트 공통 타입 및 설정 ──────────────────────────────────────────────────
// 실제 데이터는 API(/v1/grades/chart, /v1/growth-report)에서 로드합니다.

const SUBJECT_COLORS: Record<string, string> = {
  "국어":      "#C5614A",
  "수학":      "#8FB8A8",
  "영어":      "#E8A598",
  "한국사":    "#A8C4B8",
  "과학":      "#80C0C8",
  "물리학Ⅰ":  "#A8B4E8",
  "화학Ⅰ":    "#F0B870",
  "생명과학Ⅰ": "#C8A8E8",
  "지구과학Ⅰ": "#E8D0A0",
  "사회문화":  "#B8E0A8",
  "한국지리":  "#D8B4F8",
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

// ── 차트 모드 설정 (공통) ──────────────────────────────────────────────────────
export type ChartMode = "final" | "exam" | "practice";

export const CHART_MODE_TABS: { key: ChartMode; label: string }[] = [
  { key: "final",    label: "학기 최종 성적" },
  { key: "exam",     label: "중간/기말 시험" },
  { key: "practice", label: "모의고사" },
];

export const CHART_MODE_CONFIG: Record<ChartMode, {
  chartTitle:    string;
  chartSubtitle: string;
  reversed:      boolean;
  valueUnit:     string;
  noDataMsg:     string;
  noDataHint:    string;
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
