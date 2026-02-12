"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Truck, Headphones, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "0+", label: "Happy Clients" },
  { value: "0+", label: "Products Sold" },
  { value: "0+", label: "Years Experience" },
]

const features = [
  { icon: Shield, label: "Quality Assured" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: Award, label: "Best Prices" },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern-dark.jpg')] opacity-10" />

      {/* Animated shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 md:pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={mounted ? "animate-fade-in-up" : "opacity-0"}>
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              Trusted by 0+ Companies
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Transform Innovation
              <span className="block text-gradient">Into Impact</span>
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-xl mb-8 leading-relaxed">
              Trinova Innovation LLP is a Kanpur-based electronics startup building smart, safety-focused IoT products
              for real-world use. Discover cutting-edge industrial solutions.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary/90 group" asChild>
                <Link href="#products">
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                asChild
              >
                <Link href="#contact">Get Quote</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className={`relative ${mounted ? "animate-slide-in-right" : "opacity-0"}`}>
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-accent/30 rounded-3xl blur-2xl" />
              <div className="relative bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-primary/20 shadow-2xl">
                <Image
                  src="/images/herosection.jpg"
                  alt="Trinova Innovation Products"
                  width={500}
                  height={500}
                  className="rounded-2xl"
                />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 top-1/4 bg-background rounded-xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">ISO Certified</p>
                    <p className="text-xs text-muted-foreground">Quality Assured</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-4 bottom-1/4 bg-background rounded-xl p-4 shadow-xl animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Fast Shipping</p>
                    <p className="text-xs text-muted-foreground">Nationwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features bar */}
      <div className="relative bg-background/5 backdrop-blur-sm border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.label}
                className={`flex items-center gap-3 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium text-primary-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
