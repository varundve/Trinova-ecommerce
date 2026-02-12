import { WishlistItem } from "./types"
import { WISHLIST_KEY } from "./storageKeys"
// Wishlist
export function getWishlist(userId: string): WishlistItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(`${WISHLIST_KEY}_${userId}`)
  return stored ? JSON.parse(stored) : []
}

export function saveWishlist(userId: string, wishlist: WishlistItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`${WISHLIST_KEY}_${userId}`, JSON.stringify(wishlist))
}

export function addToWishlist(userId: string, item: Omit<WishlistItem, "addedAt">): void {
  const wishlist = getWishlist(userId)
  if (!wishlist.some((w) => w.id === item.id)) {
    wishlist.push({ ...item, addedAt: new Date().toISOString() })
    saveWishlist(userId, wishlist)
  }
}

export function removeFromWishlist(userId: string, itemId: string): void {
  const wishlist = getWishlist(userId).filter((w) => w.id !== itemId)
  saveWishlist(userId, wishlist)
}

export function isInWishlist(userId: string, itemId: string): boolean {
  return getWishlist(userId).some((w) => w.id === itemId)
}