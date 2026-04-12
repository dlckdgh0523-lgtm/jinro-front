import React from "react";
import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/AppShell";

// Public pages
import { Landing } from "./pages/Landing";
import { StudentLogin } from "./pages/auth/StudentLogin";
import { TeacherLogin } from "./pages/auth/TeacherLogin";
import { StudentSignup } from "./pages/auth/StudentSignup";
import { TeacherSignup } from "./pages/auth/TeacherSignup";
import { GoogleAuthCallback } from "./pages/auth/GoogleAuthCallback";
import { TermsOfService } from "./pages/legal/TermsOfService";
import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";

// Onboarding
import { OnboardingStep1 } from "./pages/onboarding/Step1";
import { OnboardingStep2 } from "./pages/onboarding/Step2";
import { OnboardingStep3 } from "./pages/onboarding/Step3";

// Student pages
import { StudentDashboard } from "./pages/student/Dashboard";
import { GradeInput } from "./pages/student/GradeInput";
import { GradeTrend } from "./pages/student/GradeTrend";
import { GrowthReport } from "./pages/student/GrowthReport";
import { GoalSetting } from "./pages/student/GoalSetting";
import { AIChat } from "./pages/student/AIChat";
import { UniversityRecommendation } from "./pages/student/UniversityRecommendation";
import { AdmissionsData } from "./pages/student/AdmissionsData";
import { WeeklyPlan } from "./pages/student/WeeklyPlan";
import { CompletionCheck } from "./pages/student/CompletionCheck";
import { AlertCenter } from "./pages/student/AlertCenter";
import { StudentCounseling } from "./pages/student/Counseling";
import { MyPage } from "./pages/student/MyPage";

// Teacher pages
import { TeacherDashboard } from "./pages/teacher/Dashboard";
import { StudentList } from "./pages/teacher/StudentList";
import { StudentDetail } from "./pages/teacher/StudentDetail";
import { TeacherGradeTrend } from "./pages/teacher/GradeTrend";
import { CompletionStatus } from "./pages/teacher/CompletionStatus";
import { TeacherAlertCenter } from "./pages/teacher/AlertCenter";
import { CounselingSupport } from "./pages/teacher/CounselingSupport";
import { CounselingMemo } from "./pages/teacher/CounselingMemo";
import { ReceivedRequests } from "./pages/teacher/ReceivedRequests";

export const router = createBrowserRouter([
  // Public routes
  { path: "/", Component: Landing },
  { path: "/login/student", Component: StudentLogin },
  { path: "/login/teacher", Component: TeacherLogin },
  { path: "/signup/student", Component: StudentSignup },
  { path: "/signup/teacher", Component: TeacherSignup },
  { path: "/auth/google/callback", Component: GoogleAuthCallback },
  { path: "/terms", Component: TermsOfService },
  { path: "/privacy", Component: PrivacyPolicy },
  { path: "/onboarding/1", Component: OnboardingStep1 },
  { path: "/onboarding/2", Component: OnboardingStep2 },
  { path: "/onboarding/3", Component: OnboardingStep3 },

  // Student routes
  {
    path: "/student",
    element: <AppShell role="student" userName="김민준" schoolName="한빛고등학교" alertCount={3} />,
    children: [
      { path: "dashboard", Component: StudentDashboard },
      { path: "grades/input", Component: GradeInput },
      { path: "grades/trend", Component: GradeTrend },
      { path: "grades/report", Component: GrowthReport },
      { path: "career/goal", Component: GoalSetting },
      { path: "career/ai", Component: AIChat },
      { path: "career/recommendation", Component: UniversityRecommendation },
      { path: "career/admissions", Component: AdmissionsData },
      { path: "study/plan", Component: WeeklyPlan },
      { path: "study/check", Component: CompletionCheck },
      { path: "study/alerts", Component: AlertCenter },
      { path: "counseling", Component: StudentCounseling },
      { path: "profile", Component: MyPage },
    ],
  },

  // Teacher routes
  {
    path: "/teacher",
    element: <AppShell role="teacher" userName="박지영" schoolName="한빛고등학교" alertCount={4} />,
    children: [
      { path: "dashboard", Component: TeacherDashboard },
      { path: "students/list", Component: StudentList },
      { path: "students/detail", Component: StudentDetail },
      { path: "students/trend", Component: TeacherGradeTrend },
      { path: "students/completion", Component: CompletionStatus },
      { path: "alerts", Component: TeacherAlertCenter },
      { path: "counseling/support", Component: CounselingSupport },
      { path: "counseling/memo", Component: CounselingMemo },
      { path: "counseling/requests", Component: ReceivedRequests },
    ],
  },
]);
