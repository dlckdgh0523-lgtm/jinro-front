import { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingShell } from "./OnboardingShell";

export default function Onboarding1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", grade: "", school: "", track: "" });

  const grades = ["1학년", "2학년", "3학년"];
  const tracks = ["인문계", "자연계", "예체능계", "직업계", "미정"];

  const isValid = form.name && form.grade && form.school && form.track;

  return (
    <OnboardingShell
      step={1}
      title="기본 정보를 입력해주세요"
      subtitle="진로나침반이 맞춤형 서비스를 제공하기 위해 기본 정보가 필요합니다."
      onNext={() => navigate("/onboarding/2")}
      nextDisabled={!isValid}
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
            이름 <span style={{ color: "var(--brand-coral)" }}>*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="실명 입력"
            className="w-full px-4 rounded-xl outline-none transition-all"
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

        {/* Grade */}
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
            학년 <span style={{ color: "var(--brand-coral)" }}>*</span>
          </label>
          <div className="flex gap-2">
            {grades.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, grade: g })}
                className="flex-1 py-3 rounded-xl text-sm transition-all"
                style={{
                  border: `1.5px solid ${form.grade === g ? "var(--brand-coral)" : "var(--border)"}`,
                  background: form.grade === g ? "var(--brand-peach)" : "var(--input-background)",
                  color: form.grade === g ? "var(--brand-coral)" : "var(--brand-text)",
                  fontWeight: form.grade === g ? 600 : 400,
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* School */}
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
            학교 <span style={{ color: "var(--brand-coral)" }}>*</span>
          </label>
          <input
            type="text"
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
            placeholder="예: 한빛고등학교"
            className="w-full px-4 rounded-xl outline-none transition-all"
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

        {/* Track */}
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
            계열 <span style={{ color: "var(--brand-coral)" }}>*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {tracks.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, track: t })}
                className="py-2.5 rounded-xl text-sm transition-all"
                style={{
                  border: `1.5px solid ${form.track === t ? "var(--brand-coral)" : "var(--border)"}`,
                  background: form.track === t ? "var(--brand-peach)" : "var(--input-background)",
                  color: form.track === t ? "var(--brand-coral)" : "var(--brand-text)",
                  fontWeight: form.track === t ? 600 : 400,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
