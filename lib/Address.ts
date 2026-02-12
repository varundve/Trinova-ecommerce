
import { Address } from "./types"
import { ADDRESSES_KEY } from "./storageKeys"

export function getAddresses(userId: string): Address[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(`${ADDRESSES_KEY}_${userId}`)
  return stored ? JSON.parse(stored) : []
}

export function saveAddresses(userId: string, addresses: Address[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`${ADDRESSES_KEY}_${userId}`, JSON.stringify(addresses))
}

export function addAddress(userId: string, address: Omit<Address, "id">): Address {
  const addresses = getAddresses(userId)
  const newAddress: Address = {
    ...address,
    id: "ADDR-" + Date.now(),
  }
  if (addresses.length === 0 || address.isDefault) {
    addresses.forEach((addr) => (addr.isDefault = false))
    newAddress.isDefault = true
  }
  addresses.push(newAddress)
  saveAddresses(userId, addresses)
  return newAddress
}

export function updateAddress(userId: string, address: Address): void {
  const addresses = getAddresses(userId)
  const index = addresses.findIndex((a) => a.id === address.id)
  if (index !== -1) {
    if (address.isDefault) {
      addresses.forEach((addr) => (addr.isDefault = false))
    }
    addresses[index] = address
    saveAddresses(userId, addresses)
  }
}

export function deleteAddress(userId: string, addressId: string): void {
  const addresses = getAddresses(userId).filter((a) => a.id !== addressId)
  if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
    addresses[0].isDefault = true
  }
  saveAddresses(userId, addresses)
}

export function setDefaultAddress(userId: string, addressId: string): void {
  const addresses = getAddresses(userId)
  addresses.forEach((addr) => {
    addr.isDefault = addr.id === addressId
  })
  saveAddresses(userId, addresses)
}