"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X, User, LogOut, Package, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Session } from "@/lib/types"
import { getCart } from "@/lib/cart"
import { getSession, clearSession } from "@/lib/auth"
import { CartSidebar } from "./cart-sidebar"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const updateCart = () => {
      const cart = getCart()
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
    }
    updateCart()
    window.addEventListener("storage", updateCart)
    window.addEventListener("cartUpdated", updateCart)
    const interval = setInterval(updateCart, 1000)
    return () => {
      window.removeEventListener("storage", updateCart)
      window.removeEventListener("cartUpdated", updateCart)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setSession(getSession())
  }, [])

  const handleLogout = () => {
    clearSession()
    setSession(null)
    window.location.href = "/"
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
   /* { href: "/projects", label: "Projects" },*/
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href.startsWith("/")) return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="gradient-primary text-primary-foreground py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <p className="hidden sm:block">Free shipping on orders over ₹50,000</p>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="hover:underline">
                Admin Panel
              </Link>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden">
                <Image
                  src="/images/logo.jpg"
                  alt="Trinova Innovation Logo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="hidden sm:block">
                <h1
                  className={`font-bold text-lg md:text-xl transition-colors ${
                    isScrolled ? "text-foreground" : "text-foreground"
                  }`}
                >
                  Trinova Innovation
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">Smart IoT Solutions</p>
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-full border border-border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-medium transition-colors text-primary hover:text-primary/80"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Auth - Updated user dropdown like the image */}
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden sm:flex items-center gap-2 hover:bg-transparent">
                      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold lowercase">
                        {session.firstName[0].toLowerCase()}
                        {session.lastName[0].toLowerCase()}
                      </div>
                      <span className="hidden lg:inline font-medium">{session.firstName}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 p-2">
                    <DropdownMenuItem asChild className="cursor-pointer py-3 px-3">
                      <Link href="/profile" className="flex items-center gap-3">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-3 px-3">
                      <Link href="/profile?tab=orders" className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer py-3 px-3 text-primary hover:text-primary focus:text-primary"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-4">
                  <Button>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-full border border-border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-full">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 font-medium transition-colors ${
                    isActive(link.href) ? "text-primary" : "hover:text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {session ? (
                <>
                  <div className="pt-2 border-t border-border">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 py-2 font-medium hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    <Link
                      href="/profile?tab=orders"
                      className="flex items-center gap-3 py-2 font-medium hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="w-5 h-5" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-3 py-2 font-medium text-primary hover:text-primary/80 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
