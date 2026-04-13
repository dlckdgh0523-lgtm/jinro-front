import React from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const navigate = useNavigate();
  const { dark, toggleDark } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-14 flex items-center px-6 border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">진</span>
          </div>
          <span className="font-medium text-foreground">진로 나침반</span>
        </button>
        <div className="flex-1" />
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-foreground mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export const inputClass =
  "w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow text-sm";

export const labelClass = "text-sm text-muted-foreground mb-1.5 block";

export const primaryBtn =
  "w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm";

export const secondaryBtn =
  "w-full h-11 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors text-sm flex items-center justify-center gap-2";
