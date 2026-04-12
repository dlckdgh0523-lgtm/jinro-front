type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
  meta?: Record<string, unknown>;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
};

type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure;

export type AuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
  streamToken: string;
  nextPath: string;
  user: {
    id: string;
    role: string;
    email: string;
    name: string;
    schoolName: string;
    grade?: string;
    track?: string;
    inviteCode?: string;
    onboardingCompleted?: boolean;
  };
};

export type InviteValidationResponse = {
  valid: true;
  inviteCode: string;
  schoolName: string;
  grade: string;
  className: string;
  teacherName: string;
  classRoomId: string;
};

type StudentSignupPayload = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  inviteCode?: string;
};

type TeacherSignupPayload = {
  schoolName: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  grade: string;
  classNum: string;
  subject?: string;
};

const getApiBaseUrl = () => {
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!rawBaseUrl || !rawBaseUrl.trim()) {
    throw new Error("Missing VITE_API_BASE_URL configuration.");
  }

  return rawBaseUrl.trim().replace(/\/+$/, "");
};

const getDefaultErrorMessage = (status: number) => `Request failed with status ${status}.`;

const parseResponse = async <TData>(response: Response): Promise<ApiResponse<TData> | null> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiResponse<TData>;
  } catch {
    return null;
  }
};

const postJson = async <TData>(path: string, payload: unknown): Promise<TData> => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const parsed = await parseResponse<TData>(response);

  if (!response.ok) {
    if (parsed && !parsed.success) {
      throw new Error(parsed.error.message);
    }

    throw new Error(getDefaultErrorMessage(response.status));
  }

  if (!parsed || !parsed.success) {
    throw new Error("Unexpected response from server.");
  }

  return parsed.data;
};

const getJson = async <TData>(path: string): Promise<TData> => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  const parsed = await parseResponse<TData>(response);

  if (!response.ok) {
    if (parsed && !parsed.success) {
      throw new Error(parsed.error.message);
    }

    throw new Error(getDefaultErrorMessage(response.status));
  }

  if (!parsed || !parsed.success) {
    throw new Error("Unexpected response from server.");
  }

  return parsed.data;
};

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

export type GoogleAuthUrlResponse = {
  authUrl: string;
};

type GoogleAuthIntent = "login" | "signup";

type GoogleAuthRole = "student" | "teacher";

type GoogleAuthContext = {
  state: string;
  sourcePath: string;
  role: GoogleAuthRole;
  intent: GoogleAuthIntent;
  createdAt: number;
};

type GoogleAuthErrorState = {
  sourcePath: string;
  message: string;
  createdAt: number;
};

const GOOGLE_AUTH_CONTEXT_KEY = "jinro.googleAuthContext";
const GOOGLE_AUTH_ERROR_KEY = "jinro.googleAuthError";
const GOOGLE_AUTH_CALLBACK_PATH = "/auth/google/callback";
const GOOGLE_AUTH_TTL_MS = 10 * 60 * 1000;

const canUseSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const createGoogleAuthState = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `google-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getFrontendGoogleCallbackUrl = () => {
  if (typeof window === "undefined") {
    throw new Error("Google OAuth can only be started in the browser.");
  }

  return `${window.location.origin}${GOOGLE_AUTH_CALLBACK_PATH}`;
};

const persistGoogleAuthContext = (context: GoogleAuthContext) => {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(GOOGLE_AUTH_CONTEXT_KEY, JSON.stringify(context));
};

const isExpiredGoogleAuthState = (createdAt: number) =>
  Date.now() - createdAt > GOOGLE_AUTH_TTL_MS;

export const clearGoogleAuthContext = () => {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(GOOGLE_AUTH_CONTEXT_KEY);
};

export const readGoogleAuthContext = (): GoogleAuthContext | null => {
  if (!canUseSessionStorage()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(GOOGLE_AUTH_CONTEXT_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GoogleAuthContext>;

    if (
      typeof parsed.state !== "string" ||
      typeof parsed.sourcePath !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.intent !== "string" ||
      typeof parsed.createdAt !== "number"
    ) {
      clearGoogleAuthContext();
      return null;
    }

    if (isExpiredGoogleAuthState(parsed.createdAt)) {
      clearGoogleAuthContext();
      return null;
    }

    return parsed as GoogleAuthContext;
  } catch {
    clearGoogleAuthContext();
    return null;
  }
};

const persistGoogleAuthError = (payload: GoogleAuthErrorState) => {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(GOOGLE_AUTH_ERROR_KEY, JSON.stringify(payload));
};

export const consumeGoogleAuthError = (sourcePath: string) => {
  if (!canUseSessionStorage()) {
    return "";
  }

  const raw = window.sessionStorage.getItem(GOOGLE_AUTH_ERROR_KEY);

  if (!raw) {
    return "";
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GoogleAuthErrorState>;

    if (
      typeof parsed.sourcePath !== "string" ||
      typeof parsed.message !== "string" ||
      typeof parsed.createdAt !== "number"
    ) {
      window.sessionStorage.removeItem(GOOGLE_AUTH_ERROR_KEY);
      return "";
    }

    if (parsed.sourcePath !== sourcePath || isExpiredGoogleAuthState(parsed.createdAt)) {
      if (parsed.sourcePath === sourcePath || isExpiredGoogleAuthState(parsed.createdAt)) {
        window.sessionStorage.removeItem(GOOGLE_AUTH_ERROR_KEY);
      }

      return "";
    }

    window.sessionStorage.removeItem(GOOGLE_AUTH_ERROR_KEY);
    return parsed.message;
  } catch {
    window.sessionStorage.removeItem(GOOGLE_AUTH_ERROR_KEY);
    return "";
  }
};

const buildGoogleAuthorizeUrl = (authUrl: string, state: string) => {
  const url = new URL(authUrl);
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", getFrontendGoogleCallbackUrl());
  return url.toString();
};

export const getGoogleAuthUrl = () => getJson<GoogleAuthUrlResponse>("/v1/auth/google");

export const startGoogleAuth = async (input: {
  sourcePath: string;
  role: GoogleAuthRole;
  intent: GoogleAuthIntent;
}) => {
  const context: GoogleAuthContext = {
    state: createGoogleAuthState(),
    sourcePath: input.sourcePath,
    role: input.role,
    intent: input.intent,
    createdAt: Date.now()
  };

  persistGoogleAuthContext(context);

  try {
    const response = await getGoogleAuthUrl();

    if (!response.authUrl) {
      throw new Error("No authUrl received from server.");
    }

    window.location.assign(buildGoogleAuthorizeUrl(response.authUrl, context.state));
  } catch (error) {
    clearGoogleAuthContext();
    throw error;
  }
};

export const completeGoogleAuth = (payload: { code: string; state: string }) =>
  getJson<AuthSessionResponse>(
    `/v1/auth/google/callback?code=${encodeURIComponent(payload.code)}&state=${encodeURIComponent(payload.state)}`
  );

export const redirectGoogleAuthError = (sourcePath: string, message: string) => {
  persistGoogleAuthError({
    sourcePath,
    message,
    createdAt: Date.now()
  });
};

export const loginStudentWithGoogle = () =>
  startGoogleAuth({ sourcePath: "/login/student", role: "student", intent: "login" });

export const loginTeacherWithGoogle = () =>
  startGoogleAuth({ sourcePath: "/login/teacher", role: "teacher", intent: "login" });

export const signupStudentWithGoogle = () =>
  startGoogleAuth({ sourcePath: "/signup/student", role: "student", intent: "signup" });

export const signupTeacherWithGoogle = () =>
  startGoogleAuth({ sourcePath: "/signup/teacher", role: "teacher", intent: "signup" });

export const loginStudent = (payload: { email: string; password: string }) =>
  postJson<AuthSessionResponse>("/v1/auth/student/login", payload);

export const loginTeacher = (payload: { email: string; password: string }) =>
  postJson<AuthSessionResponse>("/v1/auth/teacher/login", payload);

export const signupStudent = (payload: StudentSignupPayload) =>
  postJson<AuthSessionResponse>("/v1/auth/student/signup", payload);

export const signupTeacher = (payload: TeacherSignupPayload) =>
  postJson<AuthSessionResponse>("/v1/auth/teacher/signup", payload);

export const validateInviteCode = (payload: { inviteCode: string }) =>
  postJson<InviteValidationResponse>("/v1/auth/invite/validate", payload);
