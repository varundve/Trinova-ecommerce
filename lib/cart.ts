import { Product, CartItem, Order, Address, PaymentMethod } from "./types";
import { CART_KEY, ORDERS_KEY } from "./storageKeys";
import { Project } from "./types";


export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CART_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addToCart(product: Product): void {
  const cart = getCart()
  const existing = cart.find((item) => item.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  saveCart(cart)
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter((item) => item.id !== id)
  saveCart(cart)
}

export function updateCartQuantity(id: string, quantity: number): void {
  const cart = getCart()
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      saveCart(cart)
    }
  }
}

export function clearCart(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_KEY, JSON.stringify([]))
}

export function addProjectToCart(project: Project): void {
  const cart = getCart()
  const existing = cart.find((item) => item.id === project.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.push({
      id: project.id,
      name: project.name,
      category: project.category,
      price: project.price,
      salePrice: project.salePrice,
      stock: project.stock,
      description: project.description,
      image: project.image,
      featured: project.featured,
      onSale: project.onSale,
      createdAt: new Date().toISOString(),
      quantity: 1,
    })
  }
  saveCart(cart)
}
