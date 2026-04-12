import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "./AuthLayout";
import {
  clearGoogleAuthContext,
  completeGoogleAuth,
  getErrorMessage,
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
        redirectWithError(description || "Google sign-in was cancelled.");
        return;
      }

      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || !state) {
        redirectWithError("Google sign-in could not be completed.");
        return;
      }

      if (!storedContext) {
        redirectWithError("Google sign-in session expired. Please try again.");
        return;
      }

      if (storedContext.state !== state) {
        redirectWithError("Google sign-in state mismatch. Please try again.");
        return;
      }

      try {
        const session = await completeGoogleAuth({ code, state });
        clearGoogleAuthContext();

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
      title="Continue with Google"
      subtitle="Completing your sign in. Please wait a moment."
    >
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Signing you in with Google...</p>
      </div>
    </AuthLayout>
  );
}
