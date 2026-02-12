// lib/products.ts
import { getFromStorage, saveToStorage } from "./storage";
import { PRODUCTS_KEY} from "./storageKeys";
import { getSampleProducts } from "./sampleData";
import { Product } from "./types";


export function getProducts(): Product[] {
  return getFromStorage(PRODUCTS_KEY, getSampleProducts())
}

export function saveProducts(products: Product[]) {
  saveToStorage(PRODUCTS_KEY, products)
}

export function addProduct(product: Product) {
  const products = getProducts()
  saveProducts([...products, product])
}

export default function updateProduct(product: Product): void {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === product.id)
  if (index !== -1) {
    products[index] = product
    saveProducts(products)
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p) => p.id !== id)
  saveProducts(products)
}