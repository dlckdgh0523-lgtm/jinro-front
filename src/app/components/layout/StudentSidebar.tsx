import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home, BookOpen, TrendingUp, FileText, Compass, Target,
  Building2, Database, CalendarDays, CheckSquare, Bell,
  MessageCircle, User, ChevronDown, ChevronRight
} from "lucide-react";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarCategory {
  label: string;
  icon: React.ReactNode;
  items: SidebarItem[];
}

const categories: SidebarCategory[] = [
  {
    label: "대시보드",
    icon: <Home size={15} />,
    items: [
      { label: "학생 홈", path: "/student", icon: <Home size={13} /> },
    ],
  },
  {
    label: "학업 관리",
    icon: <BookOpen size={15} />,
    items: [
      { label: "성적 입력", path: "/student/grades", icon: <FileText size={13} /> },
      { label: "성적 변화 추이", path: "/student/grade-trend", icon: <TrendingUp size={13} /> },
      { label: "성장 리포트", path: "/student/growth-report", icon: <FileText size={13} /> },
    ],
  },
  {
    label: "진로 / 입시",
    icon: <Compass size={15} />,
    items: [
      { label: "목표 설정", path: "/student/goal", icon: <Target size={13} /> },
      { label: "AI 진로 탐색", path: "/student/ai-career", icon: <Compass size={13} /> },
      { label: "대학·학과 추천", path: "/student/university", icon: <Building2 size={13} /> },
      { label: "최근 입시 데이터", path: "/student/admissions", icon: <Database size={13} /> },
    ],
  },
  {
    label: "학습 실행",
    icon: <CalendarDays size={15} />,
    items: [
      { label: "주간 학습 계획", path: "/student/weekly-plan", icon: <CalendarDays size={13} /> },
      { label: "학습 완료 체크", path: "/student/study-check", icon: <CheckSquare size={13} /> },
      { label: "실시간 알림", path: "/student/notifications", icon: <Bell size={13} /> },
    ],
  },
  {
    label: "상담",
    icon: <MessageCircle size={15} />,
    items: [
      { label: "상담 페이지", path: "/student/counseling", icon: <MessageCircle size={13} /> },
    ],
  },
  {
    label: "계정",
    icon: <User size={15} />,
    items: [
      { label: "마이페이지", path: "/student/mypage", icon: <User size={13} /> },
    ],
  },
];

interface StudentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function StudentSidebar({ isOpen = true, onClose }: StudentSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((c) => c.label)
  );

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    if (path === "/student") return location.pathname === "/student" || location.pathname === "/student/";
    return location.pathname.startsWith(path);
  };

  const activeCategoryLabel = categories.find((cat) =>
    cat.items.some((item) => isActive(item.path))
  )?.label;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
        style={{
          width: "240px",
          paddingTop: "64px",
          background: "var(--sidebar)",
          borderRight: "1px solid var(--sidebar-border)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
      >
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {categories.map((cat, catIdx) => {
            const isExpanded = expandedCategories.includes(cat.label);
            const isCatActive = activeCategoryLabel === cat.label;

            return (
              <div key={cat.label}>
                {catIdx > 0 && (
                  <div
                    className="my-2 mx-1"
                    style={{ height: "1px", background: "var(--sidebar-border)" }}
                  />
                )}

                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors"
                  style={{
                    color: isCatActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    letterSpacing: "0.02em",
                    background: "transparent",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: isCatActive ? "var(--sidebar-primary)" : "var(--brand-text-muted)" }}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </div>
                  <span style={{ color: "var(--brand-text-light)" }}>
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </span>
                </button>

                {/* Sub-items */}
                {isExpanded && (
                  <div className="ml-2 mb-1">
                    {cat.items.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            onClose?.();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 transition-all"
                          style={{
                            background: active ? "var(--sidebar-accent)" : "transparent",
                            color: active ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
                            fontSize: "0.82rem",
                            fontWeight: active ? 600 : 400,
                            borderLeft: active ? "2px solid var(--sidebar-primary)" : "2px solid transparent",
                            paddingLeft: active ? "10px" : "12px",
                          }}
                        >
                          <span style={{ color: active ? "var(--sidebar-primary)" : "var(--brand-text-light)" }}>
                            {item.icon}
                          </span>
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom profile hint */}
        <div
          className="px-4 py-3 mx-3 mb-4 rounded-xl"
          style={{ background: "var(--brand-peach)" }}
        >
          <p className="text-xs" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>
            김민준 · 한빛고 3학년
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-muted)" }}>
            목표: 연세대 컴퓨터공학
          </p>
        </div>
      </aside>
    </>
  );
}
