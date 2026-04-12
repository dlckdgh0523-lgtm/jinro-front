import { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingShell } from "./OnboardingShell";
import { Target, Compass, ChevronRight } from "lucide-react";

type Step = "question" | "goal-set" | "ai-branch";

export default function Onboarding3() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("question");
  const [targetUniv, setTargetUniv] = useState("");
  const [targetMajor, setTargetMajor] = useState("");

  // Determined
  if (step === "goal-set") {
    return (
      <OnboardingShell
        step={3}
        title="목표를 설정해볼까요?"
        subtitle="목표 대학과 학과를 입력하면 맞춤 추천과 입시 데이터를 바로 확인할 수 있어요."
        onNext={() => navigate("/student")}
        nextLabel="대시보드로 이동"
        nextDisabled={!targetUniv || !targetMajor}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              목표 대학
            </label>
            <input
              type="text"
              value={targetUniv}
              onChange={(e) => setTargetUniv(e.target.value)}
              placeholder="예: 연세대학교"
              className="w-full px-4 rounded-xl outline-none"
              style={{
                height: "48px",
                background: "var(--input-background)",
                border: "1.5px solid var(--border)",
                color: "var(--brand-text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand-coral)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              목표 학과
            </label>
            <input
              type="text"
              value={targetMajor}
              onChange={(e) => setTargetMajor(e.target.value)}
              placeholder="예: 컴퓨터공학과"
              className="w-full px-4 rounded-xl outline-none"
              style={{
                height: "48px",
                background: "var(--input-background)",
                border: "1.5px solid var(--border)",
                color: "var(--brand-text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand-coral)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          {targetUniv && targetMajor && (
            <div
              className="p-4 rounded-xl flex items-center gap-3"
              style={{ background: "var(--brand-peach)" }}
            >
              <Target size={18} style={{ color: "var(--brand-coral)" }} />
              <div>
                <p className="text-sm" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>
                  {targetUniv} · {targetMajor}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-muted)" }}>
                  목표가 설정되었어요. 대시보드에서 바로 확인할 수 있어요.
                </p>
              </div>
            </div>
          )}
        </div>
      </OnboardingShell>
    );
  }

  // Not determined - AI branch
  if (step === "ai-branch") {
    return (
      <OnboardingShell
        step={3}
        title="진로 탐색을 도와드릴게요"
        subtitle="AI와 대화하며 나에게 맞는 진로를 천천히 찾아가 보세요."
        onNext={() => {}}
        hideNext
      >
        <div className="space-y-4">
          <p className="text-base" style={{ color: "var(--brand-text)", fontWeight: 600, lineHeight: 1.7 }}>
            지금 AI 진로탐색 채팅을 진행할까요?
          </p>
          <p className="text-sm" style={{ color: "var(--brand-text-muted)", lineHeight: 1.7 }}>
            AI가 관심사, 강점, 원하는 미래를 단계별로 질문해드려요. 진로가 자연스럽게 보이기 시작할 거예요. 🌱
          </p>

          <div className="space-y-3 mt-2">
            <button
              onClick={() => navigate("/student/ai-career")}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all hover:opacity-90"
              style={{
                background: "var(--brand-coral)",
                color: "white",
              }}
            >
              <div className="flex items-center gap-3">
                <Compass size={20} />
                <div className="text-left">
                  <p className="text-sm font-semibold">네, 시작할게요</p>
                  <p className="text-xs opacity-80">AI 진로 탐색 채팅 바로 시작</p>
                </div>
              </div>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => navigate("/student")}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all"
              style={{
                background: "var(--muted)",
                color: "var(--brand-text)",
              }}
            >
              <div className="flex items-center gap-3">
                <Target size={20} style={{ color: "var(--brand-text-muted)" }} />
                <div className="text-left">
                  <p className="text-sm font-semibold">아니오, 나중에 할게요</p>
                  <p className="text-xs" style={{ color: "var(--brand-text-muted)" }}>대시보드에서 언제든 시작 가능</p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--brand-text-muted)" }} />
            </button>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // Main question
  return (
    <OnboardingShell
      step={3}
      title="진로 관심사를 알아볼게요"
      subtitle="지금의 상황에 맞게 선택해주세요."
      onNext={() => {}}
      hideNext
    >
      <div className="space-y-4">
        <p className="text-base" style={{ color: "var(--brand-text)", fontWeight: 600, lineHeight: 1.7 }}>
          진로가 이미 정해져 있나요?
        </p>
        <p className="text-sm" style={{ color: "var(--brand-text-muted)" }}>
          정해지지 않아도 괜찮아요. AI가 함께 찾아드릴 거예요. 🧭
        </p>

        <div className="space-y-3 mt-2">
          <button
            onClick={() => setStep("goal-set")}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all hover:opacity-90"
            style={{ background: "var(--brand-coral)", color: "white" }}
          >
            <div className="flex items-center gap-3">
              <Target size={20} />
              <div className="text-left">
                <p className="text-sm font-semibold">네, 이미 정해졌어요</p>
                <p className="text-xs opacity-80">목표 대학·학과 바로 설정</p>
              </div>
            </div>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => setStep("ai-branch")}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all"
            style={{
              border: "1.5px solid var(--brand-coral)",
              background: "var(--brand-peach)",
              color: "var(--brand-coral)",
            }}
          >
            <div className="flex items-center gap-3">
              <Compass size={20} />
              <div className="text-left">
                <p className="text-sm font-semibold">아니오, 아직 고민 중이에요</p>
                <p className="text-xs opacity-70">AI 진로 탐색으로 함께 찾기</p>
              </div>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}
