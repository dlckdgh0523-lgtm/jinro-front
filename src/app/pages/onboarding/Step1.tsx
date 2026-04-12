import React, { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingLayout } from "./OnboardingLayout";
import { inputClass, labelClass } from "../auth/AuthLayout";

const GRADES = ["1학년", "2학년", "3학년"];
const TRACKS = ["이공계열", "인문계열", "예체능계열", "미정"];

export function OnboardingStep1() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [track, setTrack] = useState("");

  const canNext = name && grade && school && track;

  return (
    <OnboardingLayout
      step={1}
      title="기본 정보를 입력해주세요"
      subtitle="진로나침반이 나에게 맞는 학습 계획을 세우는 데 사용됩니다."
    >
      <div className="space-y-5">
        <div>
          <label className={labelClass}>이름 <span className="text-red-500">*</span></label>
          <input
            className={inputClass}
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>학년 <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`flex-1 h-11 rounded-xl border text-sm transition-colors ${
                  grade === g
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-input-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>학교 <span className="text-red-500">*</span></label>
          <input
            className={inputClass}
            placeholder="학교명을 입력하세요"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>계열 <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-2">
            {TRACKS.map((t) => (
              <button
                key={t}
                onClick={() => setTrack(t)}
                className={`h-11 rounded-xl border text-sm transition-colors ${
                  track === t
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-input-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>기본 학업 정보 <span className="text-muted-foreground/60 font-normal">(선택)</span></label>
          <input
            className={inputClass}
            placeholder="현재 내신 등급 또는 수능 목표 등을 입력하세요"
          />
        </div>

        <button
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
          onClick={() => navigate("/onboarding/2")}
          disabled={!canNext}
        >
          다음 단계로
        </button>
      </div>
    </OnboardingLayout>
  );
}
