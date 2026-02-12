"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Package,
  ArrowLeft,
  ThumbsUp,
  Camera,
  X,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Product,Review } from "@/lib/types"
import { formatINR } from "@/lib/utils"
import { getSession } from "@/lib/auth"
import {addToWishlist, isInWishlist } from "@/lib/wishlist"
import { getReviews, addReview, getAverageRating, markReviewHelpful } from "@/lib/reviews"
import { getProducts} from "@/lib/products"
import { addToCart } from "@/lib/cart"


export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewComment, setReviewComment] = useState("")
  const [reviewImages, setReviewImages] = useState<string[]>([])
  const [submittingReview, setSubmittingReview] = useState(false)


  useEffect(() => {
    setMounted(true)
    const products = getProducts()
    const foundProduct = products.find((p) => p.id === params.id)
    setProduct(foundProduct || null)

    if (foundProduct) {
      const related = products
        .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)

      const session = getSession()
      if (session) {
        setInWishlist(isInWishlist(session.id, foundProduct.id))
      }

      // Load reviews
      const productReviews = getReviews(foundProduct.id, "product")
      setReviews(productReviews)
      setRatingStats(getAverageRating(foundProduct.id, "product"))
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    window.dispatchEvent(new Event("storage"))
    window.dispatchEvent(new Event("cartUpdated"))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleAddToWishlist = () => {
    if (!product) return
    const session = getSession()
    if (!session) {
      router.push("/login")
      return
    }
    addToWishlist(session.id, {
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      category: product.category,
      type: "product",
    })
    setInWishlist(true)
  }

  const handleSubmitReview = () => {
    if (!product) return
    const session = getSession()
    if (!session) {
      router.push("/login")
      return
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) return

    setSubmittingReview(true)
    
    const newReview = addReview({
      itemId: product.id,
      itemType: "product",
      userId: session.id,
      userName: `${session.firstName} ${session.lastName}`,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      images: reviewImages,
    })

    setReviews([newReview, ...reviews])
    setRatingStats(getAverageRating(product.id, "product"))
    setShowReviewForm(false)
    setReviewRating(5)
    setReviewTitle("")
    setReviewComment("")
    setReviewImages([])
    setSubmittingReview(false)
  }

  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId)
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r)))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setReviewImages((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  if (!mounted) return null

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you are looking for does not exist.</p>
            <Button asChild>
              <Link href="/#products">Browse Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const discountPercent =
    product.onSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/#products" className="text-muted-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate max-w-50">{product.name}</span>
          </nav>

          {/* Back button */}
          <Button variant="ghost" size="sm" className="mb-6 -ml-2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Product Detail */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border">
             
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.onSale && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">{discountPercent}% OFF</Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-white">Featured</Badge>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Badge>
                {product.stock < 10 && (
                  <Badge variant="destructive">Only {product.stock} left</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.8</span>
                <span className="text-sm text-muted-foreground">(124 reviews)</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatINR(product.salePrice || product.price)}
                </span>
                {product.onSale && product.salePrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">{formatINR(product.price)}</span>
                    <Badge variant="destructive">Save {formatINR(product.price - product.salePrice)}</Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">({product.stock} available)</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className={`flex-1 gap-2 ${addedToCart ? "bg-green-500 hover:bg-green-600" : ""}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant={inWishlist ? "default" : "outline"}
                  className="gap-2"
                  onClick={handleAddToWishlist}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                  {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                </Button>
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders over Rs50,000</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">1 Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Full coverage</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Reviews ({ratingStats.count > 0 ? ratingStats.count : reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  <h3 className="text-lg font-semibold mt-6 mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.keyFeatures?.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5  shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold mb-4">Technical Specifications</h3>
                    <div className="space-y-3">
                      {Object.entries(product.specifications || {}).map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold mb-4">Package Contents</h3>
                    <ul className="space-y-2">
                      {product.packageContents?.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6">
                {/* Review Summary */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-muted/50 rounded-xl">
                  <div className="text-center md:border-r md:pr-8">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {ratingStats.count > 0 ? ratingStats.average : "4.8"}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(ratingStats.count > 0 ? ratingStats.average : 4.8)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {ratingStats.count > 0 ? ratingStats.count : reviews.length} reviews
                    </p>
                  </div>
                  <div className="flex-1">
                    <Button
                      onClick={() => {
                        const session = getSession()
                        if (!session) {
                          router.push("/login")
                          return
                        }
                        setShowReviewForm(true)
                      }}
                      className="w-full md:w-auto mb-4"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Share your experience with this product to help others make better purchasing decisions.
                    </p>
                  </div>
                </div>

                {/* Review Form Modal */}
                {showReviewForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-background rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Write a Review</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowReviewForm(false)}>
                          <X className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {/* Rating */}
                        <div>
                          <Label className="mb-2 block">Your Rating</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= reviewRating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <Label htmlFor="review-title">Review Title</Label>
                          <Input
                            id="review-title"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Summarize your experience"
                            className="mt-1"
                          />
                        </div>

                        {/* Comment */}
                        <div>
                          <Label htmlFor="review-comment">Your Review</Label>
                          <Textarea
                            id="review-comment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share details about your experience with this product..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>

                        {/* Image Upload */}
                        <div>
                          <Label className="mb-2 block">Add Photos (Optional)</Label>
                          <div className="flex flex-wrap gap-3">
                            {reviewImages.map((img, index) => (
                              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                <Image src={img || "/placeholder.svg"} alt={`Review image ${index + 1}`} fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            {reviewImages.length < 5 && (
                              <label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <Camera className="w-6 h-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground mt-1">Add</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmitReview}
                          disabled={!reviewTitle.trim() || !reviewComment.trim() || submittingReview}
                          className="w-full"
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                      <p className="text-muted-foreground mb-4">Be the first to review this product!</p>
                      <Button
                        onClick={() => {
                          const session = getSession()
                          if (!session) {
                            router.push("/login")
                            return
                          }
                          setShowReviewForm(true)
                        }}
                      >
                        Write a Review
                      </Button>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-primary text-sm">
                                {review.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{review.userName}</p>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                        
                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {review.images.map((img, index) => (
                              <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                <Image src={img || "/placeholder.svg"} alt={`Review image ${index + 1}`} fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => handleMarkHelpful(review.id)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.id}
                    href={`/products/${relProduct.id}`}
                    className="group bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={relProduct.image || "/placeholder.svg"}
                        alt={relProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {relProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-primary mt-1">
                        {formatINR(relProduct.salePrice || relProduct.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
