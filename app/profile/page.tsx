"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  User,
  MapPin,
  Package,
  Heart,
  Truck,
  Plus,
  Pencil,
  Trash2,
  Check,
  ShoppingCart,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { getSession} from "@/lib/auth"
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/Address"
import { getWishlist, removeFromWishlist } from "@/lib/wishlist"
import { Order,Address,Session,WishlistItem} from "@/lib/types"
import { getOrders} from "@/lib/orders"
import { getProducts } from "@/lib/products"
import { getProjects } from "@/lib/projects"
import { addToCart } from "@/lib/cart"
import { addProjectToCart } from "@/lib/cart"
import { formatINR } from "@/lib/utils"
import { updateUserProfile } from "@/lib/users"


type TabType = "profile" | "addresses" | "orders" | "tracking" | "wishlist"

function TabParamReader({ onTabChange }: { onTabChange: (tab: TabType) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && ["profile", "addresses", "orders", "tracking", "wishlist"].includes(tabParam)) {
      onTabChange(tabParam as TabType)
    }
  }, [searchParams, onTabChange])

  return null
}

function ProfileContent() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
  })

  // Address form state
  const [addressForm, setAddressForm] = useState<Omit<Address, "id">>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  })

  useEffect(() => {
    const currentSession = getSession()
    if (!currentSession) {
      router.push("/login")
      return
    }
    setSession(currentSession)
    setProfileData({
      firstName: currentSession.firstName,
      lastName: currentSession.lastName,
      phone: currentSession.phone || "",
      company: currentSession.company || "",
    })
    loadUserData(currentSession.id)
    setIsLoading(false)
  }, [router])

  const loadUserData = (userId: string) => {
    setAddresses(getAddresses(userId))
    setWishlist(getWishlist(userId))
    setOrders(getOrders())
  }

  const handleSaveProfile = () => {
    if (!session) return
    updateUserProfile(session.id, profileData)
    setSession({ ...session, ...profileData })
    setIsEditingProfile(false)
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    if (editingAddress) {
      updateAddress(session.id, { ...addressForm, id: editingAddress.id })
    } else {
      addAddress(session.id, addressForm)
    }
    setAddresses(getAddresses(session.id))
    setIsAddressModalOpen(false)
    setEditingAddress(null)
    resetAddressForm()
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm(address)
    setIsAddressModalOpen(true)
  }

  const handleDeleteAddress = (addressId: string) => {
    if (!session) return
    deleteAddress(session.id, addressId)
    setAddresses(getAddresses(session.id))
  }

  const handleSetDefault = (addressId: string) => {
    if (!session) return
    setDefaultAddress(session.id, addressId)
    setAddresses(getAddresses(session.id))
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    if (!session) return
    removeFromWishlist(session.id, itemId)
    setWishlist(getWishlist(session.id))
  }

  const handleAddToCartFromWishlist = (item: WishlistItem) => {
    if (item.type === "product") {
      const products = getProducts()
      const product = products.find((p) => p.id === item.id)
      if (product) {
        addToCart(product)
        window.dispatchEvent(new Event("storage"))
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } else {
      const projects = getProjects()
      const project = projects?.find((p) => p.id === item.id)
      if (project) {
        addProjectToCart(project)
        window.dispatchEvent(new Event("storage"))
        window.dispatchEvent(new Event("cartUpdated"))
      }
    }
  }

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    })
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-500"
      case "processing":
        return "text-blue-500"
      case "shipped":
        return "text-purple-500"
      case "delivered":
        return "text-green-500"
      case "cancelled":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "processing":
        return <Circle className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  const getPaymentIcon = (type?: string) => {
    switch (type) {
      case "upi":
        return <Smartphone className="w-4 h-4" />
      case "debit-card":
      case "credit-card":
        return <CreditCard className="w-4 h-4" />
      case "net-banking":
        return <Building2 className="w-4 h-4" />
      case "cod":
        return <Banknote className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    router.push(`/profile?tab=${tab}`, { scroll: false })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) return null

  const tabs = [
    { id: "profile" as TabType, label: "My Profile", icon: User },
    { id: "addresses" as TabType, label: "Addresses", icon: MapPin },
    { id: "orders" as TabType, label: "Order History", icon: Package },
    { id: "tracking" as TabType, label: "Track Order", icon: Truck },
    { id: "wishlist" as TabType, label: "Wishlist", icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <Suspense fallback={null}>
        <TabParamReader onTabChange={setActiveTab} />
      </Suspense>

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-1">Manage your profile, addresses, orders, and wishlist</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-32">
                {/* User info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {session.firstName[0]}
                    {session.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {session.firstName} {session.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{session.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                      {tab.id === "wishlist" && wishlist.length > 0 && (
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                            activeTab === tab.id ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                          }`}
                        >
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    {!isEditingProfile && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <div className="space-y-4 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+91 XXXX XXX XXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">
                          {session.firstName} {session.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{session.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{session.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{session.company || "Not provided"}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Saved Addresses</h2>
                    <Button
                      onClick={() => {
                        resetAddressForm()
                        setEditingAddress(null)
                        setIsAddressModalOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-12 text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                      <p className="text-muted-foreground mb-4">Add your first delivery address</p>
                      <Button onClick={() => setIsAddressModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`bg-card rounded-2xl border p-6 relative ${
                            address.isDefault ? "border-primary" : "border-border"
                          }`}
                        >
                          {address.isDefault && (
                            <span className="absolute top-4 right-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                              Default
                            </span>
                          )}
                          <p className="font-semibold mb-1">{address.fullName}</p>
                          <p className="text-sm text-muted-foreground mb-2">{address.phone}</p>
                          <p className="text-sm text-foreground">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-foreground">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-foreground">{address.country}</p>

                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                            <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address)}>
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetDefault(address.id)}
                                className="ml-auto"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Set Default
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>

                  {orders.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-12 text-center">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                      <Button asChild>
                        <Link href="/#products">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedOrder(order)
                            handleTabChange("tracking")
                          }}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                              <p className="font-semibold text-foreground">{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="font-medium capitalize">{order.status}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-12 rounded-lg border-2 border-card overflow-hidden bg-muted"
                                >
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-12 h-12 rounded-lg border-2 border-card bg-muted flex items-center justify-center text-sm font-medium">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} item{order.items.length > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {getPaymentIcon(order.paymentMethod?.type)}
                              <span className="capitalize">
                                {order.paymentMethod?.type?.replace("-", " ") || "Card"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-primary">{formatINR(order.total)}</span>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tracking Tab */}
              {activeTab === "tracking" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Track Order</h2>

                  {!selectedOrder ? (
                    <div className="bg-card rounded-2xl border border-border p-12 text-center">
                      <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select an order to track</h3>
                      <p className="text-muted-foreground mb-4">
                        Go to Order History and click on an order to track it
                      </p>
                      <Button onClick={() => handleTabChange("orders")}>View Orders</Button>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                      {/* Order header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-8 pb-6 border-b border-border">
                        <div>
                          <p className="font-semibold text-lg">{selectedOrder.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Placed on{" "}
                            {new Date(selectedOrder.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="font-medium capitalize">{selectedOrder.status}</span>
                        </div>
                      </div>

                      {/* Tracking timeline */}
                      <div className="mb-8">
                        <h3 className="font-medium mb-6">Tracking Timeline</h3>
                        <div className="relative">
                          {["pending", "processing", "shipped", "delivered"].map((step, index) => {
                            const statusOrder = ["pending", "processing", "shipped", "delivered"]
                            const currentIndex = statusOrder.indexOf(selectedOrder.status)
                            const isCompleted = index <= currentIndex
                            const isCurrent = index === currentIndex

                            return (
                              <div key={step} className="flex items-start gap-4 pb-8 last:pb-0">
                                <div className="relative">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                      isCompleted
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                                  >
                                    {isCompleted ? <Check className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                  </div>
                                  {index < 3 && (
                                    <div
                                      className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                                        index < currentIndex ? "bg-primary" : "bg-muted"
                                      }`}
                                    />
                                  )}
                                </div>
                                <div className="flex-1 pt-2">
                                  <p className={`font-medium capitalize ${isCompleted ? "" : "text-muted-foreground"}`}>
                                    {step === "pending"
                                      ? "Order Placed"
                                      : step === "processing"
                                        ? "Processing"
                                        : step === "shipped"
                                          ? "Shipped"
                                          : "Delivered"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {step === "pending" && "Your order has been received"}
                                    {step === "processing" && "Your order is being prepared"}
                                    {step === "shipped" && `Tracking: ${selectedOrder.trackingNumber || "N/A"}`}
                                    {step === "delivered" &&
                                      `Expected: ${
                                        selectedOrder.estimatedDelivery
                                          ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString("en-IN")
                                          : "N/A"
                                      }`}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Shipping address */}
                      {selectedOrder.shippingAddress && (
                        <div className="mb-8 p-4 bg-muted/50 rounded-xl">
                          <h3 className="font-medium mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h3>
                          <p className="text-sm">{selectedOrder.shippingAddress.fullName}</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.shippingAddress.addressLine1}
                            {selectedOrder.shippingAddress.addressLine2 &&
                              `, ${selectedOrder.shippingAddress.addressLine2}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{" "}
                            {selectedOrder.shippingAddress.pincode}
                          </p>
                        </div>
                      )}

                      {/* Order items */}
                      <div>
                        <h3 className="font-medium mb-4">Order Items</h3>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-background">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium line-clamp-1">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-primary">
                                {formatINR((item.salePrice || item.price) * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                          <span className="font-medium">Total</span>
                          <span className="text-xl font-bold text-primary">{formatINR(selectedOrder.total)}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="mt-6 bg-transparent" onClick={() => setSelectedOrder(null)}>
                        Track Another Order
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>

                  {wishlist.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-12 text-center">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                      <p className="text-muted-foreground mb-4">Save items you love to your wishlist</p>
                      <Button asChild>
                        <Link href="/#products">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden group">
                          <div className="relative aspect-square">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="absolute top-3 left-3 px-2 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                              {item.type}
                            </span>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-1 capitalize">{item.category}</p>
                            <h3 className="font-medium line-clamp-2 mb-2">{item.name}</h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-primary">
                                  {formatINR(item.salePrice || item.price)}
                                </span>
                                {item.salePrice && (
                                  <span className="ml-2 text-sm text-muted-foreground line-through">
                                    {formatINR(item.price)}
                                  </span>
                                )}
                              </div>
                              <Button size="sm" onClick={() => handleAddToCartFromWishlist(item)}>
                                <ShoppingCart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Address Modal */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update your delivery address" : "Add a new delivery address to your account"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="+91 XXXX XXX XXX"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="House/Flat No., Building Name"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="Street, Area, Landmark"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={addressForm.country} disabled />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm">Set as default address</span>
            </label>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddressModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ProfilePage() {
  return <ProfileContent />
}
