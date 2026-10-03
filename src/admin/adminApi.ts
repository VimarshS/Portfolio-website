const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'admin_token';

// The token is kept in sessionStorage: it is cleared when the browser tab is closed
export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage blocked: the user will simply have to log in again
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.token) {
      return { ok: false, message: data?.message || 'Login failed.' };
    }

    setToken(data.token);
    return { ok: true };
  } catch {
    return { ok: false, message: 'Cannot reach the server. Is the backend running?' };
  }
}

// Asks the server if the saved token is still valid
export async function verifyToken(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/api/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}