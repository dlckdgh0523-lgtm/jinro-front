import React, { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingLayout } from "./OnboardingLayout";
import { Target, Brain, ArrowRight } from "lucide-react";

type Flow = "decided" | "undecided" | "ai_yes" | null;

export function OnboardingStep3() {
  const navigate = useNavigate();
  const [flow, setFlow] = useState<Flow>(null);
  const [targetUniv, setTargetUniv] = useState("");
  const [targetDept, setTargetDept] = useState("");

  return (
    <OnboardingLayout
      step={3}
      title="진로 관심사를 설정해주세요"
      subtitle="지금 단계에서 모두 정하지 않아도 괜찮아요. 언제든지 바꿀 수 있습니다."
    >
      <div className="space-y-4">
        {/* Step 1: Is career decided? */}
        {flow === null && (
          <div className="space-y-4">
            <div className="bg-secondary/40 rounded-2xl p-6 text-center border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">진로가 이미 정해져 있나요?</p>
              <p className="text-sm text-muted-foreground">가고 싶은 대학이나 학과가 있다면 바로 설정할 수 있어요.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFlow("decided")}
                className="h-14 rounded-xl border-2 border-primary bg-primary/10 text-primary font-medium text-sm hover:bg-primary/15 transition-colors"
              >
                네, 있어요
              </button>
              <button
                onClick={() => setFlow("undecided")}
                className="h-14 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-secondary transition-colors"
              >
                아직 없어요
              </button>
            </div>
          </div>
        )}

        {/* Decided: Set goal */}
        {flow === "decided" && (
          <div className="space-y-4">
            <div className="bg-secondary/30 rounded-xl p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-3">목표 대학 / 학과를 설정하세요</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">목표 대학</label>
                  <input
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50 text-sm"
                    placeholder="예: 서울대학교"
                    value={targetUniv}
                    onChange={(e) => setTargetUniv(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">목표 학과</label>
                  <input
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50 text-sm"
                    placeholder="예: 컴퓨터공학과"
                    value={targetDept}
                    onChange={(e) => setTargetDept(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
              onClick={() => navigate("/student/dashboard")}
            >
              설정 완료 · 대시보드로 <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
              onClick={() => setFlow(null)}
            >
              이전으로
            </button>
          </div>
        )}

        {/* Undecided: Ask about AI chat */}
        {flow === "undecided" && (
          <div className="space-y-4">
            <div className="bg-secondary/40 rounded-2xl p-6 text-center border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">지금 AI 진로탐색 채팅을 진행할까요?</p>
              <p className="text-sm text-muted-foreground">AI와 대화하며 관심사와 적성을 탐색하고 진로 방향을 찾아볼 수 있어요.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/student/career/ai")}
                className="h-14 rounded-xl border-2 border-primary bg-primary/10 text-primary font-medium text-sm hover:bg-primary/15 transition-colors"
              >
                네, 시작할게요
              </button>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="h-14 rounded-xl border border-border bg-card text-muted-foreground font-medium text-sm hover:bg-secondary transition-colors"
              >
                아니오, 나중에 할게요
              </button>
            </div>
            <button
              className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
              onClick={() => setFlow(null)}
            >
              이전으로
            </button>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
