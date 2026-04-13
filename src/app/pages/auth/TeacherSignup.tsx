import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthLayout, inputClass, labelClass, primaryBtn, secondaryBtn } from "./AuthLayout";
import { Search, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import {
  consumeGoogleAuthError,
  getErrorMessage,
  persistAuthSession,
  signupTeacher,
  signupTeacherWithGoogle
} from "../../utils/authApi";

const SAMPLE_SCHOOLS = [
  "서울고등학교",
  "강남고등학교",
  "마포고등학교",
  "한강고등학교",
  "진로아카데미",
  "남산고등학교",
  "스카이라인고등학교",
  "중앙고등학교"
];

const GRADES = ["1학년", "2학년", "3학년"];
const CLASS_NUMS = Array.from({ length: 10 }, (_, i) => `${i + 1}반`);
const TEACHER_SIGNUP_PATH = "/signup/teacher";

const GoogleIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export function TeacherSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [agreed, setAgreed] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [grade, setGrade] = useState("");
  const [classNum, setClassNum] = useState("");
  const [subject, setSubject] = useState("");
  const [submitError, setSubmitError] = useState(() => consumeGoogleAuthError(TEACHER_SIGNUP_PATH));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = SAMPLE_SCHOOLS.filter(
    (school) => school.includes(schoolSearch) && schoolSearch.length > 0
  );

  const selectSchool = (school: string) => {
    setSelectedSchool(school);
    setSchoolSearch(school);
    setShowDropdown(false);
  };

  const step1CanProceed = agreed;
  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const step2CanSubmit =
    selectedSchool.length > 0 &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    password === passwordConfirm &&
    grade.length > 0 &&
    classNum.length > 0 &&
    !isSubmitting;

  const handleGoogleSignup = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await signupTeacherWithGoogle();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.has("code") || searchParams.has("error")) {
      navigate(`/auth/google/callback${location.search}`, { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const handlePageShow = () => {
      setIsSubmitting(false);
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleEmailNext = () => {
    if (step1CanProceed) {
      setSubmitError("");
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (!step2CanSubmit) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const session = await signupTeacher({
        schoolName: selectedSchool,
        name: name.trim(),
        email: email.trim(),
        password,
        passwordConfirm,
        grade,
        classNum,
        subject: subject.trim() || undefined
      });

      persistAuthSession(session);
      navigate(session.nextPath || "/teacher/dashboard");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="교사 회원가입"
      subtitle="교사 계정을 만들고 학급을 관리하세요."
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              step === 1
                ? "bg-primary text-primary-foreground"
                : "bg-primary/20 text-primary"
            }`}
          >
            {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
          </div>
            <span className={`text-xs ${step === 1 ? "text-foreground" : "text-muted-foreground"}`}>
              약관 동의
            </span>
        </div>
        <div className="flex-1 h-px bg-border mx-2" />
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              step === 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
            <span className={`text-xs ${step === 2 ? "text-foreground" : "text-muted-foreground"}`}>
              정보 입력
            </span>
        </div>
      </div>

      {submitError && <p className="text-xs text-destructive mb-4">{submitError}</p>}

      {step === 1 && (
        <div className="space-y-4">
          <button className={secondaryBtn} type="button" onClick={handleGoogleSignup} disabled={isSubmitting}>
            <GoogleIcon />
            Google로 계속하기
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">또는 이메일로 계속하기</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="p-4 bg-secondary/40 rounded-xl border border-border space-y-3">
            <p className="text-sm text-foreground font-medium">약관 동의</p>
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="agree"
                className="mt-0.5 accent-primary"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ colorScheme: "light" }}
              />
              <label
                htmlFor="agree"
                className="text-sm text-muted-foreground leading-snug cursor-pointer"
              >
                아래 약관에 동의합니다.{" "}
                <span
                  className="underline hover:opacity-80"
                  style={{ color: "var(--primary)" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/terms");
                  }}
                >
                  서비스 이용약관
                </span>{" "}
                및{" "}
                <span
                  className="underline hover:opacity-80"
                  style={{ color: "var(--primary)" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/privacy");
                  }}
                >
                  개인정보처리방침
                </span>
                . <span className="text-destructive">(필수)</span>
              </label>
            </div>
          </div>

          <button
            className={primaryBtn}
            type="button"
            onClick={handleEmailNext}
            disabled={!step1CanProceed}
            style={{ opacity: step1CanProceed ? 1 : 0.5 }}
          >
            이메일로 계속하기
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              학교 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className={inputClass + " pr-10"}
                placeholder="학교명을 입력하세요 (예: 서울고등학교)"
                value={schoolSearch}
                onChange={(e) => {
                  setSchoolSearch(e.target.value);
                  setSelectedSchool("");
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              학교명이 목록에 없으면 정확하게 입력해주세요. (현재는 직접 입력 기반)
            </p>
            {showDropdown && filtered.length > 0 && (
              <div className="mt-1 bg-card border border-border rounded-xl shadow-md overflow-hidden z-10 relative">
                {filtered.map((school) => (
                  <button
                    key={school}
                    type="button"
                    className="w-full text-left px-3.5 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                    onClick={() => selectSchool(school)}
                  >
                    {school}
                  </button>
                ))}
              </div>
            )}
            {selectedSchool ? (
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--primary)" }}>
                <CheckCircle2 className="w-3 h-3" /> {selectedSchool} 선택됨
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1.5">
                학교를 검색하고 선택해 주세요.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              이름 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              이메일 <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="teacher@school.ac.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              비밀번호 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass + " pr-10"}
                placeholder="8자 이상 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-destructive mt-1">비밀번호는 8자 이상이어야 합니다.</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              비밀번호 확인 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                className={inputClass + " pr-10" + (passwordMismatch ? " border-destructive" : "")}
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordMismatch && (
              <p className="text-xs text-destructive mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
            {!passwordMismatch && passwordConfirm.length > 0 && password === passwordConfirm && (
              <p className="text-xs mt-1" style={{ color: "var(--primary)" }}>
                비밀번호가 일치합니다.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                학년 <span className="text-destructive">*</span>
              </label>
              <select
                className={inputClass + " cursor-pointer"}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="">학년 선택</option>
                {GRADES.map((gradeOption) => (
                  <option key={gradeOption} value={gradeOption}>
                    {gradeOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                반 <span className="text-destructive">*</span>
              </label>
              <select
                className={inputClass + " cursor-pointer"}
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
              >
                <option value="">반 선택</option>
                {CLASS_NUMS.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              담당 과목 <span className="text-muted-foreground/60 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="예: 수학, 영어"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              className="flex-1 h-11 rounded-xl border border-border bg-card text-foreground text-sm hover:bg-secondary transition-colors"
              onClick={handleBack}
            >
              이전
            </button>
            <button
              type="button"
              className="flex-[2] h-11 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              onClick={handleSubmit}
              disabled={!step2CanSubmit}
              style={{ opacity: step2CanSubmit ? 1 : 0.5 }}
            >
              교사 계정 만들기
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        이미 계정이 있으신가요?{" "}
        <span
          className="cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/login/teacher")}
        >
          로그인
        </span>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        학생이신가요?{" "}
        <span
          className="cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/signup/student")}
        >
          학생 회원가입
        </span>
      </p>
    </AuthLayout>
  );
}
