import { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingShell } from "./OnboardingShell";
import { X } from "lucide-react";

const SUNEUNG_SUBJECTS = [
  { group: "공통", items: ["국어", "수학", "영어", "한국사"] },
  { group: "사회탐구", items: ["생활과윤리", "윤리와사상", "한국지리", "세계지리", "동아시아사", "세계사", "경제", "정치와법", "사회·문화"] },
  { group: "과학탐구", items: ["물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "물리학Ⅱ", "화학Ⅱ", "생명과학Ⅱ", "지구과학Ⅱ"] },
  { group: "직업탐구", items: ["성공적인직업생활", "농업기초기술"] },
  { group: "제2외국어/한문", items: ["독일어Ⅰ", "프랑스어Ⅰ", "스페인어Ⅰ", "중국어Ⅰ", "일본어Ⅰ", "러시아어Ⅰ", "한문Ⅰ"] },
];

export default function Onboarding2() {
  const navigate = useNavigate();
  const [hasNaesin, setHasNaesin] = useState<boolean | null>(null);
  const [hasSuneung, setHasSuneung] = useState<boolean | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["국어", "수학", "영어", "한국사"]);

  const toggleSubject = (subj: string) => {
    const fixed = ["국어", "수학", "영어", "한국사"];
    if (fixed.includes(subj)) return;
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const isValid = hasNaesin !== null && hasSuneung !== null && selectedSubjects.length >= 4;

  return (
    <OnboardingShell
      step={2}
      title="학업 프로필을 설정하세요"
      subtitle="학습 상황에 맞게 설정하면 더 정확한 맞춤 서비스를 받을 수 있어요."
      onNext={() => navigate("/onboarding/3")}
      nextDisabled={!isValid}
    >
      <div className="space-y-6">
        {/* 내신 관리 */}
        <div>
          <p className="text-sm mb-2" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
            내신 관리를 하고 있나요?
          </p>
          <div className="flex gap-3">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setHasNaesin(v)}
                className="flex-1 py-3 rounded-xl text-sm transition-all"
                style={{
                  border: `1.5px solid ${hasNaesin === v ? "var(--brand-coral)" : "var(--border)"}`,
                  background: hasNaesin === v ? "var(--brand-peach)" : "var(--input-background)",
                  color: hasNaesin === v ? "var(--brand-coral)" : "var(--brand-text)",
                  fontWeight: hasNaesin === v ? 600 : 400,
                }}
              >
                {v ? "네, 하고 있어요" : "아직 아니에요"}
              </button>
            ))}
          </div>
        </div>

        {/* 수능 준비 */}
        <div>
          <p className="text-sm mb-2" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
            수능 준비를 하고 있나요?
          </p>
          <div className="flex gap-3">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setHasSuneung(v)}
                className="flex-1 py-3 rounded-xl text-sm transition-all"
                style={{
                  border: `1.5px solid ${hasSuneung === v ? "var(--brand-coral)" : "var(--border)"}`,
                  background: hasSuneung === v ? "var(--brand-peach)" : "var(--input-background)",
                  color: hasSuneung === v ? "var(--brand-coral)" : "var(--brand-text)",
                  fontWeight: hasSuneung === v ? 600 : 400,
                }}
              >
                {v ? "네, 준비 중이에요" : "아직 아니에요"}
              </button>
            ))}
          </div>
        </div>

        {/* 수능 과목 선택 */}
        {hasSuneung && (
          <div>
            <p className="text-sm mb-1" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              준비 중인 수능 과목 선택
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--brand-text-muted)" }}>
              국어·수학·영어·한국사는 기본 포함. 탐구는 최대 2과목 선택 권장.
            </p>
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {SUNEUNG_SUBJECTS.map((group) => (
                <div key={group.group}>
                  <p className="text-xs mb-1.5" style={{ color: "var(--brand-text-muted)", fontWeight: 600 }}>
                    {group.group}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((subj) => {
                      const selected = selectedSubjects.includes(subj);
                      const fixed = ["국어", "수학", "영어", "한국사"].includes(subj);
                      return (
                        <button
                          key={subj}
                          onClick={() => toggleSubject(subj)}
                          disabled={fixed}
                          className="px-3 py-1.5 rounded-lg text-xs transition-all"
                          style={{
                            background: selected ? "var(--brand-coral)" : "var(--muted)",
                            color: selected ? "white" : "var(--brand-text-muted)",
                            fontWeight: selected ? 600 : 400,
                            cursor: fixed ? "default" : "pointer",
                            opacity: fixed ? 0.8 : 1,
                          }}
                        >
                          {subj}
                          {fixed && " ✓"}
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
          <div
            className="p-4 rounded-xl"
            style={{ background: "var(--brand-peach)", border: "1px solid var(--brand-rose)" }}
          >
            <p className="text-xs mb-2" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>
              선택한 과목 ({selectedSubjects.length}개)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedSubjects.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                  style={{ background: "var(--card)", color: "var(--brand-text)", border: "1px solid var(--border)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </OnboardingShell>
  );
}
