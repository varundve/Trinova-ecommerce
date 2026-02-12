"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  Plus,
  ClipboardList,
  LogOut,
  ArrowLeft,
  Lock,
  Trash2,
  Edit,
  X,
  ShoppingCart,
  TrendingUp,
  Search,
  Layers,
  PlusCircle,
  Star,
  Clock,
  IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/auth"
import { getProducts, addProduct, deleteProduct  } from "@/lib/products"
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/projects"
import { getOrders, saveOrders } from "@/lib/orders"
import { formatINR } from "@/lib/utils"
import type { Product, Project, Order } from "@/lib/types"
import { useRouter } from "next/navigation"
import  updateProduct  from "@/lib/products"

const ADMIN_PIN = "2623"

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "add-product", label: "Add Product", icon: Plus },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "add-project", label: "Add Project", icon: PlusCircle },
  { id: "orders", label: "Orders", icon: ClipboardList },
]

const productCategories = [
  { value: "electronics", label: "Electronics" },
  { value: "safety", label: "Safety" },
  { value: "tools", label: "Tools" },
  { value: "machinery", label: "Machinery" },
]

const projectCategories = [
  { value: "smart-home", label: "Smart Home" },
  { value: "industrial", label: "Industrial" },
  { value: "agriculture", label: "Agriculture" },
  { value: "healthcare", label: "Healthcare" },
  { value: "security", label: "Security" },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState(["", "", "", ""])
  const [pinError, setPinError] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState<Product[]>([])
  const [projects, setProjects] = useState<Project[]|null>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<"product" | "project">("product")
  const pinInputs = useRef<(HTMLInputElement | null)[]>([])

  // Product Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    featured: false,
    onSale: false,
    salePrice: "",
  })

  const [projectFormData, setProjectFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    features: "",
    components: "",
    deliveryTime: "",
    featured: false,
    onSale: false,
    salePrice: "",
    rating: "4.5",
    reviews: "0",
  })

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const loadData = () => {
    setProducts(getProducts())
    setProjects(getProjects())
    setOrders(getOrders())
  }
  

  const handlePinInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
    setPinError(false)

    if (value && index < 3) {
      pinInputs.current[index + 1]?.focus()
    }

    if (value && index === 3) {
      const enteredPin = [...newPin.slice(0, 3), value].join("")
      if (enteredPin === ADMIN_PIN) {
        setAdminAuthenticated(true)
        setIsAuthenticated(true)
        loadData()
      } else {
        setPinError(true)
        setTimeout(() => {
          setPin(["", "", "", ""])
          pinInputs.current[0]?.focus()
        }, 500)
      }
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinInputs.current[index - 1]?.focus()
    }
  }

  const handleLogout = () => {
    setAdminAuthenticated(false)
    setIsAuthenticated(false)
    setPin(["", "", "", ""])
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      featured: false,
      onSale: false,
      salePrice: "",
    })
    setEditingProduct(null)
  }

  const resetProjectForm = () => {
    setProjectFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      features: "",
      components: "",
      deliveryTime: "",
      featured: false,
      onSale: false,
      salePrice: "",
      rating: "4.5",
      reviews: "0",
    })
    setEditingProject(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: product.image,
      featured: product.featured,
      onSale: product.onSale,
      salePrice: product.salePrice?.toString() || "",
    })
    setActiveTab("add-product")
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectFormData({
      name: project.name,
      category: project.category,
      price: project.price.toString(),
      stock: project.stock.toString(),
      description: project.description,
      image: project.image,
      features: project.features.join(", "),
      components: project.components,
      deliveryTime: project.deliveryTime,
      featured: project.featured,
      onSale: project.onSale,
      salePrice: project.salePrice?.toString() || "",
      rating: project.rating.toString(),
      reviews: project.reviews.toString(),
    })
    setActiveTab("add-project")
  }

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id)
    setDeleteType("product")
    setDeleteModalOpen(true)
  }

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id)
    setDeleteType("project")
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (deleteType === "product" && productToDelete) {
      deleteProduct(productToDelete)
      setProducts(getProducts())
      setProductToDelete(null)
    } else if (deleteType === "project" && projectToDelete) {
      deleteProject(projectToDelete)
      setProjects(getProjects())
      setProjectToDelete(null)
    }
    setDeleteModalOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData: Product = {
      id: editingProduct?.id || `prod_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      description: formData.description,
      image: formData.image || "/placeholder.svg",
      featured: formData.featured,
      onSale: formData.onSale,
      salePrice: formData.onSale ? Number.parseFloat(formData.salePrice) : undefined,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    }

    if (editingProduct) {
      updateProduct(productData)
    } else {
      addProduct(productData)
    }

    setProducts(getProducts())
    resetForm()
    setActiveTab("products")
  }

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const projectData: Project = {
      id: editingProject?.id || `proj_${Date.now()}`,
      name: projectFormData.name,
      category: projectFormData.category,
      price: Number.parseFloat(projectFormData.price),
      stock: Number.parseInt(projectFormData.stock),
      description: projectFormData.description,
      image: projectFormData.image || "/placeholder.svg",
      features: projectFormData.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      components: projectFormData.components,
      deliveryTime: projectFormData.deliveryTime,
      featured: projectFormData.featured,
      onSale: projectFormData.onSale,
      salePrice: projectFormData.onSale ? Number.parseFloat(projectFormData.salePrice) : undefined,
      rating: Number.parseFloat(projectFormData.rating),
      reviews: Number.parseInt(projectFormData.reviews),
    }

    if (editingProject) {
      updateProject(projectData)
    } else {
      addProject(projectData)
    }

    setProjects(getProjects())
    resetProjectForm()
    setActiveTab("projects")
  }

  const updateOrderStatus = (orderId: string) => {
    const orderList = [...orders]
    const order = orderList.find((o) => o.id === orderId)
    if (order) {
      const statuses: Array<"pending" | "processing" | "shipped" | "delivered" | "cancelled"> = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]
      const currentIndex = statuses.indexOf(order.status)
      order.status = statuses[(currentIndex + 1) % statuses.length]
      saveOrders(orderList)
      setOrders([...orderList])
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  // PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl p-8 shadow-2xl max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Admin Access</h2>
            <p className="text-muted-foreground">Enter your 4-digit PIN to continue</p>
          </div>

          {/* PIN Input */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => {
                  pinInputs.current[index] = el
                }}
                type="password"
                maxLength={1}
                value={pin[index]}
                onChange={(e) => handlePinInput(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  pinError ? "border-destructive animate-shake" : pin[index] ? "border-primary" : "border-border"
                }`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-destructive text-center text-sm mb-4 animate-fade-in">
              Incorrect PIN. Please try again.
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => {
                  const emptyIndex = pin.findIndex((p) => !p)
                  if (emptyIndex !== -1) {
                    handlePinInput(emptyIndex, num.toString())
                  }
                }}
                className="h-14 rounded-xl bg-muted hover:bg-muted/80 font-semibold text-xl transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                const lastFilledIndex = pin
                  .map((p, i) => (p ? i : -1))
                  .filter((i) => i !== -1)
                  .pop()
                if (lastFilledIndex !== undefined && lastFilledIndex >= 0) {
                  const newPin = [...pin]
                  newPin[lastFilledIndex] = ""
                  setPin(newPin)
                  pinInputs.current[lastFilledIndex]?.focus()
                }
              }}
              className="h-14 rounded-xl bg-muted hover:bg-muted/80 font-semibold transition-colors"
            >
              <X className="w-6 h-6 mx-auto" />
            </button>
            <button
              onClick={() => {
                const emptyIndex = pin.findIndex((p) => !p)
                if (emptyIndex !== -1) {
                  handlePinInput(emptyIndex, "0")
                }
              }}
              className="h-14 rounded-xl bg-muted hover:bg-muted/80 font-semibold text-xl transition-colors"
            >
              0
            </button>
            <button className="h-14 rounded-xl bg-primary text-primary-foreground font-semibold transition-colors">
              Enter
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-40">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                  <Image src="/images/logo.jpg" alt="Trinova Innovation" fill className="object-cover" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold">Trinova Innovation</h1>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="outline" size="sm" asChild className="bg-transparent">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Store
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-64px)] hidden md:block">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== "add-product") resetForm()
                  if (tab.id !== "add-project") resetProjectForm()
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "hover:bg-muted"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 z-40">
          <div className="flex justify-around overflow-x-auto">
            {tabs.slice(0, 4).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== "add-product") resetForm()
                  if (tab.id !== "add-project") resetProjectForm()
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, Admin!</p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Products", value: products.length, icon: Package, color: "bg-blue-500" },
                  { label: "Total Projects", value: projects?.length, icon: Layers, color: "bg-purple-500" },
                  { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "bg-emerald-500" },
                  { label: "Revenue", value: formatINR(totalRevenue), icon: IndianRupee, color: "bg-amber-500" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-background rounded-2xl p-6 border border-border animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Products & Projects */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-background rounded-2xl border border-border p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Recent Products
                  </h3>
                  {products.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No products added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {products
                        .slice(-5)
                        .reverse()
                        .map((product) => (
                          <div key={product.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                            </div>
                            <p className="font-semibold text-primary">{formatINR(product.price)}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="bg-background rounded-2xl border border-border p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Recent Projects
                  </h3>
                  {projects?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No projects added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {projects
                        ?.slice(-5)
                        .reverse()
                        .map((project) => (
                          <div key={project.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background">
                              <Image
                                src={project.image || "/placeholder.svg"}
                                alt={project.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{project.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">{project.category}</p>
                            </div>
                            <p className="font-semibold text-primary">{formatINR(project.price)}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Products</h2>
                  <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Button onClick={() => setActiveTab("add-product")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10" />
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 bg-background rounded-2xl border border-border">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                  <p className="text-muted-foreground mb-4">Add your first product to get started</p>
                  <Button onClick={() => setActiveTab("add-product")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="bg-background rounded-2xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left p-4 font-medium">Product</th>
                          <th className="text-left p-4 font-medium hidden sm:table-cell">Category</th>
                          <th className="text-left p-4 font-medium">Price</th>
                          <th className="text-left p-4 font-medium hidden md:table-cell">Stock</th>
                          <th className="text-right p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr
                            key={product.id}
                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors animate-fade-in"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium line-clamp-1">{product.name}</p>
                                  <div className="flex gap-1 mt-1">
                                    {product.featured && (
                                      <Badge variant="secondary" className="text-xs">
                                        Featured
                                      </Badge>
                                    )}
                                    {product.onSale && (
                                      <Badge variant="destructive" className="text-xs">
                                        Sale
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 capitalize hidden sm:table-cell">{product.category}</td>
                            <td className="p-4">
                              <div>
                                <p className="font-semibold text-primary">{formatINR(product.price)}</p>
                                {product.onSale && product.salePrice && (
                                  <p className="text-sm text-muted-foreground">{formatINR(product.salePrice)}</p>
                                )}
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <span
                                className={
                                  product.stock < 10 ? "text-destructive font-medium" : "text-muted-foreground"
                                }
                              >
                                {product.stock} units
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-8 h-8 bg-transparent"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-8 h-8 text-destructive hover:text-destructive bg-transparent"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Product Tab */}
          {activeTab === "add-product" && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <p className="text-muted-foreground">
                  {editingProduct ? "Update product details" : "Fill in the details to add a new product"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-background rounded-2xl border border-border p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Product Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Smart Safety Helmet"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (INR)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="24999"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Stock</label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Image URL</label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/product-image.jpg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product description..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(c) => setFormData({ ...formData, featured: c as boolean })}
                    />
                    <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Featured Product
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="onSale"
                      checked={formData.onSale}
                      onCheckedChange={(c) => setFormData({ ...formData, onSale: c as boolean })}
                    />
                    <label htmlFor="onSale" className="text-sm font-medium cursor-pointer">
                      On Sale
                    </label>
                  </div>

                  {formData.onSale && (
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">Sale Price (INR)</label>
                      <Input
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                        placeholder="19999"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setActiveTab("products")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Projects</h2>
                  <p className="text-muted-foreground">Manage your IoT projects</p>
                </div>
                <Button onClick={() => setActiveTab("add-project")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-10" />
              </div>

              {projects?.length === 0 ? (
                <div className="text-center py-20 bg-background rounded-2xl border border-border">
                  <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
                  <p className="text-muted-foreground mb-4">Add your first project to get started</p>
                  <Button onClick={() => setActiveTab("add-project")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              ) : (
                <div className="bg-background rounded-2xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left p-4 font-medium">Project</th>
                          <th className="text-left p-4 font-medium hidden sm:table-cell">Category</th>
                          <th className="text-left p-4 font-medium">Price</th>
                          <th className="text-left p-4 font-medium hidden md:table-cell">Rating</th>
                          <th className="text-left p-4 font-medium hidden lg:table-cell">Delivery</th>
                          <th className="text-right p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects?.map((project, index) => (
                          <tr
                            key={project.id}
                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors animate-fade-in"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                  <Image
                                    src={project.image || "/placeholder.svg"}
                                    alt={project.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium line-clamp-1">{project.name}</p>
                                  <div className="flex gap-1 mt-1">
                                    {project.featured && (
                                      <Badge variant="secondary" className="text-xs">
                                        Featured
                                      </Badge>
                                    )}
                                    {project.onSale && (
                                      <Badge variant="destructive" className="text-xs">
                                        Sale
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 capitalize hidden sm:table-cell">
                              {project.category.replace("-", " ")}
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-semibold text-primary">{formatINR(project.price)}</p>
                                {project.onSale && project.salePrice && (
                                  <p className="text-sm text-muted-foreground">{formatINR(project.salePrice)}</p>
                                )}
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span>{project.rating}</span>
                                <span className="text-muted-foreground text-sm">({project.reviews})</span>
                              </div>
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{project.deliveryTime}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-8 h-8 bg-transparent"
                                  onClick={() => handleEditProject(project)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-8 h-8 text-destructive hover:text-destructive bg-transparent"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "add-project" && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">{editingProject ? "Edit Project" : "Add New Project"}</h2>
                <p className="text-muted-foreground">
                  {editingProject ? "Update project details" : "Fill in the details to add a new IoT project"}
                </p>
              </div>

              <form
                onSubmit={handleProjectSubmit}
                className="bg-background rounded-2xl border border-border p-6 space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Project Name</label>
                    <Input
                      value={projectFormData.name}
                      onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                      placeholder="Smart Home Automation System"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select
                      value={projectFormData.category}
                      onValueChange={(v) => setProjectFormData({ ...projectFormData, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (INR)</label>
                    <Input
                      type="number"
                      value={projectFormData.price}
                      onChange={(e) => setProjectFormData({ ...projectFormData, price: e.target.value })}
                      placeholder="199999"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Stock</label>
                    <Input
                      type="number"
                      value={projectFormData.stock}
                      onChange={(e) => setProjectFormData({ ...projectFormData, stock: e.target.value })}
                      placeholder="15"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Delivery Time</label>
                    <Input
                      value={projectFormData.deliveryTime}
                      onChange={(e) => setProjectFormData({ ...projectFormData, deliveryTime: e.target.value })}
                      placeholder="7-10 days"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating (1-5)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={projectFormData.rating}
                      onChange={(e) => setProjectFormData({ ...projectFormData, rating: e.target.value })}
                      placeholder="4.5"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Reviews Count</label>
                    <Input
                      type="number"
                      value={projectFormData.reviews}
                      onChange={(e) => setProjectFormData({ ...projectFormData, reviews: e.target.value })}
                      placeholder="124"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Image URL</label>
                    <Input
                      value={projectFormData.image}
                      onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                      placeholder="/project-image.jpg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={projectFormData.description}
                      onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                      placeholder="Complete home automation solution with voice control..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Features (comma separated)</label>
                    <Textarea
                      value={projectFormData.features}
                      onChange={(e) => setProjectFormData({ ...projectFormData, features: e.target.value })}
                      placeholder="Voice Control, Mobile App, Energy Monitoring, Scene Automation"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Components</label>
                    <Input
                      value={projectFormData.components}
                      onChange={(e) => setProjectFormData({ ...projectFormData, components: e.target.value })}
                      placeholder="Arduino, ESP32, Relay Modules, Sensors, Custom PCB"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="project-featured"
                      checked={projectFormData.featured}
                      onCheckedChange={(c) => setProjectFormData({ ...projectFormData, featured: c as boolean })}
                    />
                    <label htmlFor="project-featured" className="text-sm font-medium cursor-pointer">
                      Featured Project
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="project-onSale"
                      checked={projectFormData.onSale}
                      onCheckedChange={(c) => setProjectFormData({ ...projectFormData, onSale: c as boolean })}
                    />
                    <label htmlFor="project-onSale" className="text-sm font-medium cursor-pointer">
                      On Sale
                    </label>
                  </div>

                  {projectFormData.onSale && (
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">Sale Price (INR)</label>
                      <Input
                        type="number"
                        value={projectFormData.salePrice}
                        onChange={(e) => setProjectFormData({ ...projectFormData, salePrice: e.target.value })}
                        placeholder="159999"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    {editingProject ? "Update Project" : "Add Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetProjectForm()
                      setActiveTab("projects")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-1">Orders</h2>
                <p className="text-muted-foreground">Manage customer orders</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-20 bg-background rounded-2xl border border-border">
                  <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div
                      key={order.id}
                      className="bg-background rounded-2xl border border-border p-4 sm:p-6 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="cursor-pointer"
                            onClick={() => updateOrderStatus(order.id)}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <p className="font-bold text-primary">{formatINR(order.total)}</p>
                        </div>
                      </div>

                      {order.shippingAddress && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Shipping Address:</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{" "}
                            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                            <div className="relative w-10 h-10 rounded overflow-hidden bg-background">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">{formatINR(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full animate-fade-in-up">
            <h3 className="text-xl font-semibold mb-2">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button variant="destructive" className="flex-1" onClick={confirmDelete}>
                Delete
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setDeleteModalOpen(false)
                  setProductToDelete(null)
                  setProjectToDelete(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
