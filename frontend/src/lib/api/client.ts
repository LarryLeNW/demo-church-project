import { getTokens, setTokens, type StoredTokens } from "./token-store";

/** Base URL của NestJS backend, không có dấu slash ở cuối (e.g. http://localhost:4000/api). */
export const API_URL = (
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "/api")
    : (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api")
).replace(/\/+$/, "");

const LOCAL_UPLOAD_URL = /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/uploads\//gi;

export function normalizeUploadedMedia<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(LOCAL_UPLOAD_URL, "/uploads/") as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeUploadedMedia(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeUploadedMedia(item)]),
    ) as T;
  }
  return value;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Tự động gán access token và tự động gọi refresh token khi gặp 401. Default: true. */
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

/**
 * Fetch client thống nhất cho toàn bộ Frontend Next.js:
 * - Kế thừa kiến trúc từ idhub.
 * - Tự động đính kèm Bearer token.
 * - Tự động gọi POST /auth/refresh khi gặp lỗi 401 Unauthorized (single-flight) và retry request.
 * - Chuẩn hóa các exception thành instance ApiError có status và message tiếng Việt rõ ràng.
 */
export function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return request<T>(path, options, true);
}

async function request<T>(
  path: string,
  options: ApiRequestOptions,
  allowRetry: boolean,
): Promise<T> {
  const { method = "GET", body, auth = true, headers = {}, signal } = options;
  const tokens = auth ? getTokens() : null;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  // Tự động bỏ qua tiền tố /api/ nếu caller truyền thừa
  const cleanPath = path.startsWith("/api/") ? path.slice(4) : path.startsWith("/") ? path : `/${path}`;
  const requestUrl = `${API_URL}${cleanPath}`;

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
        ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
        ...headers,
      },
      body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    const isEn = typeof window !== "undefined" && localStorage.getItem("app_language") === "en";
    throw new ApiError(
      0,
      isEn
        ? "Unable to connect to server. Please check your network connection."
        : "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại."
    );
  }

  // Tự động làm mới token nếu gặp 401 và có refreshToken
  if (response.status === 401 && auth && tokens?.refreshToken && allowRetry) {
    if (await refreshSession()) {
      return request<T>(path, options, false);
    }
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return normalizeUploadedMedia((text ? JSON.parse(text) : undefined) as T);
}

let refreshInFlight: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function doRefresh(): Promise<boolean> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return false;

  try {
    const next = await request<StoredTokens>(
      "/auth/refresh",
      { method: "POST", body: { refreshToken: tokens.refreshToken }, auth: false },
      false,
    );
    setTokens({ accessToken: next.accessToken, refreshToken: next.refreshToken });
    return true;
  } catch (error) {
    if (!(error instanceof ApiError && error.isNetworkError)) {
      setTokens(null);
    }
    return false;
  }
}

async function toApiError(response: Response) {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }
  return new ApiError(
    response.status,
    extractMessage(payload) ?? defaultMessage(response.status),
    payload,
  );
}

function extractMessage(payload: unknown) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (Array.isArray(message)) return message.map(String).join("\n");
    if (typeof message === "string" && message) return message;
  }
  return null;
}

function defaultMessage(status: number) {
  const isEn = typeof window !== "undefined" && localStorage.getItem("app_language") === "en";
  switch (status) {
    case 400:
      return isEn ? "Invalid request data submitted." : "Dữ liệu gửi lên không hợp lệ.";
    case 401:
      return isEn ? "Session expired or invalid. Please sign in again." : "Phiên đăng nhập đã hết hạn hoặc không hợp lệ.";
    case 403:
      return isEn ? "You do not have permission to perform this action." : "Bạn không có quyền thực hiện thao tác này.";
    case 404:
      return isEn ? "Requested data not found." : "Không tìm thấy dữ liệu yêu cầu.";
    case 409:
      return isEn ? "Data already exists in system." : "Dữ liệu đã tồn tại trong hệ thống.";
    default:
      return status >= 500
        ? (isEn ? "Server encountered a technical error. Please try again later." : "Máy chủ gặp sự cố kỹ thuật. Vui lòng thử lại sau.")
        : (isEn ? `System error (${status})` : `Lỗi hệ thống (${status})`);
  }
}
