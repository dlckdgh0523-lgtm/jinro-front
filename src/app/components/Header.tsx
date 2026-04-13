import React from "react";
import { Bell, Sun, Moon, ChevronDown, User, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";

interface HeaderProps {
  role: "student" | "teacher";
  userName?: string;
  schoolName?: string;
  alertCount?: number;
  onMenuOpen?: () => void;
}

export function Header({
  role,
  userName = "김민준",
  schoolName = "한빛고등학교",
  alertCount = 3,
  onMenuOpen,
}: HeaderProps) {
  const { dark, toggleDark } = useTheme();
  const { notifications } = useNotification();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const resolvedAlertCount = unreadCount > 0 ? unreadCount : alertCount;

  const alertPath = role === "student" ? "/student/study/alerts" : "/teacher/alerts";

  return (
    <header className="h-14 fixed top-0 left-0 right-0 z-40 bg-card border-b border-border flex items-center px-4 gap-3">
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
        onClick={onMenuOpen}
        aria-label="메뉴 열기"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0"
        onClick={() => navigate("/")}
      >
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">진</span>
        </div>
        <span className="text-sm font-semibold text-foreground hidden sm:block">진로나침반</span>
      </div>

      <div className="flex-1" />

      {/* School name */}
      <span className="text-sm text-muted-foreground hidden md:block">{schoolName}</span>

      {/* Alerts */}
      <button
        onClick={() => navigate(alertPath)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-4 h-4" />
        {resolvedAlertCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        )}
      </button>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        aria-label="다크 모드 전환"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm text-foreground hidden sm:block">{userName}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-11 w-44 bg-card border border-border rounded-xl shadow-lg z-50 py-1 overflow-hidden">
            <button
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              onClick={() => {
                navigate(role === "student" ? "/student/profile" : "/teacher/profile");
                setProfileOpen(false);
              }}
            >
              <User className="w-4 h-4 text-muted-foreground" />
              마이페이지
            </button>
            <hr className="border-border my-1" />
            <button
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => {
                navigate("/");
                setProfileOpen(false);
              }}
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
