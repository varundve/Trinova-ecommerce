"use client"
import { User } from "./types"
import { USER_PROFILE_KEY as USERS_KEY } from "./storageKeys";
import { SESSION_KEY, USER_PROFILE_KEY } from "./storageKeys"
import { UserProfile } from "./types"
import { getSession } from "./auth"


export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function createUser(userData: Omit<User, "id" | "createdAt">): User | null {
  const users = getUsers()
  if (users.some((u) => u.email === userData.email)) {
    return null
  }
  const user: User = {
    ...userData,
    id: "USER-" + Date.now(),
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  saveUsers(users)
  return user
}



export function updateUserProfile(
  userId: string,
  data: { firstName?: string; lastName?: string; phone?: string; company?: string },
): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === userId)
  if (index !== -1) {
    users[index] = { ...users[index], ...data }
    saveUsers(users)
    const session = getSession()
    if (session && session.id === userId) {
      const updatedSession = { ...session, ...data }
      const storage = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage
      storage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
    }
  }
}

export function getUserProfile(userId: string): UserProfile {
  if (typeof window === "undefined") return { userId, addresses: [], wishlist: [] }
  const stored = localStorage.getItem(`${USER_PROFILE_KEY}_${userId}`)
  return stored ? JSON.parse(stored) : { userId, addresses: [], wishlist: [] }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`${USER_PROFILE_KEY}_${profile.userId}`, JSON.stringify(profile))
}

