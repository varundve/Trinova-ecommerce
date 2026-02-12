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
  Clock,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Package,
  ArrowLeft,
  FileText,
  Users,
  Cpu,
  Box,
  ThumbsUp,
  Camera,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { formatINR } from "@/lib/utils"
import { getProjects } from "@/lib/projects"
import { addProjectToCart } from "@/lib/cart"
import { getSession } from "@/lib/auth"
import { addToWishlist, isInWishlist } from "@/lib/wishlist"
import { Review,  Project } from "@/lib/types" 
import {addReview, getReviews, getAverageRating, markReviewHelpful } from "@/lib/reviews"




export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
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
    const projects = getProjects()
    const foundProject = projects?.find((p) => p.id === params.id)
    setProject(foundProject || null)

    if (projects && foundProject) {
      const related = projects
        .filter((p) => p.category === foundProject.category && p.id !== foundProject.id)
        .slice(0, 4)
      setRelatedProjects(related)

      const session = getSession()
      if (session) {
        setInWishlist(isInWishlist(session.id, foundProject.id))
      }

      // Load reviews
      const projectReviews = getReviews(foundProject.id, "project")
      setReviews(projectReviews)
      setRatingStats(getAverageRating(foundProject.id, "project"))
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!project) return
    for (let i = 0; i < quantity; i++) {
      addProjectToCart(project)
    }
    window.dispatchEvent(new Event("storage"))
    window.dispatchEvent(new Event("cartUpdated"))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleAddToWishlist = () => {
    if (!project) return
    const session = getSession()
    if (!session) {
      router.push("/login")
      return
    }
    addToWishlist(session.id, {
      id: project.id,
      name: project.name,
      price: project.price,
      salePrice: project.salePrice,
      image: project.image,
      category: project.category,
      type: "project",
    })
    setInWishlist(true)
  }

  const handleSubmitReview = () => {
    if (!project) return
    const session = getSession()
    if (!session) {
      router.push("/login")
      return
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) return

    setSubmittingReview(true)
    
    const newReview = addReview({
      itemId: project.id,
      itemType: "project",
      userId: session.id,
      userName: `${session.firstName} ${session.lastName}`,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      images: reviewImages,
    })

    setReviews([newReview, ...reviews])
    setRatingStats(getAverageRating(project.id, "project"))
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

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 fill-amber-400 text-amber-400" />)
    }
    if (hasHalf) {
      stars.push(<Star key="half" className="w-5 h-5 fill-amber-400/50 text-amber-400" />)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-muted-foreground/30" />)
    }
    return stars
  }

  const formatCategory = (category: string) => {
    const map: Record<string, string> = {
      "smart-home": "Smart Home",
      industrial: "Industrial",
      agriculture: "Agriculture",
      healthcare: "Healthcare",
      security: "Security",
    }
    return map[category] || category
  }

  if (!mounted) return null

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The project you are looking for does not exist.</p>
            <Button asChild>
              <Link href="/projects">Browse Projects</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const discountPercent =
    project.onSale && project.salePrice
      ? Math.round(((project.price - project.salePrice) / project.price) * 100)
      : 0

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate max-w-50">{project.name}</span>
          </nav>

         
          <Button variant="ghost" size="sm" className="mb-6 -ml-2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

         
          <div className="grid lg:grid-cols-2 gap-12">
           
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-muted border">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
                {project.onSale && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">{discountPercent}% OFF</Badge>
                )}
                {project.featured && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-white">Featured</Badge>
                )}
              </div>

            
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
                      src={project.image || "/placeholder.svg"}
                      alt={`${project.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {formatCategory(project.category)}
                </Badge>
                {project.stock < 10 && (
                  <Badge variant="destructive">Only {project.stock} left</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex">{renderStars(project.rating)}</div>
                <span className="text-sm font-medium">{project.rating}</span>
                <span className="text-sm text-muted-foreground">({project.reviews} reviews)</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {project.deliveryTime}
                </span>
              </div>

             
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatINR(project.salePrice || project.price)}
                </span>
                {project.onSale && project.salePrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">{formatINR(project.price)}</span>
                    <Badge variant="destructive">Save {formatINR(project.price - project.salePrice)}</Badge>
                  </>
                )}
              </div>

             
              <p className="text-muted-foreground mb-6 leading-relaxed">{project.description}</p>

             
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="px-3 py-1">
                      <Check className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

            
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
                    onClick={() => setQuantity(Math.min(project.stock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">({project.stock} available)</span>
              </div>

              
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

              
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Box className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Complete Package</p>
                    <p className="text-sm font-medium">Hardware + Software</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Documentation</p>
                    <p className="text-sm font-medium">Full Guides Included</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Support</p>
                    <p className="text-sm font-medium">Installation Help</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Warranty</p>
                    <p className="text-sm font-medium">1 Year Coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
          <div className="mt-16">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="components"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Components
                </TabsTrigger>
                <TabsTrigger
                  value="documentation"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Documentation
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Reviews ({ratingStats.count > 0 ? ratingStats.count : project.reviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-4">Project Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">{feature}</p>
                          <p className="text-sm text-muted-foreground">Fully implemented and tested</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mt-8 mb-4">What You Get</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span>Complete hardware kit with all components</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span>Pre-programmed microcontrollers ready to use</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span>Source code with detailed comments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span>Circuit diagrams and PCB layouts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span>Step-by-step assembly guide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span>Video tutorials for installation</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="components" className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      Hardware Components
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-muted-foreground mb-4">{project.components}</p>
                      <ul className="space-y-2">
                        {[
                          "Main Controller Board",
                          "Sensor Modules",
                          "Communication Module (WiFi/BT)",
                          "Power Supply Unit",
                          "Connecting Wires & Cables",
                          "Enclosure/Housing",
                          "Mounting Hardware",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Software & Firmware
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {[
                          "Firmware (Pre-loaded)",
                          "Source Code (Editable)",
                          "Mobile App (Android/iOS)",
                          "Web Dashboard Access",
                          "API Documentation",
                          "Configuration Files",
                          "Test Scripts",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documentation" className="pt-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Complete documentation package included with every project purchase:
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Quick Start Guide",
                        desc: "Get up and running in minutes",
                        icon: "rocket",
                      },
                      {
                        title: "User Manual",
                        desc: "Detailed operation instructions",
                        icon: "book",
                      },
                      {
                        title: "Circuit Diagrams",
                        desc: "Complete schematic drawings",
                        icon: "cpu",
                      },
                      {
                        title: "PCB Layouts",
                        desc: "Gerber files included",
                        icon: "layout",
                      },
                      {
                        title: "Code Documentation",
                        desc: "Fully commented source code",
                        icon: "code",
                      },
                      {
                        title: "Video Tutorials",
                        desc: "Step-by-step video guides",
                        icon: "video",
                      },
                    ].map((doc) => (
                      <div
                        key={doc.title}
                        className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <FileText className="w-8 h-8 text-primary mb-3" />
                        <h4 className="font-medium mb-1">{doc.title}</h4>
                        <p className="text-sm text-muted-foreground">{doc.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6">
             
                <div className="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-muted/50 rounded-xl">
                  <div className="text-center md:border-r md:pr-8">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {ratingStats.count > 0 ? ratingStats.average : project.rating}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(ratingStats.count > 0 ? ratingStats.average : project.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {ratingStats.count > 0 ? ratingStats.count : project.reviews} reviews
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
                      Share your experience with this project to help others make better decisions.
                    </p>
                  </div>
                </div>

              
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

                     
                        <div>
                          <Label htmlFor="review-comment">Your Review</Label>
                          <Textarea
                            id="review-comment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share details about your experience with this project..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>

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

             
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                      <p className="text-muted-foreground mb-4">Be the first to review this project!</p>
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

     
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Projects</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProjects.map((relProject) => (
                  <Link
                    key={relProject.id}
                    href={`/projects/${relProject.id}`}
                    className="group bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={relProject.image || "/placeholder.svg"}
                        alt={relProject.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(relProject.rating)}
                        <span className="text-xs text-muted-foreground ml-1">({relProject.reviews})</span>
                      </div>
                      <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {relProject.name}
                      </h3>
                      <p className="text-lg font-bold text-primary mt-1">
                        {formatINR(relProject.salePrice || relProject.price)}
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
