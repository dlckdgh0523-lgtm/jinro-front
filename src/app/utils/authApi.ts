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

export const getGoogleAuthUrl = () => getJson<GoogleAuthUrlResponse>("/v1/auth/google");

export const startGoogleAuth = async () => {
  const response = await getGoogleAuthUrl();

  if (!response.authUrl) {
    throw new Error("No authUrl received from server.");
  }

  window.location.assign(response.authUrl);
};

export const loginStudentWithGoogle = startGoogleAuth;

export const loginTeacherWithGoogle = startGoogleAuth;

export const signupStudentWithGoogle = startGoogleAuth;

export const signupTeacherWithGoogle = startGoogleAuth;

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
