"use client";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ContactSection } from "@/components/contact-section";
export default function ContactPage() {
    return (
    <>
    <Navbar />
    <div className="mt-20">
    <ContactSection  showDetails={false}/>
    </div>
    <Footer/>
    </>
    )
}