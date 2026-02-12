export interface Product {
  id: string
  name: string
  category: string
  price: number
  salePrice?: number
  stock: number
  description: string
  image: string
  keyFeatures?: string[]
  specifications?: Record<string, string>
  packageContents?: string[]
  featured: boolean
  onSale: boolean
  createdAt: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  date: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress?: Address
  trackingNumber?: string
  estimatedDelivery?: string
  paymentMethod?: PaymentMethod
}

export interface PaymentMethod {
  type: "upi" | "debit-card" | "credit-card" | "net-banking" | "cod"
  details?: {
    upiId?: string
    cardLast4?: string
    cardType?: string
    bankName?: string
  }
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  password: string
  createdAt: string
}

export interface Session {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  phone?: string // Added phone to Session interface
  loggedIn: boolean
}

export interface Project {
  id: string
  name: string
  category: string
  price: number
  salePrice?: number
  description: string
  image: string
  features: string[]
  components: string
  deliveryTime: string
  featured: boolean
  onSale: boolean
  rating: number
  reviews: number
  stock: number
}

export interface Address {
  id: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface WishlistItem {
  id: string
  name: string
  price: number
  salePrice?: number
  image: string
  category: string
  type: "product" | "project"
  addedAt: string
}

export interface Reviews{
  userId: string
  data: Review[]
}

export interface Review {
  id: string
  itemId: string
  itemType: "product" | "project"
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  images?: string[]
  helpful: number
  verified: boolean
  createdAt: string
}

export interface UserProfile {
  userId: string
  addresses: Address[]
  wishlist: WishlistItem[]
}