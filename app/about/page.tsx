"use client";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { AboutSection } from "@/components/about-section";
import { TestimonialsSection } from "@/components/testimonials-section";

      
export default function AboutPage() {
    return (
    <>
    <Navbar />
     <div className="pt-104px">
    <AboutSection />
    <TestimonialsSection />
    </div>
    <Footer/>
    </>
    )
}
