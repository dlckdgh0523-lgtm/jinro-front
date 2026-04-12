import { Bell, Moon, Sun, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  userRole: "student" | "teacher";
  onToggleSidebar?: () => void;
}

export function Header({ darkMode, onToggleDark, userRole, onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const userName = userRole === "student" ? "김민준" : "박지영";
  const userLabel = userRole === "student" ? "3학년" : "담임교사";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: "64px",
        background: darkMode ? "var(--card)" : "#FFFFFF",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(193,123,110,0.08)",
      }}
    >
      {/* Left: Logo + hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-accent transition-colors lg:hidden"
        >
          <Menu size={18} style={{ color: "var(--brand-coral)" }} />
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 select-none"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs"
            style={{ background: "linear-gradient(135deg, #C17B6E 0%, #D4906A 100%)" }}
          >
            🧭
          </div>
          <span
            className="text-lg hidden sm:block"
            style={{ color: "var(--brand-coral)", fontWeight: 700, letterSpacing: "-0.3px" }}
          >
            진로나침반
          </span>
        </button>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => navigate(userRole === "student" ? "/student/notifications" : "/teacher/notifications")}
        >
          <Bell size={18} style={{ color: "var(--brand-text-muted)" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--brand-coral)" }}
          />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title={darkMode ? "라이트 모드" : "다크 모드"}
        >
          {darkMode ? (
            <Sun size={18} style={{ color: "var(--brand-warning)" }} />
          ) : (
            <Moon size={18} style={{ color: "var(--brand-text-muted)" }} />
          )}
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: "var(--brand-coral)" }}
          >
            {userName[0]}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600, lineHeight: 1.2 }}>
              {userName}
            </span>
            <span className="text-xs" style={{ color: "var(--brand-text-muted)", lineHeight: 1.2 }}>
              {userLabel}
            </span>
          </div>
          <ChevronDown size={14} style={{ color: "var(--brand-text-muted)" }} className="hidden md:block" />
        </button>
      </div>
    </header>
  );
}
