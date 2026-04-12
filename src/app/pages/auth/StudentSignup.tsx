import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout, inputClass, labelClass, primaryBtn, secondaryBtn } from "./AuthLayout";
import { Info, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

// 유효한 초대코드 목록 (실제 서비스에서는 서버 검증으로 대체)
const VALID_INVITE_CODES = [
  "HB-2026-1A", "HB-2026-2B", "HB-2026-3B",
  "HB-2026-1C", "HB-2026-2A", "HB-2026-3C",
  "GN-2026-1A", "GN-2026-2B",
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StudentSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteCodeTouched, setInviteCodeTouched] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // 이메일 유효성
  const emailInvalid = emailTouched && email.length > 0 && !emailRegex.test(email);
  const emailValid = email.length > 0 && emailRegex.test(email);

  // 비밀번호 일치 여부
  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  // 초대코드 검증 (입력했을 때만)
  const inviteCodeInvalid =
    inviteCodeTouched && inviteCode.length > 0 && !VALID_INVITE_CODES.includes(inviteCode);
  const inviteCodeValid =
    inviteCode.length > 0 && VALID_INVITE_CODES.includes(inviteCode);

  const canSubmit =
    name.trim().length > 0 &&
    emailValid &&
    password.length >= 8 &&
    password === passwordConfirm &&
    agreed &&
    !inviteCodeInvalid; // 코드가 입력됐으면 유효해야 함

  return (
    <AuthLayout
      title="학생 회원가입"
      subtitle="진로나침반과 함께 나만의 진로를 찾아보세요"
    >
      <div className="space-y-4">
        {/* Google signup */}
        <button className={secondaryBtn}>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google 계정으로 가입
        </button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* 이름 */}
        <div>
          <label className={labelClass}>
            이름 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className={labelClass}>
            이메일 <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            className={
              inputClass +
              (emailInvalid ? " border-destructive" : "") +
              (emailValid ? " border-primary" : "")
            }
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
          />
          {emailInvalid && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              이메일 형식을 확인해주세요. (예: example@email.com)
            </p>
          )}
          {emailValid && (
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--primary)" }}>
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              올바른 이메일 형식입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className={labelClass}>
            비밀번호 <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={inputClass + " pr-10"}
              placeholder="8자 이상 입력"
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

        {/* 비밀번호 확인 */}
        <div>
          <label className={labelClass}>
            비밀번호 확인 <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              className={inputClass + " pr-10" + (passwordMismatch ? " border-destructive" : "")}
              placeholder="비밀번호를 다시 입력"
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

        {/* 교사 초대코드 (선택) */}
        <div>
          <label className={labelClass}>
            교사 초대코드{" "}
            <span className="text-muted-foreground/60 font-normal">(선택)</span>
          </label>
          <input
            type="text"
            className={
              inputClass +
              (inviteCodeInvalid ? " border-destructive" : "") +
              (inviteCodeValid ? " border-primary" : "")
            }
            placeholder="예: HB-2026-3B"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value.toUpperCase());
              setInviteCodeTouched(true);
            }}
            onBlur={() => setInviteCodeTouched(true)}
          />
          {inviteCodeInvalid && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              없는 초대코드입니다. 다시 확인해주세요!
            </p>
          )}
          {inviteCodeValid && (
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--primary)" }}>
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              유효한 초대코드입니다.
            </p>
          )}
          {!inviteCodeInvalid && !inviteCodeValid && (
            <div className="flex items-start gap-1.5 mt-1.5 p-2.5 bg-secondary/50 rounded-lg">
              <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                담임 선생님께 초대코드를 받은 경우 입력하면 선생님 학급에 자동으로 연결됩니다. 코드가 없어도 가입할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* 이용약관 동의 */}
        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="agree"
            className="mt-0.5 accent-primary"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ colorScheme: "light" }}
          />
          <label htmlFor="agree" className="text-sm text-muted-foreground leading-snug cursor-pointer">
            <span
              className="underline cursor-pointer hover:opacity-80"
              style={{ color: "var(--primary)" }}
              onClick={(e) => { e.preventDefault(); navigate("/terms"); }}
            >
              이용약관
            </span>
            과{" "}
            <span
              className="underline cursor-pointer hover:opacity-80"
              style={{ color: "var(--primary)" }}
              onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}
            >
              개인정보처리방침
            </span>
            에 동의합니다.
          </label>
        </div>

        {/* 가입 버튼 */}
        <button
          className={primaryBtn}
          onClick={() => navigate("/onboarding/1")}
          disabled={!canSubmit}
          style={{ opacity: canSubmit ? 1 : 0.5 }}
        >
          학생 계정 만들기
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        이미 계정이 있으신가요?{" "}
        <span
          className="cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/login/student")}
        >
          로그인
        </span>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        교사이신가요?{" "}
        <span
          className="cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/signup/teacher")}
        >
          교사 회원가입
        </span>
      </p>
    </AuthLayout>
  );
}
