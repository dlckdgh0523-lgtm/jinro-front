import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowLeft, GraduationCap, Users } from "lucide-react";

interface AuthPageProps {
  mode: "student-login" | "teacher-login" | "student-signup" | "teacher-signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [school, setSchool] = useState("");
  const [schoolQuery, setSchoolQuery] = useState("");

  const isStudent = mode.startsWith("student");
  const isLogin = mode.endsWith("login");

  const title = isLogin
    ? isStudent ? "학생 로그인" : "교사 로그인"
    : isStudent ? "학생 회원가입" : "교사 회원가입";

  const subtitle = isLogin
    ? isStudent ? "학생 계정으로 로그인하세요" : "교사 계정으로 로그인하세요"
    : isStudent ? "진로나침반 학생 계정을 만드세요" : "진로나침반 교사 계정을 만드세요";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      navigate(isStudent ? "/student" : "/teacher");
    } else {
      navigate(isStudent ? "/onboarding/1" : "/teacher");
    }
  };

  const handleGoogleAuth = () => {
    if (isLogin) {
      navigate(isStudent ? "/student" : "/teacher");
    } else {
      navigate(isStudent ? "/onboarding/1" : "/teacher");
    }
  };

  const schoolSuggestions = ["한빛고등학교", "서울고등학교", "강남고등학교", "경기고등학교", "부산고등학교"]
    .filter((s) => schoolQuery && s.includes(schoolQuery));

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--brand-text-muted)" }}
        >
          <ArrowLeft size={14} />
          홈으로
        </button>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 40px rgba(193,123,110,0.1)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
              style={{ background: "linear-gradient(135deg, #C17B6E 0%, #D4906A 100%)" }}
            >
              🧭
            </div>
            <h1 className="text-xl" style={{ color: "var(--brand-text)", fontWeight: 700 }}>
              {title}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--brand-text-muted)" }}>
              {subtitle}
            </p>

            {/* Role badge */}
            <div
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
            >
              {isStudent ? <GraduationCap size={12} /> : <Users size={12} />}
              {isStudent ? "학생" : "교사"} 계정
            </div>
          </div>

          {/* Google OAuth button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl mb-4 transition-colors hover:bg-accent"
            style={{
              border: "1.5px solid var(--border)",
              background: "var(--card)",
              color: "var(--brand-text)",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google 계정으로 {isLogin ? "로그인" : "가입"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--brand-text-light)" }}>또는 이메일로</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 rounded-xl outline-none transition-all"
                  style={{
                    height: "48px",
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--brand-text)",
                    fontSize: "0.9rem",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand-coral)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@school.kr"
                className="w-full px-4 rounded-xl outline-none transition-all"
                style={{
                  height: "48px",
                  background: "var(--input-background)",
                  border: "1.5px solid var(--border)",
                  color: "var(--brand-text)",
                  fontSize: "0.9rem",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--brand-coral)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 pr-12 rounded-xl outline-none transition-all"
                  style={{
                    height: "48px",
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--brand-text)",
                    fontSize: "0.9rem",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand-coral)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPw ? <EyeOff size={16} style={{ color: "var(--brand-text-muted)" }} /> : <Eye size={16} style={{ color: "var(--brand-text-muted)" }} />}
                </button>
              </div>
            </div>

            {/* Student signup: invite code */}
            {!isLogin && isStudent && (
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                  교사 초대코드
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="예: HB-2026-3B"
                  className="w-full px-4 rounded-xl outline-none transition-all"
                  style={{
                    height: "48px",
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--brand-text)",
                    fontSize: "0.9rem",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand-coral)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <p className="text-xs mt-1.5" style={{ color: "var(--brand-text-muted)" }}>
                  담임 선생님께 초대코드를 받아 입력하세요. 없으면 나중에 입력해도 됩니다.
                </p>
              </div>
            )}

            {/* Teacher signup: school */}
            {!isLogin && !isStudent && (
              <div className="relative">
                <label className="block text-sm mb-1.5" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                  학교 이름 <span style={{ color: "var(--brand-coral)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={schoolQuery}
                  onChange={(e) => { setSchoolQuery(e.target.value); setSchool(""); }}
                  placeholder="학교명 검색"
                  className="w-full px-4 rounded-xl outline-none transition-all"
                  style={{
                    height: "48px",
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--brand-text)",
                    fontSize: "0.9rem",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand-coral)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                {schoolSuggestions.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10"
                    style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(193,123,110,0.1)" }}
                  >
                    {schoolSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="w-full text-left px-4 py-3 text-sm hover:bg-accent transition-colors"
                        style={{ color: "var(--brand-text)" }}
                        onClick={() => { setSchool(s); setSchoolQuery(s); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs mt-1.5" style={{ color: "var(--brand-text-muted)" }}>
                  학교명을 입력해야 다음 단계로 진행됩니다.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white transition-opacity hover:opacity-90 mt-2"
              style={{
                height: "48px",
                background: "var(--brand-coral)",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              {isLogin ? "로그인" : "가입하기"}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm" style={{ color: "var(--brand-text-muted)" }}>
            {isLogin ? (
              <>
                아직 계정이 없으신가요?{" "}
                <button
                  onClick={() => navigate(isStudent ? "/student/signup" : "/teacher/signup")}
                  style={{ color: "var(--brand-coral)", fontWeight: 600 }}
                >
                  회원가입
                </button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{" "}
                <button
                  onClick={() => navigate(isStudent ? "/student/login" : "/teacher/login")}
                  style={{ color: "var(--brand-coral)", fontWeight: 600 }}
                >
                  로그인
                </button>
              </>
            )}
          </div>

          {/* Switch role */}
          <div className="mt-3 text-center text-sm">
            <button
              onClick={() => navigate(isStudent ? "/teacher/login" : "/student/login")}
              style={{ color: "var(--brand-text-light)", fontSize: "0.8rem" }}
            >
              {isStudent ? "교사 계정으로" : "학생 계정으로"} {isLogin ? "로그인" : "가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
