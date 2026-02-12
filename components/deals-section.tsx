"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, ArrowRight, Zap, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/products";
import { formatINR } from "@/lib/utils"
import { addToCart } from "@/lib/cart"
import { Product } from "@/lib/types";

export function DealsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    setProducts(
      getProducts()
        .filter((p) => p.onSale)
        .slice(0, 3),
    )
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    window.dispatchEvent(new Event("storage"))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  if (products.length === 0) return null

  return (
    <section className="py-20 gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-warning" />
              <span className="text-primary-foreground/80 font-medium">Flash Sale</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Deals of the Day</h2>
            <p className="text-primary-foreground/70">Limited time offers on premium products</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary-foreground" />
            <span className="text-primary-foreground font-medium">Ends in:</span>
            <div className="flex gap-2">
              {[
                { value: timeLeft.hours, label: "HRS" },
                { value: timeLeft.minutes, label: "MIN" },
                { value: timeLeft.seconds, label: "SEC" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="bg-primary-foreground text-primary font-bold text-xl md:text-2xl px-3 py-2 rounded-lg min-w-15">
                    {item.value.toString().padStart(2, "0")}
                  </div>
                  <span className="text-xs text-primary-foreground/70 mt-1 block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deal Products */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-primary-foreground rounded-2xl overflow-hidden shadow-xl animate-fade-in-up hover:scale-[1.02] transition-transform"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video cursor-pointer" onClick={() => window.location.href = `/products/${product.id}`}>
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                  {Math.round(((product.price - (product.salePrice || product.price)) / product.price) * 100)}% OFF
                </div>
              </div>
              <div className="p-5">
                <h3 
                  className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/products/${product.id}`}
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatINR(product.salePrice || product.price)}
                  </span>
                  <span className="text-muted-foreground line-through">{formatINR(product.price)}</span>
                </div>
                <Button className="w-full group" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Add to Cart
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
