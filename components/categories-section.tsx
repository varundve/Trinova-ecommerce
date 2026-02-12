"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Cpu, Shield, Wrench, Cog } from "lucide-react"

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Smart sensors, meters, and monitoring devices",
    icon: Cpu,
    image: "/images/electronic-components-iot-devices.jpg",
    count: 0,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "safety",
    name: "Safety Equipment",
    description: "Fire alarms, gas detectors, and protective gear",
    icon: Shield,
    image: "/images/safety-equipment-industrial.jpg",
    count: 2,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "tools",
    name: "Tools",
    description: "Precision instruments and diagnostic tools",
    icon: Wrench,
    image: "/images/industrial-tools-diagnostic-equipment.jpg",
    count: 0,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "machinery",
    name: "Machinery",
    description: "Power analyzers and industrial equipment",
    icon: Cog,
    image: "/images/industrial-machinery.png",
    count: 0,
    color: "from-purple-500 to-pink-500",
  },
]

export function CategoriesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of IoT solutions
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href={`#products?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image || "/images/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-linear-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}
                />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-background/90 rounded-xl flex items-center justify-center shadow-lg">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
                  {category.count} Products
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="flex items-center text-primary font-medium text-sm">
                  Browse Products
                  <ArrowRight
                    className={`ml-2 w-4 h-4 transition-transform ${hoveredId === category.id ? "translate-x-1" : ""}`}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
