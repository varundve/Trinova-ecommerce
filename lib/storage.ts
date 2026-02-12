// lib/storage.ts
export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : fallback
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}
