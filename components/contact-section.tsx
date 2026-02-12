"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import MailSender from "@/app/utils/mailSender"

const contactInfo = [
  { icon: MapPin, label: "Address", value: "58/5 LAL COLONY JUHIKANPUR NAGAR - 208014" },
  { icon: Phone, label: "Phone", value: "+91 9305706040" },
  { icon: Mail, label: "Email", value: "trinovainnovation.contact@gmail.com" },
  { icon: Clock, label: "Working Hours", value: "Mon - Sat: 9:00 AM - 6:00 PM" },
]

export function ContactSection({ showDetails = true }: { showDetails?: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const mailSender = useMemo(() => new MailSender(), [])

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await mailSender.sendMail(
      formData.name,
      formData.email,
      formData.message
    )

    if (success) {
      setFormData({ name: "", email: "", subject: "", message: "" })
    }
  }

  return (
    <section id="contact" className="py-20 bg-muted/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div>
            {showDetails && (
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Contact Us
              </span>
            )}

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let&apos;s Discuss Your Requirements
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Get in touch with our team for personalized quotes, technical consultations,
              or any questions about our products and services.
            </p>

            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, label, value }, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-background rounded-2xl p-8 shadow-xl border">
            <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                />

                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>

              <Input
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange("subject")}
              />

              <Textarea
                placeholder="Your message..."
                rows={5}
                value={formData.message}
                onChange={handleChange("message")}
                required
              />

              <Button type="submit" size="lg" className="w-full group">
                Send Message
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
