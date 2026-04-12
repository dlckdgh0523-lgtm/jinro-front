import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { Plus, X, ChevronDown, Save, CheckCircle } from "lucide-react";

// ── 상수 ─────────────────────────────────────────────────────────────────────
const EXAM_TABS = ["중간고사", "기말고사", "학기 최종 성적", "모의고사"] as const;
type TabType = typeof EXAM_TABS[number];

const SEMESTERS = ["2025년 1학기", "2025년 2학기", "2026년 1학기"];

const SUNEUNG_SUBJECTS = [
  "국어", "수학", "영어", "한국사",
  "물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "사회문화", "한국지리",
];

// ── 타입 ─────────────────────────────────────────────────────────────────────
type ExamStatus = "미입력" | "점수 입력 완료" | "확인 완료";

interface ExamSubject {
  id: number; name: string; score: string; status: ExamStatus; memo: string;
}
interface FinalSubject {
  id: number; name: string; finalGrade: string; credit: string; applied: boolean;
}
interface PracticeSubject {
  id: number; name: string; score: string; grade: string;
}

// ── 초기 데이터 ───────────────────────────────────────────────────────────────
const INIT_EXAM = (): ExamSubject[] => [
  { id: 1, name: "국어",   score: "", status: "미입력", memo: "" },
  { id: 2, name: "수학",   score: "", status: "미입력", memo: "" },
  { id: 3, name: "영어",   score: "", status: "미입력", memo: "" },
  { id: 4, name: "한국사", score: "", status: "미입력", memo: "" },
];
const INIT_FINAL = (): FinalSubject[] => [
  { id: 1, name: "국어",   finalGrade: "", credit: "4", applied: false },
  { id: 2, name: "수학",   finalGrade: "", credit: "4", applied: false },
  { id: 3, name: "영어",   finalGrade: "", credit: "4", applied: false },
  { id: 4, name: "한국사", finalGrade: "", credit: "2", applied: false },
];
const INIT_PRACTICE = (): PracticeSubject[] => [
  { id: 1, name: "국어",   score: "", grade: "" },
  { id: 2, name: "수학",   score: "", grade: "" },
  { id: 3, name: "영어",   score: "", grade: "" },
  { id: 4, name: "한국사", score: "", grade: "" },
];

