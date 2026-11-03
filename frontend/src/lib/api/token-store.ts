/**
 * Lưu trữ Access Token & Refresh Token trên client (LocalStorage + In-memory cache).
 * Kế thừa kiến trúc từ idhub.
 */

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

export const AUTH_STORAGE_KEY = "teacher.auth.v1";
export const AUTH_CHANGED_EVENT = "teacher:auth-changed";

let cache: StoredTokens | null | undefined;

function canUseStorage() {
  return typeof window !== "undefined";
}

function parseTokens(raw: string | null): StoredTokens | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredTokens>;
    if (typeof value.accessToken === "string" && typeof value.refreshToken === "string") {
      return { accessToken: value.accessToken, refreshToken: value.refreshToken };
    }
  } catch {
    // Không parse được -> xem như chưa đăng nhập
  }
  return null;
}

export function getTokens(): StoredTokens | null {
  if (!canUseStorage()) return null;
  if (cache !== undefined) return cache;

  try {
    cache = parseTokens(window.localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    cache = null;
  }
  return cache;
}

export function setTokens(tokens: StoredTokens | null) {
  cache = tokens;
  if (!canUseStorage()) return;

  try {
    if (tokens) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Quota hoặc private mode
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_CHANGED_EVENT, { detail: { authenticated: Boolean(tokens) } }),
  );
}

export function subscribeToTokenChanges(listener: (source: "self" | "other-tab") => void) {
  if (!canUseStorage()) return () => {};

  const onLocal = () => listener("self");
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === AUTH_STORAGE_KEY) {
      cache = undefined;
      listener("other-tab");
    }
  };

  window.addEventListener(AUTH_CHANGED_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}
