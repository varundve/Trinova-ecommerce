import { Navbar } from "@/components/navbar";
import { ProductsSection } from "@/components/products-section";


export default function ProductsPage() {
  return (
    <main className="min-h-screen">
        <Navbar></Navbar>
      <ProductsSection />
      
    </main>
  );
}   