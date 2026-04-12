import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home, TrendingUp, FileText, Target, MessageSquare, BookOpen,
  CheckSquare, Bell, User, GraduationCap, Users, BarChart2,
  ClipboardList, MessageCircle, ChevronRight, ChevronDown,
  Brain, Map, Database, PenTool, Inbox, X,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavCategory {
  key: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const studentNav: NavCategory[] = [
  {
    key: "dashboard",
    label: "대시보드",
    icon: <Home className="w-4 h-4" />,
    items: [{ path: "/student/dashboard", label: "학생 홈", icon: <Home className="w-3.5 h-3.5" /> }],
  },
  {
    key: "academic",
    label: "학업 관리",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { path: "/student/grades/input", label: "성적 입력", icon: <FileText className="w-3.5 h-3.5" /> },
      { path: "/student/grades/trend", label: "성적 변화 추이", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { path: "/student/grades/report", label: "성장 리포트", icon: <BarChart2 className="w-3.5 h-3.5" /> },
    ],
  },
  {
    key: "career",
    label: "진로 / 입시",
    icon: <Map className="w-4 h-4" />,
    items: [
      { path: "/student/career/goal", label: "목표 설정", icon: <Target className="w-3.5 h-3.5" /> },
      { path: "/student/career/ai", label: "AI 진로 탐색", icon: <Brain className="w-3.5 h-3.5" /> },
      { path: "/student/career/recommendation", label: "대학·학과 추천", icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { path: "/student/career/admissions", label: "최근 입시 데이터", icon: <Database className="w-3.5 h-3.5" /> },
    ],
  },
  {
    key: "study",
    label: "학습 실행",
    icon: <CheckSquare className="w-4 h-4" />,
    items: [
      { path: "/student/study/plan", label: "주간 학습 계획", icon: <ClipboardList className="w-3.5 h-3.5" /> },
      { path: "/student/study/check", label: "학습 완료 체크", icon: <CheckSquare className="w-3.5 h-3.5" /> },
      { path: "/student/study/alerts", label: "실시간 알림", icon: <Bell className="w-3.5 h-3.5" /> },
    ],
  },
  {
    key: "counseling",
    label: "상담",
    icon: <MessageSquare className="w-4 h-4" />,
    items: [{ path: "/student/counseling", label: "상담 페이지", icon: <MessageSquare className="w-3.5 h-3.5" /> }],
  },
  {
    key: "account",
    label: "계정",
    icon: <User className="w-4 h-4" />,
    items: [{ path: "/student/profile", label: "마이페이지", icon: <User className="w-3.5 h-3.5" /> }],
  },
];

const teacherNav: NavCategory[] = [
  {
    key: "dashboard",
    label: "대시보드",
    icon: <Home className="w-4 h-4" />,
    items: [{ path: "/teacher/dashboard", label: "교사 홈", icon: <Home className="w-3.5 h-3.5" /> }],
  },
  {
    key: "students",
    label: "학생 관리",
    icon: <Users className="w-4 h-4" />,
    items: [
      { path: "/teacher/students/list", label: "학생 목록", icon: <Users className="w-3.5 h-3.5" /> },
      { path: "/teacher/students/detail", label: "학생 상세", icon: <User className="w-3.5 h-3.5" /> },
      { path: "/teacher/students/trend", label: "학생 성적 추이", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { path: "/teacher/students/completion", label: "학습 완료 현황", icon: <CheckSquare className="w-3.5 h-3.5" /> },
    ],
  },
  {
    key: "counseling",
    label: "상담 관리",
    icon: <MessageCircle className="w-4 h-4" />,
    items: [
      { path: "/teacher/counseling/support", label: "상담 지원", icon: <MessageCircle className="w-3.5 h-3.5" /> },
      { path: "/teacher/counseling/memo", label: "상담 메모", icon: <PenTool className="w-3.5 h-3.5" /> },
      { path: "/teacher/counseling/requests", label: "받은 상담 요청", icon: <Inbox className="w-3.5 h-3.5" /> },
    ],
  },
  {
    key: "alerts",
    label: "알림",
    icon: <Bell className="w-4 h-4" />,
    items: [{ path: "/teacher/alerts", label: "교사 알림 센터", icon: <Bell className="w-3.5 h-3.5" /> }],
  },
];

interface SidebarProps {
  role: "student" | "teacher";
  mobileOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  role,
  onNavigate,
}: {
  role: "student" | "teacher";
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const nav = role === "student" ? studentNav : teacherNav;

  const activeCategory = nav.find((cat) =>
    cat.items.some((item) => location.pathname === item.path || location.pathname.startsWith(item.path))
  );

  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(activeCategory ? [activeCategory.key] : [nav[0].key])
  );

  const toggleCategory = (key: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <>
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {nav.map((cat, catIdx) => {
          const isOpen = openCategories.has(cat.key);
          const isCatActive = cat.items.some(
            (item) => location.pathname === item.path || location.pathname.startsWith(item.path)
          );

          return (
            <div key={cat.key}>
              {catIdx > 0 && <div className="h-px bg-sidebar-border mx-1 my-1.5" />}

              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors group ${
                  isCatActive
                    ? "text-sidebar-primary bg-sidebar-accent"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-primary"
                }`}
              >
                <span
                  className={`flex-shrink-0 ${
                    isCatActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-primary"
                  }`}
                >
                  {cat.icon}
                </span>
                <span className="flex-1 text-left font-medium">{cat.label}</span>
                {isOpen
                  ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                }
              </button>

              {/* Sub Items */}
              {isOpen && (
                <div className="ml-3 mt-0.5 border-l border-sidebar-border pl-2 space-y-0.5">
                  {cat.items.map((item) => {
                    const isActive =
                      location.pathname === item.path || location.pathname.startsWith(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          onNavigate?.();
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/70"
                        }`}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom branding */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        <p className="text-xs text-muted-foreground text-center">진로나침반 v1.0</p>
      </div>
    </>
  );
}

export function Sidebar({ role, mobileOpen = false, onClose }: SidebarProps) {
  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ md) ── */}
      <aside className="hidden md:flex w-56 fixed left-0 top-14 bottom-0 bg-sidebar border-r border-sidebar-border z-30 flex-col">
        <SidebarContent role={role} />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 bg-sidebar flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">진</span>
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground">진로나침반</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="메뉴 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <SidebarContent role={role} onNavigate={onClose} />
      </aside>
    </>
  );
}