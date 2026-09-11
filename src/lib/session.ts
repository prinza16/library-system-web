export function getUserFromCookie() {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/user=([^;]+)/);
  if (!match) return null;

  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function getToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export function logout() {
  document.cookie = 'token=; path=/; max-age=0';
  document.cookie = 'user=; path=/; max-age=0';
}