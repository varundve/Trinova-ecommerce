"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  products: [
    { label: "Electronics", href: "/#products" },
    { label: "Safety Equipment", href: "/#products" },
    { label: "Tools", href: "/#products" },
    { label: "Machinery", href: "/#products" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Projects", href: "/projects" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/#contact" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Warranty", href: "#" },
  ],
  account: [
    { label: "My Profile", href: "/profile" },
    { label: "Order History", href: "/profile?tab=orders" },
    { label: "Track Order", href: "/profile?tab=tracking" },
    { label: "Wishlist", href: "/profile?tab=wishlist" },
  ],
  pages: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/#products" },
    { label: "IoT Projects", href: "/projects" },
    { label: "Admin Panel", href: "/admin" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/trinova-innovation-llp-1b1784387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/trinova_innovation?igsh=MXRjMWEycnJ3dGgxNA==", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main footer */}
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-7 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image src="/images/logo.jpg" alt="Trinova Innovation Logo" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Trinova Innovation</h3>
                <p className="text-sm text-background/60">Smart IoT Solutions</p>
              </div>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Building smart, safety-focused IoT products for real-world use. Your trusted partner in industrial
              innovation.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold mb-4">Pages</h4>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">My Account</h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact bar */}
        <div className="py-6 border-t border-background/10 flex flex-wrap gap-6 justify-center text-sm text-background/70">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Kanpur, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+91 9305706040</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>trinovainnovation.contact@gmail.com</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-background/10 text-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} Trinova Innovation LLP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
