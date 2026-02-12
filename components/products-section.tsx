"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Eye, ShoppingCart, Star, Sparkles, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatINR } from "@/lib/utils"
import { getProducts } from "@/lib/products"
import { addToCart } from "@/lib/cart"
import { Product } from "@/lib/types"



const categories = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "safety", name: "Safety" },
  { id: "tools", name: "Tools" },
  { id: "machinery", name: "Machinery" },
]

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProducts(getProducts())
  }, [])

  const filteredProducts = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory)

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    window.dispatchEvent(new Event("storage"))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  if (!mounted) return null

  return (
    <section id="products" className="py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mt-12">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Our Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Premium Industrial Equipment</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of high-quality safety devices
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`rounded-full transition-all ${
                activeCategory === category.id ? "shadow-lg shadow-primary/25" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground">Products will appear here once added by admin</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer" onClick={() => window.location.href = `/products/${product.id}`}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                    {product.featured && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {product.onSale && (
                      <Badge variant="destructive">
                        <Tag className="w-3 h-3 mr-1" />
                        Sale
                      </Badge>
                    )}
                  </div>

                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white text-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(24)</span>
                  </div>

                  <span className="text-xs font-medium text-primary uppercase tracking-wide">{product.category}</span>

                  <h3 
                    className="font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/products/${product.id}`}
                  >
                    {product.name}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        {formatINR(product.onSale && product.salePrice ? product.salePrice : product.price)}
                      </span>
                      {product.onSale && product.salePrice && (
                        <span className="text-sm text-muted-foreground line-through">{formatINR(product.price)}</span>
                      )}
                    </div>

                    <Button size="icon" className="rounded-full shadow-lg" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
