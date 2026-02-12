import { Session } from "./types"
import { SESSION_KEY, ADMIN_AUTH_KEY } from "./storageKeys"
import { getUsers } from "./users"
import { User } from "./types"


export function authenticateUser(email: string, password: string): User | null {
  const users = getUsers()
  return users.find((u) => u.email === email && u.password === password) || null
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setSession(session: Session, remember: boolean): void {
  if (typeof window === "undefined") return
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

// Admin Auth
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true"
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return
  if (value) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true")
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY)
  }
}