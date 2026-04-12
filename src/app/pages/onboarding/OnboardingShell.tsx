import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

interface OnboardingShellProps {
  step: 1 | 2 | 3;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideNext?: boolean;
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = "다음으로",
  nextDisabled = false,
  hideNext = false,
}: OnboardingShellProps) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-lg">
        {/* Back */}
        <button
          onClick={onBack || (() => navigate(-1))}
          className="flex items-center gap-2 mb-6 text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--brand-text-muted)" }}
        >
          <ArrowLeft size={14} />
          이전
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{
                  background: s === step ? "var(--brand-coral)" : s < step ? "var(--brand-success)" : "var(--muted)",
                  color: s <= step ? "white" : "var(--brand-text-muted)",
                  fontWeight: 600,
                }}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className="w-12 h-0.5"
                  style={{ background: s < step ? "var(--brand-success)" : "var(--muted)" }}
                />
              )}
            </div>
          ))}
          <span className="ml-2 text-xs" style={{ color: "var(--brand-text-muted)" }}>
            {step}/3 단계
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 40px rgba(193,123,110,0.1)",
          }}
        >
          <div className="mb-6">
            <h2 style={{ color: "var(--brand-text)", fontWeight: 700 }}>{title}</h2>
            <p className="text-sm mt-1" style={{ color: "var(--brand-text-muted)" }}>{subtitle}</p>
          </div>

          {children}

          {!hideNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="w-full mt-6 py-3 rounded-xl text-white transition-opacity"
              style={{
                height: "48px",
                background: nextDisabled ? "var(--muted)" : "var(--brand-coral)",
                color: nextDisabled ? "var(--brand-text-muted)" : "white",
                fontWeight: 600,
                cursor: nextDisabled ? "not-allowed" : "pointer",
                opacity: nextDisabled ? 0.7 : 1,
              }}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
