"use client"
import Image from "next/image"
import { Award, ShieldCheck } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "Innovation in action at EACE-2025 | PSIT Kanpur 🌍✨",
    description:
      "EACE-2025 was a milestone moment for innovation, collaboration, and limitless possibilities. Proud to represent our vision on a global platform. 🚀.",
    image: "/images/eventonee.jpeg",
    year: "2026",
  },
  {
    id: 2,
    title: "Certified Participation at MSME EXPO 2026 | Ministry of MSME, Govt. of India",
    description:
      "Awarded Certificate of Participation by MSME – Development & Facilitation Office, Government of India, for contributing to the Development Programme – Cum – MSME EXPO 2026..",
    image: "/images/delhievent.jpeg",
    year: "2026",
  },
  {
    id: 3,
    title: "A Milestone Achievement in Our Startup Journey",
    description:
      "Proud to be among the Top 10 Finalists of Pitch Fest 2.0 by Vision Startups Accelerator — a milestone moment for innovation and growth. 🚀",
    image: "/images/tankpitch.png",
    year: "2026",
  },
  {
    id: 4,
    title: "Trinova Innovation at IIT Delhi | Technoverse by EDC 💡✨",
    description:
      "Presenting Trinova Innovation at IIT Delhi – Technoverse, organized by EDC, IIT Delhi. A proud moment of innovation and impact. 🚀.",
    image: "/images/both.png",
    year: "2026",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 scroll-mt-20" id="achievements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Our Achievements
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Company Achivement and Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
           A passionate team committed to change
          </p>
        </div>

        {/* Achievement Cards - alternating layout */}
        <div className="space-y-16">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-12 items-center animate-fade-in-up`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden group">
                  <Image
                    src={achievement.image || "/placeholder.svg"}
                    alt={achievement.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {achievement.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="inline-flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Achievement</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight text-balance">
                  {achievement.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
