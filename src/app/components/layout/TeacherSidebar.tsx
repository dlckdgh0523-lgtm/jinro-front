import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home, Users, TrendingUp, CheckSquare, Bell,
  MessageCircle, ClipboardList, ChevronDown, ChevronRight,
  UserSquare, BarChart2, Inbox
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
      { label: "교사 홈", path: "/teacher", icon: <Home size={13} /> },
    ],
  },
  {
    label: "학생 관리",
    icon: <Users size={15} />,
    items: [
      { label: "학생 목록", path: "/teacher/student-list", icon: <Users size={13} /> },
      { label: "학생 상세", path: "/teacher/student-detail", icon: <UserSquare size={13} /> },
      { label: "학생 성적 추이", path: "/teacher/grade-trend", icon: <TrendingUp size={13} /> },
      { label: "학습 완료 현황", path: "/teacher/study-status", icon: <CheckSquare size={13} /> },
    ],
  },
  {
    label: "상담 관리",
    icon: <MessageCircle size={15} />,
    items: [
      { label: "상담 지원", path: "/teacher/counseling-support", icon: <MessageCircle size={13} /> },
      { label: "상담 메모", path: "/teacher/counseling-memo", icon: <ClipboardList size={13} /> },
      { label: "받은 상담 요청", path: "/teacher/received-requests", icon: <Inbox size={13} /> },
    ],
  },
  {
    label: "알림",
    icon: <Bell size={15} />,
    items: [
      { label: "교사 알림 센터", path: "/teacher/notifications", icon: <Bell size={13} /> },
    ],
  },
];

interface TeacherSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function TeacherSidebar({ isOpen = true, onClose }: TeacherSidebarProps) {
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
    if (path === "/teacher") return location.pathname === "/teacher" || location.pathname === "/teacher/";
    return location.pathname.startsWith(path);
  };

  const activeCategoryLabel = categories.find((cat) =>
    cat.items.some((item) => isActive(item.path))
  )?.label;

  return (
    <>
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

        {/* Teacher info */}
        <div
          className="px-4 py-3 mx-3 mb-4 rounded-xl"
          style={{ background: "var(--brand-peach)" }}
        >
          <p className="text-xs" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>
            박지영 선생님
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-muted)" }}>
            한빛고등학교 · 3학년 B반
          </p>
          <div
            className="mt-2 px-2 py-1 rounded text-xs inline-block"
            style={{ background: "var(--brand-coral)", color: "white", fontWeight: 600 }}
          >
            초대코드 HB-2026-3B
          </div>
        </div>
      </aside>
    </>
  );
}
