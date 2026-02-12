import { Order } from "./types"
import { Address } from "./types"
import { PaymentMethod } from "./types"
import { clearCart } from "./cart"
import { CartItem } from "./types"
import { ORDERS_KEY } from "./storageKeys"

export function getUserOrders(userId: string): Order[] {
  if (typeof window === "undefined") return []
  const allOrders = getOrders()
  return allOrders
}



// Orders
export function getOrders(): Order[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ORDERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function createOrder(items: CartItem[], total: number): Order {
  const order: Order = {
    id: "ORD-" + Date.now(),
    date: new Date().toISOString(),
    items,
    total,
    status: "pending",
    trackingNumber: "TRK" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
  const orders = getOrders()
  orders.unshift(order)
  saveOrders(orders)
  clearCart()
  return order
}

export function createOrderWithAddress(
  items: CartItem[],
  total: number,
  address: Address,
  paymentMethod?: PaymentMethod,
): Order {
  const order: Order = {
    id: "ORD-" + Date.now(),
    date: new Date().toISOString(),
    items,
    total,
    status: "pending",
    shippingAddress: address,
    trackingNumber: "TRK" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod,
  }
  const orders = getOrders()
  orders.unshift(order)
  saveOrders(orders)
  clearCart()
  return order
}