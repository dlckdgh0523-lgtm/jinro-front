import {
  clearAuthSession,
  getApiBaseUrl,
  getErrorMessage,
  persistAuthSession,
  readAuthSession,
  refreshAuthSession,
  updateAuthSession
} from "./authApi";

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

export class AppApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AppApiError";
    this.status = status;
  }
}

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

const getAuthorizationHeaders = (accessToken: string, hasBody: boolean) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`
  };

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const refreshSessionIfNeeded = async () => {
  const session = readAuthSession();

  if (!session?.refreshToken) {
    clearAuthSession();
    throw new AppApiError("로그인이 필요합니다.", 401);
  }

  try {
    const refreshed = await refreshAuthSession(session.refreshToken);
    persistAuthSession(refreshed);
    return refreshed;
  } catch (error) {
    clearAuthSession();
    throw new AppApiError(getErrorMessage(error), 401);
  }
};

const requestWithAuth = async <TData>(
  path: string,
  init: RequestInit = {},
  retryOnUnauthorized = true
): Promise<{ data: TData; meta?: Record<string, unknown> }> => {
  const session = readAuthSession();

  if (!session?.accessToken) {
    throw new AppApiError("로그인이 필요합니다.", 401);
  }

  const hasBody = typeof init.body !== "undefined";
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...getAuthorizationHeaders(session.accessToken, hasBody),
      ...(init.headers ?? {})
    },
    credentials: "include"
  });

  const parsed = await parseResponse<TData>(response);

  if (response.status === 401 && retryOnUnauthorized) {
    const refreshed = await refreshSessionIfNeeded();

    return requestWithAuth<TData>(
      path,
      {
        ...init,
        headers: {
          ...getAuthorizationHeaders(refreshed.accessToken, hasBody),
          ...(init.headers ?? {})
        }
      },
      false
    );
  }

  if (!response.ok) {
    if (parsed && !parsed.success) {
      throw new AppApiError(getErrorMessage(new Error(parsed.error.message)), response.status);
    }

    throw new AppApiError(`요청 처리 중 오류가 발생했습니다. (HTTP ${response.status})`, response.status);
  }

  if (!parsed || !parsed.success) {
    throw new AppApiError("서버 응답을 확인하지 못했습니다.", response.status);
  }

  if (parsed.meta?.streamToken && typeof parsed.meta.streamToken === "string") {
    updateAuthSession({ streamToken: parsed.meta.streamToken });
  }

  return {
    data: parsed.data,
    meta: parsed.meta
  };
};

export const appGet = async <TData>(path: string) => (await requestWithAuth<TData>(path)).data;

export const appGetWithMeta = <TData>(path: string) => requestWithAuth<TData>(path);

export const appPost = async <TData>(path: string, payload?: unknown) =>
  (
    await requestWithAuth<TData>(path, {
      method: "POST",
      body: typeof payload === "undefined" ? undefined : JSON.stringify(payload)
    })
  ).data;

export const appPut = async <TData>(path: string, payload: unknown) =>
  (
    await requestWithAuth<TData>(path, {
      method: "PUT",
      body: JSON.stringify(payload)
    })
  ).data;

export const appPatch = async <TData>(path: string, payload?: unknown) =>
  (
    await requestWithAuth<TData>(path, {
      method: "PATCH",
      body: typeof payload === "undefined" ? undefined : JSON.stringify(payload)
    })
  ).data;

export const appDelete = async <TData>(path: string) =>
  (
    await requestWithAuth<TData>(path, {
      method: "DELETE"
    })
  ).data;

export const buildSseStreamUrl = () => {
  const session = readAuthSession();

  if (!session?.streamToken) {
    return "";
  }

  return `${getApiBaseUrl()}/v1/sse/stream?streamToken=${encodeURIComponent(session.streamToken)}`;
};
