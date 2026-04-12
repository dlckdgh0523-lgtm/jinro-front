import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./Header";
import { StudentSidebar } from "./StudentSidebar";
import { TeacherSidebar } from "./TeacherSidebar";

interface AppShellProps {
  role: "student" | "teacher";
}

// Breadcrumb labels map
const breadcrumbMap: Record<string, string> = {
  "/student": "학생 홈",
  "/student/grades": "성적 입력",
  "/student/grade-trend": "성적 변화 추이",
  "/student/growth-report": "성장 리포트",
  "/student/goal": "목표 설정",
  "/student/ai-career": "AI 진로 탐색",
  "/student/university": "대학·학과 추천",
  "/student/admissions": "최근 입시 데이터",
  "/student/weekly-plan": "주간 학습 계획",
  "/student/study-check": "학습 완료 체크",
  "/student/notifications": "실시간 알림",
  "/student/counseling": "상담 페이지",
  "/student/mypage": "마이페이지",
  "/teacher": "교사 홈",
  "/teacher/student-list": "학생 목록",
  "/teacher/student-detail": "학생 상세",
  "/teacher/grade-trend": "학생 성적 추이",
  "/teacher/study-status": "학습 완료 현황",
  "/teacher/notifications": "알림 센터",
  "/teacher/counseling-support": "상담 지원",
  "/teacher/counseling-memo": "상담 메모",
  "/teacher/received-requests": "받은 상담 요청",
};

const categoryMap: Record<string, string> = {
  "/student": "대시보드",
  "/student/grades": "학업 관리",
  "/student/grade-trend": "학업 관리",
  "/student/growth-report": "학업 관리",
  "/student/goal": "진로 / 입시",
  "/student/ai-career": "진로 / 입시",
  "/student/university": "진로 / 입시",
  "/student/admissions": "진로 / 입시",
  "/student/weekly-plan": "학습 실행",
  "/student/study-check": "학습 실행",
  "/student/notifications": "학습 실행",
  "/student/counseling": "상담",
  "/student/mypage": "계정",
  "/teacher": "대시보드",
  "/teacher/student-list": "학생 관리",
  "/teacher/student-detail": "학생 관리",
  "/teacher/grade-trend": "학생 관리",
  "/teacher/study-status": "학생 관리",
  "/teacher/notifications": "알림",
  "/teacher/counseling-support": "상담 관리",
  "/teacher/counseling-memo": "상담 관리",
  "/teacher/received-requests": "상담 관리",
};

export function AppShell({ role }: AppShellProps) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const pageName = breadcrumbMap[location.pathname] || "";
  const categoryName = categoryMap[location.pathname] || "";

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        userRole={role}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      {role === "student" ? (
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      ) : (
        <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main
        className="min-h-screen"
        style={{
          paddingTop: "64px",
          paddingLeft: sidebarOpen ? "240px" : "0px",
          transition: "padding-left 0.25s ease",
        }}
      >
        <div className="p-6">
          {/* Breadcrumb */}
          {(categoryName || pageName) && (
            <div className="flex items-center gap-2 mb-4" style={{ fontSize: "0.78rem", color: "var(--brand-text-muted)" }}>
              <span>{role === "student" ? "학생" : "교사"}</span>
              {categoryName && (
                <>
                  <span style={{ color: "var(--brand-text-light)" }}>›</span>
                  <span>{categoryName}</span>
                </>
              )}
              {pageName && (
                <>
                  <span style={{ color: "var(--brand-text-light)" }}>›</span>
                  <span style={{ color: "var(--brand-coral)", fontWeight: 600 }}>{pageName}</span>
                </>
              )}
            </div>
          )}

          <Outlet />
        </div>
      </main>
    </div>
  );
}
