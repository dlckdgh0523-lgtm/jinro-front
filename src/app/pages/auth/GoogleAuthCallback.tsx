import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "./AuthLayout";
import {
  clearGoogleAuthContext,
  completeGoogleAuth,
  getErrorMessage,
  persistAuthSession,
  readGoogleAuthContext,
  redirectGoogleAuthError
} from "../../utils/authApi";

const DEFAULT_FALLBACK_PATH = "/signup/student";

const decodeGoogleErrorDescription = (value: string | null) => {
  if (!value) {
    return "";
  }

  return decodeURIComponent(value.replace(/\+/g, " "));
};

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let active = true;

    const finishGoogleAuth = async () => {
      const storedContext = readGoogleAuthContext();
      const fallbackPath = storedContext?.sourcePath || DEFAULT_FALLBACK_PATH;

      const redirectWithError = (message: string) => {
        redirectGoogleAuthError(fallbackPath, message);
        clearGoogleAuthContext();

        if (active) {
          navigate(fallbackPath, { replace: true });
        }
      };

      const googleError = searchParams.get("error");
      if (googleError) {
        const description = decodeGoogleErrorDescription(searchParams.get("error_description"));
        redirectWithError(description || "Google 로그인이 취소되었습니다.");
        return;
      }

      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || !state) {
        redirectWithError("Google 로그인을 완료하지 못했습니다.");
        return;
      }

      if (!storedContext) {
        redirectWithError("Google 로그인 세션이 만료되었습니다. 다시 시도해 주세요.");
        return;
      }

      if (storedContext.state !== state) {
        redirectWithError("Google 로그인 상태 확인에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      try {
        const session = await completeGoogleAuth({ code, state });
        clearGoogleAuthContext();
        persistAuthSession(session);

        if (active) {
          navigate(session.nextPath || fallbackPath, { replace: true });
        }
      } catch (error) {
        redirectWithError(getErrorMessage(error));
      }
    };

    void finishGoogleAuth();

    return () => {
      active = false;
    };
  }, [navigate, searchParams]);

  return (
    <AuthLayout
      title="Google 로그인 진행 중"
      subtitle="로그인을 완료하고 있습니다. 잠시만 기다려 주세요."
    >
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Google 계정으로 로그인하고 있습니다...</p>
      </div>
    </AuthLayout>
  );
}