// ── 상태 배지 스타일 ───────────────────────────────────────────────────────────
const EXAM_STATUS_STYLE: Record<ExamStatus, string> = {
  "미입력":         "bg-muted text-muted-foreground",
  "점수 입력 완료": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "확인 완료":      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

// ── localStorage 키 ───────────────────────────────────────────────────────────
const GRADE_SAVE_KEY     = "jinro_grade_data";
const CUSTOM_SUBJECTS_KEY = "jinro_custom_subjects";
const DEFAULT_NAMES       = ["국어", "수학", "영어", "한국사", "과학"];

// ── Component ─────────────────────────────────────────────────────────────────
export function GradeInput() {
  const [activeTab, setActiveTab] = useState<TabType>("중간고사");
  const [semester, setSemester]   = useState("2026년 1학기");

  // 탭별 별개 상태
  const [midSubjects,  setMidSubjects]  = useState<ExamSubject[]>(INIT_EXAM);
  const [endSubjects,  setEndSubjects]  = useState<ExamSubject[]>(INIT_EXAM);
  const [finalSubjects, setFinalSubjects] = useState<FinalSubject[]>(INIT_FINAL);
  const [practiceSubjects, setPracticeSubjects] = useState<PracticeSubject[]>(INIT_PRACTICE);

  const [midNextId,      setMidNextId]      = useState(5);
  const [endNextId,      setEndNextId]      = useState(5);
  const [finalNextId,    setFinalNextId]    = useState(5);
  const [practiceNextId, setPracticeNextId] = useState(5);

  const [selectedSuneung, setSelectedSuneung] = useState<string[]>([
    "국어", "수학", "영어", "한국사", "물리학Ⅰ", "화학Ⅰ",
  ]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success">("idle");
  const [saveError,  setSaveError]  = useState("");

  // ── 공통 헬퍼 ──────────────────────────────────────────────────────────────
  const isExamTab = activeTab === "중간고사" || activeTab === "기말고사";

  // 중간/기말 공통 접근자
  const examSubjects    = activeTab === "기말고사" ? endSubjects    : midSubjects;
  const setExamSubjects = activeTab === "기말고사" ? setEndSubjects : setMidSubjects;
  const examNextId      = activeTab === "기말고사" ? endNextId      : midNextId;
  const setExamNextId   = activeTab === "기말고사" ? setEndNextId   : setMidNextId;

  // ── 시험 탭 핸들러 ──────────────────────────────────────────────────────────
  const addExam = () => {
    setExamSubjects(prev => [...prev, { id: examNextId, name: "", score: "", status: "미입력", memo: "" }]);
    setExamNextId(n => n + 1);
  };
  const removeExam = (id: number) => {
    setExamSubjects(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
  };
  const updateExam = (id: number, field: string, value: string) => {
    setExamSubjects(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, [field]: value } as ExamSubject;
      // 점수 입력 시 상태 자동 업데이트
      if (field === "score") {
        if (!value.trim()) updated.status = "미입력";
        else if (updated.status === "미입력") updated.status = "점수 입력 완료";
      }
      return updated;
    }));
  };
  const cycleExamStatus = (id: number) => {
    setExamSubjects(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (!s.score) return s; // 점수 없으면 상태 변경 불가
      if (s.status === "점수 입력 완료") return { ...s, status: "확인 완료" as ExamStatus };
      if (s.status === "확인 완료")      return { ...s, status: "점수 입력 완료" as ExamStatus };
      return s;
    }));
  };

  // ── 학기 최종 성적 핸들러 ───────────────────────────────────────────────────
  const addFinal = () => {
    setFinalSubjects(prev => [...prev, { id: finalNextId, name: "", finalGrade: "", credit: "3", applied: false }]);
    setFinalNextId(n => n + 1);
  };
  const removeFinal = (id: number) => {
    setFinalSubjects(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
  };
  const updateFinal = (id: number, field: string, value: string) => {
    setFinalSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const toggleApplied = (id: number) => {
    setFinalSubjects(prev => prev.map(s => s.id === id ? { ...s, applied: !s.applied } : s));
  };

  // ── 모의고사 핸들러 ─────────────────────────────────────────────────────────
  const addPractice = () => {
    setPracticeSubjects(prev => [...prev, { id: practiceNextId, name: "", score: "", grade: "" }]);
    setPracticeNextId(n => n + 1);
  };
  const removePractice = (id: number) => {
    setPracticeSubjects(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
  };
  const updatePractice = (id: number, field: string, value: string) => {
    setPracticeSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // ── 수능 과목 토글 ──────────────────────────────────────────────────────────
  const toggleSuneung = (sub: string) => {
    const req = ["국어", "수학", "영어", "한국사"];
    if (req.includes(sub)) return;
    setSelectedSuneung(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  // ── 저장 ───────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (activeTab === "학기 최종 성적") {
      const emptyName = finalSubjects.find(s => !s.name.trim());
      if (emptyName) {
        setSaveError("과목명이 비어 있는 항목이 있습니다.");
        setTimeout(() => setSaveError(""), 4000);
        return;
      }
      // GradeTrend가 읽는 데이터 저장
      const existing = JSON.parse(localStorage.getItem(GRADE_SAVE_KEY) || "{}");
      existing[`${semester}_학기최종`] = {
        semester, examType: "학기 최종 성적",
        subjects: finalSubjects.map(s => ({ name: s.name, finalGrade: s.finalGrade, credit: s.credit, applied: s.applied })),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(GRADE_SAVE_KEY, JSON.stringify(existing));

      // 커스텀 과목 저장 (기본 과목 외)
      const customNames = finalSubjects
        .map(s => s.name.trim())
        .filter(n => n && !DEFAULT_NAMES.includes(n));
      localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(customNames));
    } else {
      // 중간/기말/모의 → 단순 저장 (차트 미영향)
      const existing = JSON.parse(localStorage.getItem(GRADE_SAVE_KEY) || "{}");
      const tabKey = activeTab === "중간고사" ? "중간" : activeTab === "기말고사" ? "기말" : "모의";
      existing[`${semester}_${tabKey}`] = {
        semester, examType: activeTab,
        subjects: activeTab === "모의고사" ? practiceSubjects : examSubjects,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(GRADE_SAVE_KEY, JSON.stringify(existing));
    }
    setSaveError("");
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 4000);
  };

  // ── 요약 계산 ───────────────────────────────────────────────────────────────
  const examScores = examSubjects.map(s => parseFloat(s.score)).filter(v => !isNaN(v) && v > 0);
  const avgScore   = examScores.length ? Math.round(examScores.reduce((a, b) => a + b, 0) / examScores.length) : null;
  const inputDone  = examSubjects.filter(s => s.status !== "미입력").length;

  const finalGrades   = finalSubjects.map(s => parseFloat(s.finalGrade)).filter(v => !isNaN(v) && v > 0);
  const avgFinalGrade = finalGrades.length
    ? (finalGrades.reduce((a, b) => a + b, 0) / finalGrades.length).toFixed(2)
    : null;
  const appliedCount = finalSubjects.filter(s => s.applied).length;

  const practiceGrades = practiceSubjects.map(s => parseFloat(s.grade)).filter(v => !isNaN(v) && v > 0);
  const avgPracticeGrade = practiceGrades.length
    ? (practiceGrades.reduce((a, b) => a + b, 0) / practiceGrades.length).toFixed(2)
    : null;
  const practiceScores = practiceSubjects.map(s => parseFloat(s.score)).filter(v => !isNaN(v) && v > 0);
  const avgPracticeScore = practiceScores.length
    ? Math.round(practiceScores.reduce((a, b) => a + b, 0) / practiceScores.length)
    : null;

  // ── 저장 버튼 label ─────────────────────────────────────────────────────────
  const saveBtnLabel =
    saveStatus === "success" ? "저장 완료!" :
    activeTab === "학기 최종 성적" ? "등급 저장" : "저장하기";

  return (
    <div>
      <Breadcrumb items={[{ label: "학업 관리" }, { label: "성적 입력" }]} />
      <PageTitle
        title="성적 입력"
        subtitle={
          isExamTab
            ? "시험 점수를 입력하세요. 내신 등급은 학기 최종 성적 탭에서 확정 후 입력합니다."
            : activeTab === "학기 최종 성적"
            ? "확정된 내신 등급과 이수단위를 입력하세요. 성적 변화 추이에 반영됩니다."
            : "수능 모의고사 점수와 등급을 입력하세요."
        }
        action={
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 h-9 rounded-xl text-sm transition-colors ${
              saveStatus === "success"
                ? "bg-emerald-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {saveStatus === "success"
              ? <><CheckCircle className="w-3.5 h-3.5" /> {saveBtnLabel}</>
              : <><Save className="w-3.5 h-3.5" /> {saveBtnLabel}</>
            }
          </button>
        }
      />

      {/* 저장 완료 배너 */}
      {saveStatus === "success" && (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 mb-5 flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            {activeTab === "학기 최종 성적"
              ? "학기 최종 성적이 저장되었습니다. 성적 변화 추이 차트에 반영됩니다."
              : `${activeTab} 성적이 저장되었습니다.`}
          </p>
        </div>
      )}
      {saveError && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-5">
          <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
        </div>
      )}

      {/* 탭 컨트롤 */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <select
            className="h-9 pl-3.5 pr-8 rounded-xl border border-border bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
            value={semester}
            onChange={e => setSemester(e.target.value)}
          >
            {SEMESTERS.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        <div className="flex bg-muted/50 rounded-xl p-1 gap-0.5">
          {EXAM_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 h-7 rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── 좌측 메인 카드 ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border overflow-hidden">

            {/* 카드 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="text-foreground">
                  {isExamTab ? "시험 성적 입력" :
                   activeTab === "학기 최종 성적" ? "학기 최종 성적 입력" : "모의고사 성적 입력"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isExamTab
                    ? "시험 점수와 준비 현황을 입력하세요. 내신 등급은 학기 최종 성적에서 따로 관리됩니다."
                    : activeTab === "학기 최종 성적"
                    ? "확정된 내신 등급과 이수단위를 입력하세요. 진로 추천과 성적 변화 추이에 반영됩니다."
                    : "수능 준비 과목의 모의고사 점수와 등급을 입력하세요."}
                </p>
              </div>
              <button
                onClick={
                  isExamTab ? addExam :
                  activeTab === "학기 최종 성적" ? addFinal : addPractice
                }
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> 과목 추가
              </button>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full">

                {/* ── 중간고사 / 기말고사 컬럼 ── */}
                {isExamTab && (
                  <>
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">과목명</th>
                        <th className="text-center px-3 py-3 text-xs text-muted-foreground font-medium">점수</th>
                        <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">상태</th>
                        <th className="text-left px-3 py-3 text-xs text-muted-foreground font-medium">메모</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {examSubjects.map(s => (
                        <tr key={s.id} className="group hover:bg-secondary/20 transition-colors">
                          <td className="px-5 py-3">
                            <input
                              className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50"
                              value={s.name}
                              placeholder="과목명"
                              onChange={e => updateExam(s.id, "name", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              className="w-16 h-8 px-2 text-center bg-input-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 border border-border"
                              value={s.score}
                              placeholder="점수"
                              min={0} max={100}
                              onChange={e => updateExam(s.id, "score", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => cycleExamStatus(s.id)}
                              title={s.score ? "클릭하여 상태 변경" : "점수를 먼저 입력하세요"}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${EXAM_STATUS_STYLE[s.status]} ${s.score ? "cursor-pointer" : "cursor-default"}`}
                            >
                              {s.status}
                            </button>
                          </td>
                          <td className="px-3 py-3">
                            <input
                              className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50"
                              value={s.memo}
                              placeholder="간단히 메모"
                              onChange={e => updateExam(s.id, "memo", e.target.value)}
                            />
                          </td>
                          <td className="pr-3">
                            <button
                              onClick={() => removeExam(s.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* ── 학기 최종 성적 컬럼 ── */}
                {activeTab === "학기 최종 성적" && (
                  <>
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">과목명</th>
                        <th className="text-center px-3 py-3 text-xs text-muted-foreground font-medium">최종 등급</th>
                        <th className="text-center px-3 py-3 text-xs text-muted-foreground font-medium">이수단위</th>
                        <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">반영 상태</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {finalSubjects.map(s => (
                        <tr key={s.id} className="group hover:bg-secondary/20 transition-colors">
                          <td className="px-5 py-3">
                            <input
                              className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50"
                              value={s.name}
                              placeholder="과목명"
                              onChange={e => updateFinal(s.id, "name", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <select
                              className="w-20 h-8 px-1 text-center bg-input-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 border border-border appearance-none cursor-pointer"
                              value={s.finalGrade}
                              onChange={e => updateFinal(s.id, "finalGrade", e.target.value)}
                            >
                              <option value="">-</option>
                              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(g => (
                                <option key={g} value={g}>{g}등급</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              className="w-14 h-8 px-2 text-center bg-input-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 border border-border"
                              value={s.credit}
                              min={1} max={8}
                              onChange={e => updateFinal(s.id, "credit", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleApplied(s.id)}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                                (s.applied || !!s.finalGrade)
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground hover:bg-secondary"
                              }`}
                            >
                              {(s.applied || !!s.finalGrade) ? "반영 완료" : "미반영"}
                            </button>
                          </td>
                          <td className="pr-3">
                            <button
                              onClick={() => removeFinal(s.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* ── 모의고사 컬럼 ── */}
                {activeTab === "모의고사" && (
                  <>
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">과목명</th>
                        <th className="text-center px-3 py-3 text-xs text-muted-foreground font-medium">점수</th>
                        <th className="text-center px-3 py-3 text-xs text-muted-foreground font-medium">등급</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {practiceSubjects.map(s => (
                        <tr key={s.id} className="group hover:bg-secondary/20 transition-colors">
                          <td className="px-5 py-3">
                            <input
                              className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50"
                              value={s.name}
                              placeholder="과목명"
                              onChange={e => updatePractice(s.id, "name", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              className="w-16 h-8 px-2 text-center bg-input-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 border border-border"
                              value={s.score}
                              placeholder="점수"
                              min={0} max={100}
                              onChange={e => updatePractice(s.id, "score", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <select
                              className="w-20 h-8 px-1 text-center bg-input-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 border border-border appearance-none cursor-pointer"
                              value={s.grade}
                              onChange={e => updatePractice(s.id, "grade", e.target.value)}
                            >
                              <option value="">-</option>
                              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(g => (
                                <option key={g} value={g}>{g}등급</option>
                              ))}
                            </select>
                          </td>
                          <td className="pr-3">
                            <button
                              onClick={() => removePractice(s.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>

            {/* 테이블 하단 요약 */}
            <div className="px-5 py-3 border-t border-border bg-secondary/20 flex justify-between items-center">
              {isExamTab && (
                <>
                  <span className="text-xs text-muted-foreground">{examSubjects.length}개 과목</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      입력 완료 <strong className="text-foreground">{inputDone}과목</strong>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      평균 점수 <strong className="text-foreground">{avgScore != null ? `${avgScore}점` : "-"}</strong>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      미입력 <strong className="text-foreground">{examSubjects.filter(s => s.status === "미입력").length}과목</strong>
                    </span>
                  </div>
                </>
              )}
              {activeTab === "학기 최종 성적" && (
                <>
                  <span className="text-xs text-muted-foreground">{finalSubjects.length}개 과목</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      평균 등급 <strong className="text-foreground">{avgFinalGrade ? `${avgFinalGrade}등급` : "-"}</strong>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      반영 완료 <strong className="text-foreground">{appliedCount}과목</strong>
                    </span>
                  </div>
                </>
              )}
              {activeTab === "모의고사" && (
                <>
                  <span className="text-xs text-muted-foreground">{practiceSubjects.length}개 과목</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      평균 점수 <strong className="text-foreground">{avgPracticeScore != null ? `${avgPracticeScore}점` : "-"}</strong>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      평균 등급 <strong className="text-foreground">{avgPracticeGrade ? `${avgPracticeGrade}등급` : "-"}</strong>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── 우측 사이드 카드 ───────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Card 1: 수능 준비 과목 선택 — 항상 표시, 모의고사 탭에서 가장 자연스러움 */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-1">수능 준비 과목 선택</h3>
            <p className="text-xs text-muted-foreground mb-3">
              {activeTab === "모의고사"
                ? "아래 과목이 모의고사 입력 대상입니다."
                : "탐구 과목은 최대 2개 선택"}
            </p>
            <div className="flex flex-wrap gap-2">
              {SUNEUNG_SUBJECTS.map(sub => {
                const required = ["국어", "수학", "영어", "한국사"].includes(sub);
                const sel = selectedSuneung.includes(sub);
                return (
                  <button
                    key={sub}
                    onClick={() => toggleSuneung(sub)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                      sel
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    } ${required ? "cursor-default" : ""}`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: 탭별 과목 요약 */}
          <div className="bg-secondary/40 rounded-xl border border-border p-5">
            {isExamTab && (
              <>
                <h3 className="text-foreground mb-3">시험 입력 과목 요약</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {examSubjects.filter(s => s.name).map(s => (
                    <span
                      key={s.id}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        s.status === "확인 완료"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200"
                          : s.status === "점수 입력 완료"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  총 {examSubjects.length}과목 · 점수 입력 {inputDone}과목
                </p>
              </>
            )}
            {activeTab === "학기 최종 성적" && (
              <>
                <h3 className="text-foreground mb-3">최종 등급 요약</h3>
                <div className="space-y-1.5 mb-3">
                  {finalSubjects.filter(s => s.name && s.finalGrade).map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{s.name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        parseFloat(s.finalGrade) <= 1.5
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : parseFloat(s.finalGrade) <= 3
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {s.finalGrade}등급
                      </span>
                    </div>
                  ))}
                  {finalSubjects.filter(s => s.name && s.finalGrade).length === 0 && (
                    <p className="text-xs text-muted-foreground">아직 등급이 입력되지 않았습니다.</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  반영 완료 {appliedCount}/{finalSubjects.length}과목
                </p>
              </>
            )}
            {activeTab === "모의고사" && (
              <>
                <h3 className="text-foreground mb-3">선택한 과목 요약</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSuneung.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">총 {selectedSuneung.length}과목 선택</p>
              </>
            )}
          </div>

          {/* Card 3: 학업 프로필 요약 — 탭별 적응 */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">학업 프로필 요약</h3>
            <div className="space-y-2.5">
              {isExamTab && [
                { label: "입력한 과목",    value: `${examSubjects.length}개` },
                { label: "점수 입력 완료", value: `${inputDone}과목` },
                { label: "미입력",         value: `${examSubjects.filter(s => s.status === "미입력").length}과목` },
                { label: "평균 점수",      value: avgScore != null ? `${avgScore}점` : "미입력" },
                { label: "저장 상태",      value: saveStatus === "success" ? "✓ 저장됨" : "미저장" },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-medium ${
                    item.label === "저장 상태" && item.value === "✓ 저장됨"
                      ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  }`}>{item.value}</span>
                </div>
              ))}
              {activeTab === "학기 최종 성적" && [
                { label: "입력한 과목",  value: `${finalSubjects.length}개` },
                { label: "평균 등급",    value: avgFinalGrade ? `${avgFinalGrade}등급` : "미입력" },
                { label: "반영 완료",    value: `${appliedCount}과목` },
                { label: "수능 준비",    value: `${selectedSuneung.length}개 과목` },
                { label: "저장 상태",    value: saveStatus === "success" ? "✓ 저장됨" : "미저장" },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-medium ${
                    item.label === "저장 상태" && item.value === "✓ 저장됨"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : item.label === "평균 등급" && avgFinalGrade
                      ? parseFloat(avgFinalGrade) <= 2 ? "text-emerald-600 dark:text-emerald-400"
                        : parseFloat(avgFinalGrade) <= 3.5 ? "text-amber-600 dark:text-amber-400"
                        : "text-red-500"
                      : "text-foreground"
                  }`}>{item.value}</span>
                </div>
              ))}
              {activeTab === "모의고사" && [
                { label: "입력한 과목",   value: `${practiceSubjects.length}개` },
                { label: "등급 입력 완료", value: `${practiceSubjects.filter(s => s.grade).length}과목` },
                { label: "평균 점수",     value: avgPracticeScore != null ? `${avgPracticeScore}점` : "미입력" },
                { label: "평균 등급",     value: avgPracticeGrade ? `${avgPracticeGrade}등급` : "미입력" },
                { label: "저장 상태",     value: saveStatus === "success" ? "✓ 저장됨" : "미저장" },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-medium ${
                    item.label === "저장 상태" && item.value === "✓ 저장됨"
                      ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  }`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}