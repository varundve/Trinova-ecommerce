"use client"

import Image from "next/image"
import { Check, Award, Users, Globe, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  { icon: Award, label: "Development Programme cum MSME EXPO 2026", value: "Programme" },
  { icon: Users, label: "MSME Development & Facilitation Office, Government of India", value: "Authority" },
  { icon: Globe, label: "Understanding MSME policies & support schemes", value: "Exposure" },
  { icon: Headphones, label: "Interaction with MSME officials & entrepreneurs", value: "Networking" },
]

const features = [
  "Participated in MSME EXPO 2026",
  "Organized by Ministry of MSME, Govt. of India",
  "Focus on MSME development & innovation",
  "Networking with industry professionals",
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/certi.jpeg" alt="Trinova Innovation Facility" fill className="object-cover" />
            </div>

            {/* Stats card */}
           { /*<div className="absolute -bottom-8 -right-8 bg-background rounded-2xl p-6 shadow-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">1+</p>
                  <p className="text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
            </div>*/}

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
          
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              MSME Development Programme & EXPO 2026 Participation
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
             Trinova Innovation LLP proudly participated in the Development Programme cum MSME EXPO 2026 organized by the MSME Development & Facilitation Office, Kanpur.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Button  size="lg"  className="shadow-lg shadow-primary/25 cursor-pointer">
              <a href="#achievements" >Learn More About Us</a>
            </Button>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 text-center border border-border hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{item.value}</p>
              <p className="text-muted-foreground text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
