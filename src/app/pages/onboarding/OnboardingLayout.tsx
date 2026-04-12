import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface OnboardingLayoutProps {
  step: 1 | 2 | 3;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function OnboardingLayout({ step, title, subtitle, children }: OnboardingLayoutProps) {
  const { dark, toggleDark } = useTheme();
  const steps = [
    { num: 1, label: "기본 정보" },
    { num: 2, label: "학업 프로필" },
    { num: 3, label: "진로 관심사" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-14 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">진</span>
          </div>
          <span className="font-medium text-foreground">진로나침반</span>
        </div>
        <div className="flex-1" />
        <button onClick={toggleDark} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 py-6">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s.num < step ? "bg-primary text-primary-foreground" :
                s.num === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                "bg-muted text-muted-foreground"
              }`}>
                {s.num < step ? "✓" : s.num}
              </div>
              <span className={`text-xs ${s.num === step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-16 h-px mx-2 mb-5 ${s.num < step ? "bg-primary" : "bg-border"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <h2 className="text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
