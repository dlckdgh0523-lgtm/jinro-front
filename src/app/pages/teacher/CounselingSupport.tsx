import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { STUDENTS } from "../../data/mock";
import { User, Brain, BookOpen, Target, Send, AlertTriangle } from "lucide-react";

export function CounselingSupport() {
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[1]);
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!memo.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const counselStudents = STUDENTS.filter((s) => s.counselNeeded);

  return (
    <div>
      <Breadcrumb items={[{ label: "상담 관리" }, { label: "상담 지원" }]} />
      <PageTitle title="상담 지원" subtitle="학생 상황을 파악하고 맞춤 상담 메모를 작성하세요." />

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Student list */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">상담 필요 학생</p>
            <p className="text-xs text-muted-foreground mt-0.5">{counselStudents.length}명</p>
          </div>
          <div className="divide-y divide-border">
            {counselStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/30 ${
                  selectedStudent.id === s.id ? "bg-primary/5 border-r-2 border-primary" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <StatusBadge variant={s.status as any} label={s.status === "danger" ? "위험" : "주의"} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.goal}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Insight */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedStudent.name}</p>
                <p className="text-xs text-muted-foreground">{selectedStudent.grade} · {selectedStudent.track}</p>
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
                      <div className={`h-full rounded-full ${
                        selectedStudent.completion >= 70 ? "bg-emerald-500" :
                        selectedStudent.completion >= 50 ? "bg-amber-400" : "bg-red-400"
                      }`} style={{ width: `${selectedStudent.completion}%` }} />
                    </div>
                    <span className="text-xs font-medium text-foreground">{selectedStudent.completion}%</span>
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

          {/* AI Insight */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">AI 상담 인사이트</p>
            </div>
            <div className="space-y-2">
              {[
                "수학 학습 불안이 전반적인 학습 동기 저하로 이어지고 있을 가능성",
                "진로 목표가 불명확하여 학습 방향성 부재 가능성",
                "단기 목표 설정 및 소성취 경험 제공 권장",
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-foreground leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Memo area */}
        <div className="bg-card rounded-xl border border-border p-5 flex flex-col">
          <h3 className="text-foreground mb-3">상담 메모 작성</h3>
          {saved && (
            <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 text-xs text-emerald-700 dark:text-emerald-400">
              ✅ 메모가 저장되었습니다.
            </div>
          )}
          <textarea
            className="flex-1 min-h-32 w-full px-3.5 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/60 mb-3"
            placeholder={`${selectedStudent.name} 학생에 대한 상담 메모를 작성하세요...\n\n- 면담 내용\n- 학생 상태\n- 후속 조치`}
            value={memo}
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
                    className="px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!memo.trim()}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> 메모 저장 및 학생에게 전달
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
