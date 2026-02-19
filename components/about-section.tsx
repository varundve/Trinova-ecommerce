"use client"

import Image from "next/image"
import {
  Cpu,
  BarChart,
  Award,
  Globe,
  ShieldCheck,
  Rocket,
  Siren,
  UserCheck,
} from "lucide-react"

const buildPoints = [
  {
    title: "Future-Ready Tech",
    description:
      "Smart engineering meets bold imagination to create solutions that stand out.",
    icon: Cpu,
  },
  {
    title: "Process Optimization",
    description:
      "Tools that simplify complex workflows and increase productivity effortlessly.",
    icon: BarChart,
  },
  {
    title: "User-First Products",
    description:
      "Designed with simplicity, clarity and real-world usage at the core.",
    icon:  UserCheck,
  },
  {
    title: "Safety Technology",
    description:
      "Starting with Safeguard+, we engineer technology that saves lives.",
    icon: Siren,
  },
]

const companyAchievements = [
  {
    icon: ShieldCheck,
    title: " Our Mission",
    description: "Empower. Innovate. Transform. To create meaningful technology that improves lives, strengthens safety, and enhances the way people live and work.",
  },
  {
    icon: Award,
    title: " Our Vision",
    description: "To become India's leading innovation powerhouse — known for creating smart, sustainable, and life-enhancing technologies.",
  },
  {
    icon: Globe,
    title: "Our Values",
    description: "We build innovative solutions that others haven’t imagined, driven by purpose and designed to improve lives.",
  },
  {
    icon: Rocket,
    title: "Our Future",
    description: "We solve real problems with real impact Products born from deep research & engineering A perfect blend of creativity, logic, and design.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="scroll-pt-32">

      {/* Block 1: Trinova Innovation - Full-width hero banner */}
      <div className="relative py-28 md:py-36 overflow-hidden">
        <Image
          src="/images/about-header-bg.jpg"
          alt="Trinova Innovation facility background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/75" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70 mb-4">
            About Us
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 text-balance leading-tight">
            Trinova Innovation
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
          We build smart, meaningful, and future-ready solutions that empower people, protect lives, and redefine what technology can do for the world.
          </p>
        </div>
      </div>

      {/* Block 2: The Story Behind Trinova */}
      <div className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: Two stacked images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/about1.jpeg"
                    alt="Trinova Innovation smart factory"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                  <p className="text-3xl font-bold">Innovating Today</p>
                  <p className="text-sm font-medium text-primary-foreground/80">Transforming Tomorrow</p>
                </div>
              </div>
              <div className="pt-8">
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/aboutt.jpeg"
                    alt="Trinova Innovation engineering team collaborating"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right: Story content */}
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">
                The Story Behind Trinova
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                🔱 Trinetra Divine Protection
                Inspired by Lord Shiva’s third eye
                Protection We foresee danger and protect lives with Safeguard+.
                Awareness  Real time detection and response.
                Transformation Redefining safety with instant impact.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
               ✨ Nova — A Star Reborn Symbol of brilliance and new beginnings.
               New Possibilities Inspired by “new” we create bold solutions that redefine innovation.
               Rising Innovation Like a shining star, Trinova leads with creativity, brilliance, and next-gen technology.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are a purpose-driven innovation company turning bold ideas into impactful solutions. At Trinova Innovation LLP, we build smart, user-focused technology that empowers, protects, and inspires.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Block 3: What We Build - And Why It Matters */}
      <div className="py-20 md:py-28 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">
              Our Solutions
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-balance leading-tight">
              What We Build - And Why It Matters
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every product we create is designed to solve real life problems, protect lives, and empower people. We build smart, meaningful, and future-ready solutions that make a difference in the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {buildPoints.map((item, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl p-8 border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <item.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block 4: Company Achievements */}
      <div className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">
            Recognition
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-balance">
             Why the Future Belongs to Trinova Innovation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
             A mission dedicated to safety, innovation & transformation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyAchievements.map((item, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl p-8 border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors duration-300">
                  <item.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
