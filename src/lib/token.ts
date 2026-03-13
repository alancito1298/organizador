export function setToken(token: string): void {
  try {
    localStorage.setItem("token", token);
  } catch {
    sessionStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem("token") ?? sessionStorage.getItem("token");
  } catch {
    return sessionStorage.getItem("token");
  }
}

export function removeToken(): void {
  try {
    localStorage.removeItem("token");
  } catch {}
  sessionStorage.removeItem("token");
}
