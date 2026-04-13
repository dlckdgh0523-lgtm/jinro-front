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

type StoredAuthSession = AuthSessionResponse;

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

const AUTH_SESSION_KEY = "jinro.authSession";

export const getApiBaseUrl = () => {
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!rawBaseUrl || !rawBaseUrl.trim()) {
    throw new Error("API 서버 주소가 설정되지 않았습니다.");
  }

  return rawBaseUrl.trim().replace(/\/+$/, "");
};

const canUseSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

export const persistAuthSession = (session: StoredAuthSession) => {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const readAuthSession = (): StoredAuthSession | null => {
  if (!canUseSessionStorage()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAuthSession>;

    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.streamToken !== "string" ||
      typeof parsed.nextPath !== "string" ||
      !parsed.user ||
      typeof parsed.user.id !== "string" ||
      typeof parsed.user.role !== "string" ||
      typeof parsed.user.email !== "string" ||
      typeof parsed.user.name !== "string" ||
      typeof parsed.user.schoolName !== "string"
    ) {
      window.sessionStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }

    return parsed as StoredAuthSession;
  } catch {
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
};

export const updateAuthSession = (patch: Partial<StoredAuthSession>) => {
  const current = readAuthSession();

  if (!current) {
    return;
  }

  persistAuthSession({
    ...current,
    ...patch,
    user: {
      ...current.user,
      ...(patch.user ?? {})
    }
  });
};

export const clearAuthSession = () => {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
};

const AUTH_MESSAGE_MAP: Record<string, string> = {
  "Missing VITE_API_BASE_URL configuration.": "API 서버 주소가 설정되지 않았습니다.",
  "Unexpected response from server.": "서버 응답을 확인하지 못했습니다.",
  "Unexpected error.": "알 수 없는 오류가 발생했습니다.",
  "Google OAuth can only be started in the browser.": "Google 로그인은 브라우저에서만 시작할 수 있습니다.",
  "No authUrl received from server.": "Google 로그인 주소를 받아오지 못했습니다.",
  "Google sign-in was cancelled.": "Google 로그인이 취소되었습니다.",
  "Google sign-in could not be completed.": "Google 로그인을 완료하지 못했습니다.",
  "Google sign-in session expired. Please try again.": "Google 로그인 세션이 만료되었습니다. 다시 시도해 주세요.",
  "Google sign-in state mismatch. Please try again.": "Google 로그인 상태 확인에 실패했습니다. 다시 시도해 주세요.",
  "Invalid credentials.": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "Inactive account.": "비활성화된 계정입니다.",
  "Email is already registered.": "이미 가입된 이메일입니다.",
  "Invite code not found.": "초대 코드를 찾을 수 없습니다.",
  "Selected classroom already has an owner.": "선택한 반에는 이미 담임 선생님이 있습니다.",
  "Google OAuth not configured.": "Google 로그인 설정이 완료되지 않았습니다.",
  "Google OAuth token exchange failed.": "Google 로그인 인증을 완료하지 못했습니다.",
  "Google ID token verification failed.": "Google 계정 정보를 확인하지 못했습니다.",
  "Google user provisioning failed.": "Google 계정으로 회원 정보를 생성하지 못했습니다.",
  "Google session creation failed.": "로그인 세션을 생성하지 못했습니다.",
  "Failed to get ID token from Google.": "Google 인증 토큰을 받지 못했습니다.",
  "Invalid ID token payload.": "Google 계정 정보를 확인하지 못했습니다.",
  "User not found.": "사용자 정보를 찾을 수 없습니다.",
  "Profile not found.": "프로필 정보를 찾을 수 없습니다.",
  "Google sign-in is not available for this account.": "이 계정으로는 Google 로그인을 사용할 수 없습니다.",
  "Unexpected server error.": "서버 오류가 발생했습니다.",
  "Request validation failed.": "요청 값이 올바르지 않습니다."
};

const getDefaultErrorMessage = (status: number) => `요청 처리 중 오류가 발생했습니다. (HTTP ${status})`;

const translateAuthMessage = (message: string) => AUTH_MESSAGE_MAP[message] ?? message;

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
      throw new Error(translateAuthMessage(parsed.error.message));
    }

    throw new Error(getDefaultErrorMessage(response.status));
  }

  if (!parsed || !parsed.success) {
    throw new Error("서버 응답을 확인하지 못했습니다.");
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
      throw new Error(translateAuthMessage(parsed.error.message));
    }

    throw new Error(getDefaultErrorMessage(response.status));
  }

  if (!parsed || !parsed.success) {
    throw new Error("서버 응답을 확인하지 못했습니다.");
  }

  return parsed.data;
};

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? translateAuthMessage(error.message) : "알 수 없는 오류가 발생했습니다.";

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

const createGoogleAuthState = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `google-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getFrontendGoogleCallbackUrl = () => {
  if (typeof window === "undefined") {
    throw new Error("Google 로그인은 브라우저에서만 시작할 수 있습니다.");
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
      throw new Error("Google 로그인 주소를 받아오지 못했습니다.");
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

export const refreshAuthSession = (refreshToken: string) =>
  postJson<AuthSessionResponse>("/v1/auth/refresh", { refreshToken });

export const logoutAuthSession = (refreshToken: string) =>
  postJson<{ loggedOut: true }>("/v1/auth/logout", { refreshToken });
