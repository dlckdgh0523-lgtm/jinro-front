import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout, inputClass, labelClass, primaryBtn, secondaryBtn } from "./AuthLayout";
import { Info, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import {
  consumeGoogleAuthError,
  getErrorMessage,
  signupStudent,
  signupStudentWithGoogle,
  validateInviteCode
} from "../../utils/authApi";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_SIGNUP_PATH = "/signup/student";

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
  const [inviteCodeMessage, setInviteCodeMessage] = useState("");
  const [inviteCodeStatus, setInviteCodeStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [submitError, setSubmitError] = useState(() => consumeGoogleAuthError(STUDENT_SIGNUP_PATH));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInvalid = emailTouched && email.length > 0 && !emailRegex.test(email);
  const emailValid = email.length > 0 && emailRegex.test(email);
  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const inviteCodeInvalid =
    inviteCodeTouched && inviteCode.length > 0 && inviteCodeStatus === "invalid";
  const inviteCodeValid = inviteCode.length > 0 && inviteCodeStatus === "valid";
  const inviteCodeReady = inviteCode.trim().length === 0 || inviteCodeValid;

  const canSubmit =
    name.trim().length > 0 &&
    emailValid &&
    password.length >= 8 &&
    password === passwordConfirm &&
    agreed &&
    inviteCodeReady &&
    !isSubmitting;

  const handleInviteCodeBlur = async () => {
    const normalizedInviteCode = inviteCode.trim().toUpperCase();

    setInviteCodeTouched(true);

    if (!normalizedInviteCode) {
      setInviteCodeStatus("idle");
      setInviteCodeMessage("");
      return;
    }

    setInviteCodeStatus("checking");
    setInviteCodeMessage("Checking invite code...");

    try {
      const invite = await validateInviteCode({ inviteCode: normalizedInviteCode });

      setInviteCode(normalizedInviteCode);
      setInviteCodeStatus("valid");
      setInviteCodeMessage(
        `${invite.schoolName} ${invite.grade} ${invite.className} / ${invite.teacherName}`
      );
    } catch (error) {
      setInviteCodeStatus("invalid");
      setInviteCodeMessage(getErrorMessage(error));
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const session = await signupStudent({
        name: name.trim(),
        email: email.trim(),
        password,
        passwordConfirm,
        inviteCode: inviteCode.trim() ? inviteCode.trim().toUpperCase() : undefined
      });

      navigate(session.nextPath || "/onboarding/1");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await signupStudentWithGoogle();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handlePageShow = () => {
      setIsSubmitting(false);
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <AuthLayout
      title="Student Sign Up"
      subtitle="Create your account and continue to onboarding."
    >
      <div className="space-y-4">
        <button
          className={secondaryBtn}
          type="button"
          onClick={handleGoogleSignup}
          disabled={isSubmitting}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div>
          <label className={labelClass}>
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>
            Email <span className="text-destructive">*</span>
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
              Please enter a valid email address.
            </p>
          )}
          {emailValid && (
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--primary)" }}>
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              Email format looks good.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={inputClass + " pr-10"}
              placeholder="At least 8 characters"
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
            <p className="text-xs text-destructive mt-1">Password must be at least 8 characters.</p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              className={inputClass + " pr-10" + (passwordMismatch ? " border-destructive" : "")}
              placeholder="Re-enter your password"
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
            <p className="text-xs text-destructive mt-1">Passwords do not match.</p>
          )}
          {!passwordMismatch && passwordConfirm.length > 0 && password === passwordConfirm && (
            <p className="text-xs mt-1" style={{ color: "var(--primary)" }}>
              Passwords match.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Teacher Invite Code{" "}
            <span className="text-muted-foreground/60 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            className={
              inputClass +
              (inviteCodeInvalid ? " border-destructive" : "") +
              (inviteCodeValid ? " border-primary" : "")
            }
            placeholder="Example: JN-2026-1A-ABCD"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value.toUpperCase());
              setInviteCodeTouched(true);
              setInviteCodeStatus("idle");
              setInviteCodeMessage("");
            }}
            onBlur={handleInviteCodeBlur}
          />
          {inviteCodeStatus === "checking" && (
            <p className="text-xs text-muted-foreground mt-1">{inviteCodeMessage}</p>
          )}
          {inviteCodeInvalid && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {inviteCodeMessage}
            </p>
          )}
          {inviteCodeValid && (
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--primary)" }}>
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              {inviteCodeMessage}
            </p>
          )}
          {inviteCodeStatus === "idle" && (
            <div className="flex items-start gap-1.5 mt-1.5 p-2.5 bg-secondary/50 rounded-lg">
              <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                If your teacher gave you an invite code, enter it to connect your account to the correct classroom automatically.
              </p>
            </div>
          )}
        </div>

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
            I agree to the{" "}
            <span
              className="underline cursor-pointer hover:opacity-80"
              style={{ color: "var(--primary)" }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/terms");
              }}
            >
              Terms of Service
            </span>{" "}
            and{" "}
            <span
              className="underline cursor-pointer hover:opacity-80"
              style={{ color: "var(--primary)" }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/privacy");
              }}
            >
              Privacy Policy
            </span>
            .
          </label>
        </div>

        {submitError && <p className="text-xs text-destructive">{submitError}</p>}

        <button
          type="button"
          className={primaryBtn}
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ opacity: canSubmit ? 1 : 0.5 }}
        >
          Create Student Account
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <span
          className="cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/login/student")}
        >
          Log in
        </span>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        Are you a teacher?{" "}
        <span
          className="cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/signup/teacher")}
        >
          Teacher sign up
        </span>
      </p>
    </AuthLayout>
  );
}
