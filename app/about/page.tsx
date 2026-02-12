"use client";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { AboutSection } from "@/components/about-section";

export default function AboutPage() {
    return (
    <>
    <Navbar />
    <div className="mt-20">
    <AboutSection />
    </div>
    <Footer/>
    </>
    )
}