"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  ChevronRight,
  Check,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { formatINR } from "@/lib/utils"
import { getCart, updateCartQuantity, removeFromCart } from "@/lib/cart"
import { getSession } from "@/lib/auth"
import { getAddresses } from "@/lib/Address"
import { createOrderWithAddress } from "@/lib/orders"
import { CartItem, Address, PaymentMethod } from "@/lib/types"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

type CheckoutStep = "cart" | "address" | "payment" | "confirmation"

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [step, setStep] = useState<CheckoutStep>("cart")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod["type"]>("upi")
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    if (isOpen) {
      setCart(getCart())
      const session = getSession()
      if (session) {
        const userAddresses = getAddresses(session.id)
        setAddresses(userAddresses)
        const defaultAddr = userAddresses.find((a) => a.isDefault)
        if (defaultAddr) setSelectedAddress(defaultAddr)
      }
    }
  }, [isOpen])

  const updateQuantity = (id: string, change: number) => {
    const item = cart.find((item) => item.id === id)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity <= 0) {
        handleRemove(id)
      } else {
        updateCartQuantity(id, newQuantity)
        setCart(getCart())
      }
    }
  }

  const handleRemove = (id: string) => {
    removeFromCart(id)
    setCart(getCart())
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0)
  const shipping = subtotal >= 50000 ? 0 : 499
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + gst

  const handleProceedToCheckout = () => {
    const session = getSession()
    if (!session) {
      onClose()
      router.push("/login")
      return
    }
    setStep("address")
  }

  const handleProceedToPayment = () => {
    if (!selectedAddress) return
    setStep("payment")
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const paymentDetails: PaymentMethod = {
      type: paymentMethod,
      details:
        paymentMethod === "upi"
          ? { upiId }
          : paymentMethod === "debit-card" || paymentMethod === "credit-card"
            ? { cardLast4: cardNumber.slice(-4), cardType: paymentMethod === "credit-card" ? "Credit" : "Debit" }
            : undefined,
    }

    const order = createOrderWithAddress(cart, total, selectedAddress, paymentDetails)
    setOrderId(order.id)
    setOrderSuccess(true)
    setIsProcessing(false)
    setStep("confirmation")
    setCart([])
  }

  const handleClose = () => {
    setStep("cart")
    setOrderSuccess(false)
    setPaymentMethod("upi")
    setUpiId("")
    setCardNumber("")
    setCardExpiry("")
    setCardCvv("")
    setCardName("")
    onClose()
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-foreground/50 z-50 animate-fade-in" onClick={handleClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-480px bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {step === "cart" && (
              <>
                <ShoppingBag className="w-5 h-5" />
                Shopping Cart
              </>
            )}
            {step === "address" && (
              <>
                <MapPin className="w-5 h-5" />
                Select Address
              </>
            )}
            {step === "payment" && (
              <>
                <CreditCard className="w-5 h-5" />
                Payment
              </>
            )}
            {step === "confirmation" && (
              <>
                <Check className="w-5 h-5 text-green-500" />
                Order Confirmed
              </>
            )}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        {step !== "confirmation" && cart.length > 0 && (
          <div className="px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center justify-between text-xs">
              <div
                className={`flex items-center gap-1 ${step === "cart" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "cart" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  1
                </span>
                Cart
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div
                className={`flex items-center gap-1 ${step === "address" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "address" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  2
                </span>
                Address
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div
                className={`flex items-center gap-1 ${step === "payment" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  3
                </span>
                Payment
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Cart Step */}
          {step === "cart" && (
            <>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground text-sm">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-muted/50 rounded-lg animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-background shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-primary font-semibold mt-1">{formatINR(item.salePrice || item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-7 h-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-7 h-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 ml-auto text-destructive hover:text-destructive"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Address Step */}
          {step === "address" && (
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No saved addresses</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add an address in your profile to continue</p>
                  <Button
                    onClick={() => {
                      handleClose()
                      router.push("/profile?tab=addresses")
                    }}
                  >
                    Add Address
                  </Button>
                </div>
              ) : (
                <RadioGroup
                  value={selectedAddress?.id || ""}
                  onValueChange={(id) => setSelectedAddress(addresses.find((a) => a.id === id) || null)}
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress?.id === address.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{address.fullName}</p>
                            {address.isDefault && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                          <p className="text-sm mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <h3 className="font-medium mb-4">Select Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod["type"])}>
                  {/* UPI */}
                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">UPI</p>
                        <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    {paymentMethod === "upi" && (
                      <div className="mt-4 pl-14">
                        <Label htmlFor="upiId" className="text-sm">
                          UPI ID
                        </Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Debit Card */}
                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "debit-card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod("debit-card")}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="debit-card" id="debit-card" />
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Debit Card</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                    {paymentMethod === "debit-card" && (
                      <div className="mt-4 pl-14 space-y-3">
                        <div>
                          <Label htmlFor="cardNumber" className="text-sm">
                            Card Number
                          </Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardName" className="text-sm">
                            Name on Card
                          </Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="cardExpiry" className="text-sm">
                              Expiry
                            </Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              maxLength={5}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvv" className="text-sm">
                              CVV
                            </Label>
                            <Input
                              id="cardCvv"
                              placeholder="123"
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              maxLength={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Credit Card */}
                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "credit-card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod("credit-card")}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Credit Card</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    {paymentMethod === "credit-card" && (
                      <div className="mt-4 pl-14 space-y-3">
                        <div>
                          <Label htmlFor="ccNumber" className="text-sm">
                            Card Number
                          </Label>
                          <Input
                            id="ccNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ccName" className="text-sm">
                            Name on Card
                          </Label>
                          <Input
                            id="ccName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="ccExpiry" className="text-sm">
                              Expiry
                            </Label>
                            <Input
                              id="ccExpiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              maxLength={5}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ccCvv" className="text-sm">
                              CVV
                            </Label>
                            <Input
                              id="ccCvv"
                              placeholder="123"
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              maxLength={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Net Banking */}
                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "net-banking"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod("net-banking")}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="net-banking" id="net-banking" />
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Net Banking</p>
                        <p className="text-xs text-muted-foreground">All major banks supported</p>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when you receive</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-green-500" : ""}>
                      {shipping === 0 ? "FREE" : formatINR(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>{formatINR(gst)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatINR(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {step === "confirmation" && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 animate-scale-in">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Order Placed!</h3>
              <p className="text-muted-foreground mb-4">Thank you for your purchase</p>
              <div className="bg-muted/50 rounded-xl p-4 w-full max-w-sm mb-6">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold">{orderId}</p>
                <p className="text-sm text-muted-foreground mt-3">Amount Paid</p>
                <p className="font-semibold text-lg text-primary">{formatINR(total)}</p>
                <p className="text-sm text-muted-foreground mt-3">Payment Method</p>
                <p className="font-medium capitalize">{paymentMethod.replace("-", " ")}</p>
              </div>
              <Button
                onClick={() => {
                  handleClose()
                  router.push("/profile?tab=orders")
                }}
              >
                View Orders
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "cart" && cart.length > 0 && (
          <div className="p-4 border-t border-border bg-background shrink-0">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? "text-green-500" : ""}>
                  {shipping === 0 ? "FREE" : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatINR(total)}</span>
              </div>
            </div>
            {subtotal < 50000 && (
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Add {formatINR(50000 - subtotal)} more for FREE shipping
              </p>
            )}
            <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        )}

        {step === "address" && addresses.length > 0 && (
          <div className="p-4 border-t border-border bg-background shrink-0 flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("cart")}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleProceedToPayment} disabled={!selectedAddress}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="p-4 border-t border-border bg-background shrink-0 flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("address")}>
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handlePlaceOrder}
              disabled={
                isProcessing ||
                (paymentMethod === "upi" && !upiId) ||
                ((paymentMethod === "debit-card" || paymentMethod === "credit-card") &&
                  (!cardNumber || !cardExpiry || !cardCvv || !cardName))
              }
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Processing...
                </>
              ) : (
                `Pay ${formatINR(total)}`
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
