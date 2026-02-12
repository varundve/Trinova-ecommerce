import { Review } from "./types"
import { REVIEWS_KEY } from "./storageKeys"

// Reviews
export function getReviews(itemId: string, itemType: "product" | "project"): Review[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(REVIEWS_KEY)
  const allReviews: Review[] = stored ? JSON.parse(stored) : []
  return allReviews.filter((r) => r.itemId === itemId && r.itemType === itemType)
}


export function getAverageRating(itemId: string, itemType: "product" | "project"): { average: number; count: number } {
  const reviews = getReviews(itemId, itemType)
  if (reviews.length === 0) return { average: 0, count: 0 }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length }
}

export function getAllReviews(): Review[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(REVIEWS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveReviews(reviews: Review[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

export function addReview(
  review: Omit<Review, "id" | "createdAt" | "helpful" | "verified">,
): Review {
  const allReviews = getAllReviews()
  const newReview: Review = {
    ...review,
    id: "REV-" + Date.now(),
    helpful: 0,
    verified: true,
    createdAt: new Date().toISOString(),
  }
  allReviews.unshift(newReview)
  saveReviews(allReviews)
  return newReview
}

export function markReviewHelpful(reviewId: string): void {
  const allReviews = getAllReviews()
  const index = allReviews.findIndex((r) => r.id === reviewId)
  if (index !== -1) {
    allReviews[index].helpful += 1
    saveReviews(allReviews)
  }
}

export function deleteReview(reviewId: string): void {
  const allReviews = getAllReviews().filter((r) => r.id !== reviewId)
  saveReviews(allReviews)
}

export function getUserReviews(userId: string): Review[] {
  return getAllReviews().filter((r) => r.userId === userId)
}