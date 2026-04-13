import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { User, Brain, BookOpen, Target, Send, AlertTriangle } from "lucide-react";
import { appGet, appPost } from "../../utils/appApi";

type StudentCard = {
  id: string;
  name: string;
  grade: string;
  track: string;
  gpa: number;
  goal: string;
  status: "danger" | "warning" | "normal";
  completion: number;
  counselNeeded: boolean;
};

export function CounselingSupport() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentCard | null>(null);
  const [memo, setMemo] = useState("");
  const [subject, setSubject] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetch = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await appGet<StudentCard[]>("/v1/students");
        if (active) {
          setStudents(response);
          const counselNeeded = response.filter((s) => s.counselNeeded);
          if (counselNeeded.length > 0) setSelectedStudent(counselNeeded[0] ?? null);
          else if (response.length > 0) setSelectedStudent(response[0] ?? null);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "학생 목록을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetch();
    return () => { active = false; };
  }, []);

  const counselStudents = students.filter((s) => s.counselNeeded);

  const handleSave = async () => {
    if (!memo.trim() || !selectedStudent || isSaving) return;
    setIsSaving(true);
    setSaveError("");
    try {
      await appPost("/v1/counseling/memos", {
        studentId: selectedStudent.id,
        subject: subject.trim() || "상담 메모",
        content: memo.trim(),
        tag: "학업 면담",
        shareWithStudent: false
      });
      setSaved(true);
      setMemo("");
      setSubject("");
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "메모 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "상담 관리" }, { label: "상담 지원" }]} />
      <PageTitle title="상담 지원" subtitle="학생 상황을 파악하고 맞춤 상담 메모를 작성하세요." />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Student list */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">상담 필요 학생</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isLoading ? "불러오는 중..." : `${counselStudents.length}명`}
            </p>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                학생 목록을 불러오고 있습니다.
              </div>
            ) : counselStudents.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                상담이 필요한 학생이 없습니다.
              </div>
            ) : (
              counselStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/30 ${
                    selectedStudent?.id === s.id ? "bg-primary/5 border-r-2 border-primary" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <StatusBadge
                        variant={s.status}
                        label={s.status === "danger" ? "위험" : "주의"}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{s.goal}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Center: Student info */}
        <div className="space-y-4">
          {selectedStudent ? (
            <>
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedStudent.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedStudent.grade} · {selectedStudent.track}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 p-3 bg-secondary/40 rounded-xl">
                    <Target className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">목표</p>
                      <p className="text-sm text-foreground">{selectedStudent.goal}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 bg-secondary/40 rounded-xl">
                    <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">학습 완료율</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              selectedStudent.completion >= 70 ? "bg-emerald-500" :
                              selectedStudent.completion >= 50 ? "bg-amber-400" : "bg-red-400"
                            }`}
                            style={{ width: `${selectedStudent.completion}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {selectedStudent.completion}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">상담 권고 사유</p>
                      <p className="text-xs text-foreground mt-0.5">
                        {selectedStudent.status === "danger"
                          ? "성적 급락 및 학습 이행률 저조로 즉각적인 개입이 필요합니다."
                          : "성적 하락세 또는 학습 완료율 미달로 주의 관찰이 필요합니다."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">상세 정보</p>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>내신 평균: <span className="text-foreground font-medium">{selectedStudent.gpa > 0 ? `${selectedStudent.gpa}등급` : "미입력"}</span></p>
                  <p>완료율: <span className="text-foreground font-medium">{selectedStudent.completion}%</span></p>
                  <button
                    onClick={() => navigate(`/teacher/students/${selectedStudent.id}`)}
                    className="text-primary hover:underline mt-1 block"
                  >
                    학생 상세 보기 →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
              {isLoading ? "불러오는 중..." : "학생을 선택하세요."}
            </div>
          )}
        </div>

        {/* Right: Memo area */}
        <div className="bg-card rounded-xl border border-border p-5 flex flex-col">
          <h3 className="text-foreground mb-3">상담 메모 작성</h3>
          {saved && (
            <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 text-xs text-emerald-700 dark:text-emerald-400">
              ✅ 메모가 저장되었습니다.
            </div>
          )}
          {saveError && <p className="text-xs text-destructive mb-2">{saveError}</p>}
          <div className="mb-2">
            <input
              className="w-full h-9 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/60"
              placeholder="상담 제목"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!selectedStudent}
            />
          </div>
          <textarea
            className="flex-1 min-h-32 w-full px-3.5 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/60 mb-3"
            placeholder={
              selectedStudent
                ? `${selectedStudent.name} 학생에 대한 상담 메모를 작성하세요...\n\n- 면담 내용\n- 학생 상태\n- 후속 조치`
                : "학생을 먼저 선택하세요."
            }
            value={memo}
            disabled={!selectedStudent}
            onChange={(e) => setMemo(e.target.value)}
          />
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">빠른 템플릿</p>
              <div className="flex flex-wrap gap-1.5">
                {["학업 면담", "진로 상담", "정서 지원", "경고 발송"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setMemo((prev) => prev + `\n[${t}] `)}
                    disabled={!selectedStudent}
                    className="px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-40"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => void handleSave()}
              disabled={!memo.trim() || !selectedStudent || isSaving}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSaving ? "저장 중..." : "메모 저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
