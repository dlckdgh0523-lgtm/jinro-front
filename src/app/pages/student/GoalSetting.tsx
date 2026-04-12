import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { UNIVERSITIES, DEPARTMENTS_BY_FIELD } from "../../data/mock";
import { Search, Save, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";

// ── localStorage 유틸 ─────────────────────────────────────────────────────────
const GOAL_KEY = "jinro_student_goal";
const TEACHER_ALERT_KEY = "jinro_teacher_goal_alerts";

interface SavedGoal {
  university: string;
  department: string;
  field: string;
  targetGrade: string;
  targetScore: string;
  savedAt: string;
  changeCount: number;
}

function loadGoal(): SavedGoal | null {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    return raw ? (JSON.parse(raw) as SavedGoal) : null;
  } catch {
    return null;
  }
}

function pushTeacherAlert(msg: { title: string; body: string }) {
  try {
    const existing = JSON.parse(localStorage.getItem(TEACHER_ALERT_KEY) || "[]");
    existing.unshift({
      id: Date.now(),
      type: "info",
      category: "진로",
      title: msg.title,
      body: msg.body,
      time: "방금",
      read: false,
      fromStudent: true,
    });
    localStorage.setItem(TEACHER_ALERT_KEY, JSON.stringify(existing));
  } catch {}
}

