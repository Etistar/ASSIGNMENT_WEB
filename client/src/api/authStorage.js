// The JWT lives in localStorage under this key, with the public profile.
// The password is never stored. Sign-out deletes this key. See README.md.
export const AUTH_STORAGE_KEY = 'portfolio_auth';

export function readAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) return null;
    return parsed;
  } catch (err) {
    return null;
  }
}

export function writeAuth(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    token: session.token,
    user: session.user
  }));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
