import React, { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingLayout } from "./OnboardingLayout";
import { X, Plus } from "lucide-react";

const SUNEUNG_SUBJECTS = [
  { group: "필수", items: ["국어", "수학", "영어", "한국사"] },
  { group: "사회 탐구", items: ["한국지리", "세계지리", "경제", "정치와법", "사회문화", "세계사", "동아시아사"] },
  { group: "과학 탐구", items: ["물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "물리학Ⅱ", "화학Ⅱ", "생명과학Ⅱ", "지구과학Ⅱ"] },
  { group: "직업 탐구 / 제2외국어", items: ["농업이해", "공업일반", "중국어Ⅰ", "일본어Ⅰ", "프랑스어Ⅰ"] },
];

export function OnboardingStep2() {
  const navigate = useNavigate();
  const [hasSuneung, setHasSuneung] = useState<boolean | null>(null);
  const [hasNaesin, setHasNaesin] = useState<boolean | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["국어", "수학", "영어", "한국사"]);

  const toggleSubject = (sub: string) => {
    const required = ["국어", "수학", "영어", "한국사"];
    if (required.includes(sub)) return;
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const canNext = hasSuneung !== null && hasNaesin !== null;

  return (
    <OnboardingLayout
      step={2}
      title="학업 프로필을 설정해주세요"
      subtitle="수능 준비 방향과 목표 과목을 선택하면 맞춤형 학습 계획을 만들어드립니다."
    >
      <div className="space-y-6">
        {/* Naesin */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">내신 관리를 하고 있나요?</p>
          <div className="flex gap-3">
            {[{ label: "네, 내신 관리 중", val: true }, { label: "아니요", val: false }].map(({ label, val }) => (
              <button
                key={label}
                onClick={() => setHasNaesin(val)}
                className={`flex-1 h-11 rounded-xl border text-sm transition-colors ${
                  hasNaesin === val
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-input-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Suneung */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">수능을 준비하고 있나요?</p>
          <div className="flex gap-3">
            {[{ label: "네, 수능 준비 중", val: true }, { label: "아직 결정 안 했어요", val: false }].map(({ label, val }) => (
              <button
                key={label}
                onClick={() => setHasSuneung(val)}
                className={`flex-1 h-11 rounded-xl border text-sm transition-colors ${
                  hasSuneung === val
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-input-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject selector */}
        {hasSuneung && (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">준비 중인 수능 과목을 선택하세요</p>
            <p className="text-xs text-muted-foreground mb-3">국어, 수학, 영어, 한국사는 기본 포함됩니다. 탐구 과목은 최대 2개까지 선택됩니다.</p>
            <div className="space-y-3">
              {SUNEUNG_SUBJECTS.map((group) => (
                <div key={group.group}>
                  <p className="text-xs text-muted-foreground mb-2">{group.group}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((sub) => {
                      const isRequired = ["국어", "수학", "영어", "한국사"].includes(sub);
                      const isSelected = selectedSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          onClick={() => toggleSubject(sub)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          } ${isRequired ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {sub} {isRequired && <span className="text-primary/60">*</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected summary */}
        {selectedSubjects.length > 0 && hasSuneung && (
          <div className="bg-secondary/40 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-2">선택한 수능 과목 요약</p>
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((s) => (
                <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {s}
                  {!["국어", "수학", "영어", "한국사"].includes(s) && (
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSubject(s)} />
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
          onClick={() => navigate("/onboarding/3")}
          disabled={!canNext}
        >
          다음 단계로
        </button>
        <button
          className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
          onClick={() => navigate("/onboarding/1")}
        >
          이전으로
        </button>
      </div>
    </OnboardingLayout>
  );
}