// ── Component ─────────────────────────────────────────────────────────────────
export function GoalSetting() {
  const navigate = useNavigate();

  // 이전 저장 데이터 복원
  const prev = loadGoal();

  const [univSearch, setUnivSearch]   = useState(prev?.university ?? "서울대학교");
  const [showUnivDrop, setShowUnivDrop] = useState(false);
  const [selectedUniv, setSelectedUniv] = useState(prev?.university ?? "서울대학교");
  const [selectedField, setSelectedField] = useState(prev?.field ?? "AI·소프트웨어");
  const [selectedDept, setSelectedDept]   = useState(prev?.department ?? "컴퓨터공학과");
  const [targetGrade, setTargetGrade] = useState(prev?.targetGrade ?? "1.5");
  const [targetScore, setTargetScore] = useState(prev?.targetScore ?? "310");
  const [saveStatus, setSaveStatus]   = useState<"idle" | "saved" | "changed">("idle");
  const [prevGoal, setPrevGoal] = useState<SavedGoal | null>(prev);

  const filteredUnivs = UNIVERSITIES.filter(
    (u) => u.includes(univSearch) && univSearch.length > 0 && u !== univSearch
  );
  const fields = Object.keys(DEPARTMENTS_BY_FIELD);
  const depts  = DEPARTMENTS_BY_FIELD[selectedField] || [];

  // 현재 목표가 이전과 달라졌는지 감지
  const isChanged =
    prevGoal !== null &&
    (prevGoal.university !== selectedUniv ||
     prevGoal.department !== selectedDept ||
     prevGoal.targetGrade !== targetGrade ||
     prevGoal.targetScore !== targetScore);

  const handleSave = () => {
    if (!selectedUniv || !selectedDept) return;

    const changeCount = (prevGoal?.changeCount ?? 0) + (prevGoal ? 1 : 0);
    const isFirstSave = !prevGoal;

    const goalData: SavedGoal = {
      university: selectedUniv,
      department: selectedDept,
      field: selectedField,
      targetGrade,
      targetScore,
      savedAt: new Date().toISOString(),
      changeCount,
    };

    localStorage.setItem(GOAL_KEY, JSON.stringify(goalData));
    setPrevGoal(goalData);

    // 담임 교사에게 알림 전송 (localStorage 큐)
    const alertTitle = isFirstSave
      ? "김민준 학생 진로 목표 설정"
      : `김민준 학생 진로 목표 변경 (${changeCount}번째)`;
    const alertBody = isFirstSave
      ? `김민준 학생이 목표를 ${selectedUniv} ${selectedDept}로 설정했습니다. 목표 내신 ${targetGrade}등급 / 수능 ${targetScore}점.`
      : `김민준 학생이 목표를 ${selectedUniv} ${selectedDept}로 변경했습니다. 이전 목표: ${prevGoal?.university} ${prevGoal?.department}`;
    pushTeacherAlert({ title: alertTitle, body: alertBody });

    setSaveStatus(isFirstSave ? "saved" : "changed");
    setTimeout(() => setSaveStatus("idle"), 4000);
  };

  const handleReset = () => {
    // 진로를 처음부터 다시 설정 (목표 초기화)
    if (!window.confirm("목표를 초기화하시겠습니까?")) return;
    localStorage.removeItem(GOAL_KEY);
    setPrevGoal(null);
    setSelectedUniv(""); setUnivSearch("");
    setSelectedDept(""); setSelectedField(fields[0]);
    setTargetGrade(""); setTargetScore("");
    setSaveStatus("idle");
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "진로 / 입시" }, { label: "목표 설정" }]} />
      <PageTitle
        title="목표 설정"
        subtitle="목표 대학과 학과를 설정하고 입시 데이터를 비교해보세요. 저장 시 담임 선생님께 즉시 알림이 전달됩니다."
        action={
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              title="목표 초기화"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate("/student/career/admissions")}
              className="flex items-center gap-1.5 px-4 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              입시 데이터 비교
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedUniv || !selectedDept}
              className={`flex items-center gap-2 px-4 h-9 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                saveStatus !== "idle"
                  ? "bg-emerald-500 text-white"
                  : isChanged
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {saveStatus === "saved" ? (
                <><CheckCircle className="w-3.5 h-3.5" /> 저장 완료!</>
              ) : saveStatus === "changed" ? (
                <><CheckCircle className="w-3.5 h-3.5" /> 변경 저장됨</>
              ) : isChanged ? (
                <><Save className="w-3.5 h-3.5" /> 변경사항 저장</>
              ) : (
                <><Save className="w-3.5 h-3.5" /> 목표 저장</>
              )}
            </button>
          </div>
        }
      />

      {/* 저장 완료 배너 */}
      {saveStatus !== "idle" && (
        <div className={`rounded-xl border p-4 mb-5 flex items-start gap-3 ${
          saveStatus === "changed"
            ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700"
            : "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-700"
        }`}>
          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${saveStatus === "changed" ? "text-amber-500" : "text-emerald-500"}`} />
          <div>
            <p className={`text-sm font-medium ${saveStatus === "changed" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>
              {saveStatus === "changed" ? "목표가 변경 저장되었습니다." : "목표가 저장되었습니다."}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              담임 선생님께 알림이 전달되었습니다. 목표는 언제든지 변경할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 이전 목표 변경 이력 */}
      {prevGoal && prevGoal.changeCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl p-3 mb-5 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            이 목표는 {prevGoal.changeCount}번 변경되었습니다.
            최종 저장: {new Date(prevGoal.savedAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {/* University selector */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-foreground mb-4">목표 대학 설정</h3>
          <div className="relative mb-4">
            <label className="text-xs text-muted-foreground block mb-1.5">대학 검색</label>
            <div className="relative">
              <input
                className="w-full h-11 px-3.5 pr-10 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                value={univSearch}
                onChange={(e) => { setUnivSearch(e.target.value); setShowUnivDrop(true); }}
                onFocus={() => setShowUnivDrop(true)}
                onBlur={() => setTimeout(() => setShowUnivDrop(false), 150)}
                placeholder="대학명으로 검색"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {showUnivDrop && filteredUnivs.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredUnivs.map((u) => (
                  <button
                    key={u}
                    className="w-full text-left px-3.5 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                    onClick={() => { setSelectedUniv(u); setUnivSearch(u); setShowUnivDrop(false); }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedUniv && (
            <div className="bg-secondary/40 rounded-xl p-4 border border-border mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{selectedUniv}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">목표 대학 선택됨</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full">목표 대학</span>
                  {isChanged && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full">변경됨</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">목표 내신 등급</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" step="0.1" min="1" max="9"
                  className="w-24 h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">등급</span>
                <span className="text-xs text-muted-foreground ml-2">현재: 1.8등급</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">목표 수능 점수</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-24 h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">점</span>
                <span className="text-xs text-muted-foreground ml-2">현재: 280점</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department selector */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-foreground mb-4">목표 학과 설정</h3>
          <div className="mb-3">
            <label className="text-xs text-muted-foreground block mb-1.5">계열 선택</label>
            <div className="flex flex-wrap gap-2">
              {fields.map((f) => (
                <button
                  key={f}
                  onClick={() => { setSelectedField(f); setSelectedDept(""); }}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    selectedField === f
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {depts.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm border transition-colors ${
                  selectedDept === dept
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-foreground hover:bg-secondary/60"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary + CTA */}
      {selectedUniv && selectedDept && (
        <div className="mt-5 bg-secondary/40 rounded-xl border border-border p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                설정된 목표
                {prevGoal && <span className="ml-2 text-xs text-primary">✓ 저장됨</span>}
              </p>
              <p className="font-medium text-foreground">{selectedUniv} · {selectedDept}</p>
              <p className="text-xs text-muted-foreground mt-1">
                목표 내신 {targetGrade}등급 · 목표 수능 {targetScore}점
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={!selectedUniv || !selectedDept}
                className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> 저장
              </button>
              <button
                onClick={() => navigate("/student/career/recommendation")}
                className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                대학·학과 추천 보기 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
