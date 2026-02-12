"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  Clock,
  ShoppingCart,
  Check,
  Package,
  FileText,
  Users,
  Shield,
  Home,
  Factory,
  Leaf,
  Activity as ActivityIcon,
  ShieldCheck,
  Grid3X3,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {Project } from "@/lib/types"
import { getProjects} from "@/lib/projects"
import { addProjectToCart} from "@/lib/cart"
import { formatINR } from "@/lib/utils"

const categories = [
  { id: "all", label: "All Projects", icon: Grid3X3 },
  { id: "smart-home", label: "Smart Home", icon: Home },
  { id: "industrial", label: "Industrial", icon: Factory },
  { id: "agriculture", label: "Agriculture", icon: Leaf },
  { id: "healthcare", label: "Healthcare", icon: ActivityIcon }, // Using ActivityIcon instead of Activity
  { id: "security", label: "Security", icon: ShieldCheck },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const filteredProjects = activeCategory === "all" ? projects : projects?.filter((p) => p.category === activeCategory)

  const handleAddToCart = (project: Project) => {
    addProjectToCart(project)
    setAddedToCart(project.id)
    window.dispatchEvent(new Event("storage"))
    window.dispatchEvent(new Event("cartUpdated"))
    setTimeout(() => setAddedToCart(null), 1500)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />)
    }
    if (hasHalf) {
      stars.push(<Star key="half" className="w-4 h-4 fill-amber-400/50 text-amber-400" />)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />)
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

  return (
    <>
      <Navbar />

       Hero Section
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,196,204,0.15),transparent_50%)]" />

         Animated shapes 
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Custom IoT Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Ready-to-Deploy
                <br />
                <span className="text-gradient">IoT Projects</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Complete IoT project solutions with hardware, software, and deployment support. From smart home
                automation to industrial monitoring systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <a href="#projects-grid">
                    Browse Projects
                    <ShoppingCart className="w-4 h-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent" asChild>
                  <a href="#custom-project">Request Custom Project</a>
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block animate-slide-in-right">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <Image src="./images/iot-dashboard-with-connected-devices-and-sensors.jpg" alt="IoT Projects" fill className="object-cover" />
              </div>

               Floating cards 
              <div className="absolute -left-8 top-1/4 bg-background rounded-xl p-4 shadow-xl border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">100+ Projects</p>
                    <p className="text-xs text-muted-foreground">Delivered Successfully</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-4 bottom-1/4 bg-background rounded-xl p-4 shadow-xl border animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Full Support</p>
                    <p className="text-xs text-muted-foreground">Installation & Training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       Categories Section 
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Categories
            </span>
            <h2 className="text-3xl font-bold mb-4">Project Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore our specialized IoT project categories</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "bg-background hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeCategory === cat.id ? "bg-white/20" : "bg-primary/10"
                  }`}
                >
                  <cat.icon className={`w-6 h-6 ${activeCategory === cat.id ? "" : "text-primary"}`} />
                </div>
                <span className="font-medium text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

       Projects Grid 
      <section className="py-16" id="projects-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Projects
            </span>
            <h2 className="text-3xl font-bold mb-4">Ready-to-Order IoT Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete solutions with hardware, software, documentation, and support
            </p>
          </div>

          {filteredProjects && filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">No projects match your selected category</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects?.map((project, index) => {
                const discount =
                  project.onSale && project.salePrice
                    ? Math.round(((project.price - project.salePrice) / project.price) * 100)
                    : 0

                return (
                  <div
                    key={project.id}
                    className="group bg-background rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                     Image 
                    <Link href={`/projects/${project.id}`} className="block relative aspect-4/3 overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                       Badges 
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {project.featured && (
                          <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </span>
                        )}
                        {project.onSale && (
                          <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      Category tag 
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium">
                          {formatCategory(project.category)}
                        </span>
                      </div>

                      View Details Overlay 
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </span>
                      </div>
                    </Link>

                   Content 
                    <div className="p-5">
                       Rating 
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(project.rating)}</div>
                        <span className="text-sm font-medium">{project.rating}</span>
                        <span className="text-sm text-muted-foreground">({project.reviews} reviews)</span>
                      </div>

                       Name 
                      <Link href={`/projects/${project.id}`}>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors cursor-pointer">{project.name}</h3>
                      </Link>

                       Description 
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                       Features 
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.features.slice(0, 3).map((feature) => (
                          <span key={feature} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                            {feature}
                          </span>
                        ))}
                        {project.features.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                            +{project.features.length - 3} more
                          </span>
                        )}
                      </div>

                       Meta 
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {project.deliveryTime}
                        </span>
                        <span className={project.stock < 10 ? "text-red-500 font-medium" : "text-green-500"}>
                          {project.stock < 10 ? `Only ${project.stock} left` : "In Stock"}
                        </span>
                      </div>

                     Footer 
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-xl font-bold text-primary">
                            {formatINR(project.salePrice || project.price)}
                          </span>
                          {project.onSale && project.salePrice && (
                            <span className="ml-2 text-sm text-muted-foreground line-through">
                              {formatINR(project.price)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className={`gap-2 transition-all ${addedToCart === project.id ? "bg-green-500 hover:bg-green-600" : ""}`}
                          onClick={() => handleAddToCart(project)}
                        >
                          {addedToCart === project.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

       Why Choose Section 
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Why Us
            </span>
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Complete IoT solutions with everything you need</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                title: "Complete Package",
                desc: "Hardware, software, PCB design, enclosure, and all components included",
              },
              {
                icon: FileText,
                title: "Full Documentation",
                desc: "Detailed guides, circuit diagrams, code documentation, and user manuals",
              },
              {
                icon: Users,
                title: "Expert Support",
                desc: "Installation guidance, technical support, and training sessions included",
              },
              {
                icon: Shield,
                title: "Quality Assured",
                desc: "Tested and certified components with warranty and after-sales support",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-background rounded-xl p-6 border hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       Custom Project Request Section 
      <section className="py-16 relative overflow-hidden" id="custom-project">
        <div className="absolute inset-0 gradient-primary opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
                Custom Solutions
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom IoT Project?</h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                We design and develop custom IoT solutions tailored to your specific requirements. From concept to
                deployment, our team handles everything.
              </p>
              <ul className="space-y-4">
                {[
                  "Custom hardware design and PCB development",
                  "Firmware and software development",
                  "Cloud integration and mobile app development",
                  "On-site installation and training",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </span>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-2xl p-6 md:p-8 shadow-2xl">
              <h3 className="text-xl font-semibold mb-6">Request a Quote</h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Name</label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart-home">Smart Home</SelectItem>
                      <SelectItem value="industrial">Industrial Automation</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="security">Security Systems</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="100k-300k">₹1,00,000 - ₹3,00,000</SelectItem>
                      <SelectItem value="300k-500k">₹3,00,000 - ₹5,00,000</SelectItem>
                      <SelectItem value="500k+">₹5,00,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Description</label>
                  <Textarea placeholder="Describe your project requirements..." rows={4} />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Submit Request
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
