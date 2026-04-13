import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { Search, Save, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { appDelete, appGet, appPut } from "../../utils/appApi";

type SavedGoal = {
  university: string;
  department: string;
  field: string;
  targetGrade: string;
  targetScore: string;
  savedAt: string;
  changeCount: number;
};

export function GoalSetting() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<string[]>([]);
  const [departmentsByField, setDepartmentsByField] = useState<Record<string, string[]>>({});
  const [univSearch, setUnivSearch] = useState("");
  const [showUnivDrop, setShowUnivDrop] = useState(false);
  const [selectedUniv, setSelectedUniv] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [targetGrade, setTargetGrade] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "changed">("idle");
  const [prevGoal, setPrevGoal] = useState<SavedGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fields = useMemo(() => Object.keys(departmentsByField), [departmentsByField]);
  const depts = departmentsByField[selectedField] || [];

  useEffect(() => {
    let active = true;

    const loadGoalData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // 1. 대학 목록 조회 (기본 지역: 서울)
        const universities = await appGet<string[]>("/v1/goals/universities?region=서울");
        
        // 2. 기존 목표 조회
        const currentGoal = await appGet<SavedGoal | null>("/v1/goals/current");

        if (!active) {
          return;
        }

        setUniversities(universities);
        // 임시: 학과는 빈 상태로 초기화 (대학 선택 후 로드)
        setDepartmentsByField({});

        if (currentGoal) {
          setPrevGoal(currentGoal);
          setSelectedUniv(currentGoal.university);
          setUnivSearch(currentGoal.university);
          setSelectedDept(currentGoal.department);
          setTargetGrade(currentGoal.targetGrade);
          setTargetScore(currentGoal.targetScore);
          // 기존 대학의 학과 목록도 로드
          try {
            const depts = await appGet<string[]>(`/v1/goals/departments?universityName=${encodeURIComponent(currentGoal.university)}`);
            if (active) {
              setDepartmentsByField({ "일반": depts });
              setSelectedField("일반");
            }
          } catch (error) {
            console.error("기존 대학의 학과 로드 오류:", error);
          }
        } else {
          setPrevGoal(null);
          setSelectedUniv("");
          setUnivSearch("");
          setSelectedDept("");
          setTargetGrade("");
          setTargetScore("");
          setSelectedField("");
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "목표 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadGoalData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedField && !departmentsByField[selectedField]?.includes(selectedDept)) {
      setSelectedDept("");
    }
  }, [departmentsByField, selectedDept, selectedField]);

  // 대학이 선택되면 학과 목록 로드
  useEffect(() => {
    if (!selectedUniv) {
      setDepartmentsByField({});
      setSelectedDept("");
      setSelectedField("");
      return;
    }

    let active = true;

    const loadDepartments = async () => {
      try {
        const departments = await appGet<string[]>(`/v1/goals/departments?universityName=${encodeURIComponent(selectedUniv)}`);
        
        if (!active) return;
        
        // 학과를 "일반" 계열로 통합 (백엔드에서 계열 정보 없음을 가정)
        setDepartmentsByField({ "일반": departments });
        setSelectedField("일반");
        setSelectedDept("");
      } catch (error) {
        console.error("학과 로드 오류:", error);
        // 오류 시에도 UI가 깨지지 않도록 빈 상태로 설정
        setDepartmentsByField({ "일반": [] });
        setSelectedField("일반");
      }
    };

    void loadDepartments();

    return () => {
      active = false;
    };
  }, [selectedUniv]);

  const filteredUnivs = universities.filter(
    (university) =>
      university.includes(univSearch) && univSearch.trim().length > 0 && university !== selectedUniv
  );

  const isChanged =
    prevGoal !== null &&
    (prevGoal.university !== selectedUniv ||
      prevGoal.department !== selectedDept ||
      prevGoal.field !== selectedField ||
      prevGoal.targetGrade !== targetGrade ||
      prevGoal.targetScore !== targetScore);

  const canSave =
    selectedUniv.trim().length > 0 &&
    selectedDept.trim().length > 0 &&
    selectedField.trim().length > 0 &&
    targetGrade.trim().length > 0 &&
    targetScore.trim().length > 0 &&
    !isSaving;

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const savedGoal = await appPut<SavedGoal>("/v1/goals/current", {
        university: selectedUniv,
        department: selectedDept,
        field: selectedField,
        targetGrade: Number(targetGrade),
        targetScore: Number(targetScore)
      });

      setPrevGoal(savedGoal);
      setSelectedField(savedGoal.field);
      setSelectedUniv(savedGoal.university);
      setUnivSearch(savedGoal.university);
      setSelectedDept(savedGoal.department);
      setTargetGrade(savedGoal.targetGrade);
      setTargetScore(savedGoal.targetScore);
      setSaveStatus(prevGoal ? "changed" : "saved");
      window.setTimeout(() => setSaveStatus("idle"), 4000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "목표를 저장하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("목표를 초기화하시겠습니까?")) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await appDelete<{ deleted: true }>("/v1/goals/current");
      const firstField = fields[0] || "";
      setPrevGoal(null);
      setSelectedUniv("");
      setUnivSearch("");
      setSelectedField(firstField);
      setSelectedDept("");
      setTargetGrade("");
      setTargetScore("");
      setSaveStatus("idle");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "목표를 초기화하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "진로 / 입시" }, { label: "목표 설정" }]} />
      <PageTitle
        title="목표 설정"
        subtitle="목표 대학과 학과를 설정하고 입시 데이터를 비교해보세요. 저장 내용은 담임 선생님 알림과 함께 반영됩니다."
        action={
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              title="목표 초기화"
              disabled={isSaving}
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
              disabled={!canSave}
              className={`flex items-center gap-2 px-4 h-9 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                saveStatus !== "idle"
                  ? "bg-emerald-500 text-white"
                  : isChanged
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {saveStatus === "saved" ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> 저장 완료!
                </>
              ) : saveStatus === "changed" ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> 변경 저장됨
                </>
              ) : isChanged ? (
                <>
                  <Save className="w-3.5 h-3.5" /> 변경사항 저장
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> 목표 저장
                </>
              )}
            </button>
          </div>
        }
      />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      {saveStatus !== "idle" && (
        <div
          className={`rounded-xl border p-4 mb-5 flex items-start gap-3 ${
            saveStatus === "changed"
              ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700"
              : "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-700"
          }`}
        >
          <CheckCircle
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              saveStatus === "changed" ? "text-amber-500" : "text-emerald-500"
            }`}
          />
          <div>
            <p
              className={`text-sm font-medium ${
                saveStatus === "changed"
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {saveStatus === "changed" ? "목표가 변경 저장되었습니다." : "목표가 저장되었습니다."}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              저장된 내용은 백엔드에 반영되며, 필요한 경우 교사 알림에도 연결됩니다.
            </p>
          </div>
        </div>
      )}

      {prevGoal && prevGoal.changeCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl p-3 mb-5 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            이 목표는 {prevGoal.changeCount}번 변경되었습니다. 마지막 저장일은{" "}
            {new Date(prevGoal.savedAt).toLocaleDateString("ko-KR")} 입니다.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-sm text-muted-foreground">
          목표 설정 정보를 불러오고 있습니다.
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-foreground mb-4">목표 대학 설정</h3>
              <div className="relative mb-4">
                <label className="text-xs text-muted-foreground block mb-1.5">대학 검색</label>
                <div className="relative">
                  <input
                    className="w-full h-11 px-3.5 pr-10 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                    value={univSearch}
                    onChange={(event) => {
                      setUnivSearch(event.target.value);
                      setShowUnivDrop(true);
                    }}
                    onFocus={() => setShowUnivDrop(true)}
                    onBlur={() => window.setTimeout(() => setShowUnivDrop(false), 150)}
                    placeholder="대학명으로 검색"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                {showUnivDrop && filteredUnivs.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredUnivs.map((university) => (
                      <button
                        key={university}
                        className="w-full text-left px-3.5 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                        onClick={() => {
                          setSelectedUniv(university);
                          setUnivSearch(university);
                          setShowUnivDrop(false);
                        }}
                      >
                        {university}
                      </button>
                    ))}
                  </div>
                )}
                
                {universities.length === 0 && !isLoading && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    현재 초기 운영 데이터 기준으로 서울 지역 대학만 제공됩니다.
                  </p>
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
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full">
                          변경됨
                        </span>
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
                      type="number"
                      step="0.1"
                      min="1"
                      max="9"
                      className="w-24 h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                      value={targetGrade}
                      onChange={(event) => setTargetGrade(event.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">등급</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">목표 수능 점수</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-24 h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                      value={targetScore}
                      onChange={(event) => setTargetScore(event.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">점</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-foreground mb-4">목표 학과 설정</h3>
              
              {selectedUniv ? (
                <>
                  <div className="mb-3">
                    <label className="text-xs text-muted-foreground block mb-1.5">계열 선택</label>
                    <div className="flex flex-wrap gap-2">
                      {fields.map((field) => (
                        <button
                          key={field}
                          onClick={() => setSelectedField(field)}
                          className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                            selectedField === field
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {fields.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 text-center py-4">
                      학과 정보를 불러오는 중입니다...
                    </p>
                  )}
                  
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {depts.length > 0 ? (
                      depts.map((department) => (
                        <button
                          key={department}
                          onClick={() => setSelectedDept(department)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm border transition-colors ${
                            selectedDept === department
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border text-foreground hover:bg-secondary/60"
                          }`}
                        >
                          {department}
                        </button>
                      ))
                    ) : fields.length > 0 ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400 text-center py-4">
                        선택하신 대학의 학과 데이터가 없습니다. 다른 대학을 시도해주세요.
                      </p>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">
                  왼쪽에서 목표 대학을 먼저 선택해주세요.
                </p>
              )}
            </div>
          </div>

          {selectedUniv && selectedDept && (
            <div className="mt-5 bg-secondary/40 rounded-xl border border-border p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    설정된 목표
                    {prevGoal && <span className="ml-2 text-xs text-primary">저장됨</span>}
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedUniv} · {selectedDept}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    목표 내신 {targetGrade}등급 · 목표 수능 {targetScore}점
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> 저장
                  </button>
                  <button
                    onClick={() => navigate("/student/career/recommendation")}
                    className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    대학 추천 보기 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
