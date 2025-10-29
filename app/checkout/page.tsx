'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Package,
  AlertCircle
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCartStore } from '@/lib/store'
import { fadeInUp, staggerContainer, staggerItem, slideInRight, slideInLeft } from '@/lib/animations'
import toast from 'react-hot-toast'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type FormData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  sameAsShipping: boolean
}

function CheckoutForm({ clientSecret, orderNumber }: { clientSecret: string; orderNumber: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { clearCart } = useCartStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderNumber=${orderNumber}`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Update order status
        await fetch('/api/orders', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'}`,
          },
          body: JSON.stringify({
            orderNumber,
            paymentStatus: 'paid',
            status: 'processing',
          }),
        })

        clearCart()
        toast.success('Payment successful!')
        router.push(`/checkout/success?orderNumber=${orderNumber}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('An error occurred during payment')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <motion.button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold text-lg rounded-xl hover:shadow-xl hover:shadow-primary-emerald/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        whileHover={!isProcessing ? { scale: 1.02 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Complete Payment
          </>
        )}
      </motion.button>

      <p className="text-xs text-center text-neutral-500">
        Your payment information is secure and encrypted
      </p>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    sameAsShipping: true,
  })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  const { items, getTotal } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      toast.error('Your cart is empty')
      router.push('/cart')
    }
  }, [mounted, items, router])

  const steps = [
    { number: 1, title: 'Information', icon: User },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: Package },
  ]

  const handleInputChange = (field: string, value: string, nested?: string) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: {
          ...(prev[nested as keyof typeof prev] as any),
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const validateStep1 = () => {
    const { customerName, customerEmail, shippingAddress } = formData

    if (!customerName.trim()) {
      toast.error('Please enter your name')
      return false
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      toast.error('Please enter a valid email')
      return false
    }

    if (!shippingAddress.street.trim() || !shippingAddress.city.trim() || !shippingAddress.state.trim() || !shippingAddress.zipCode.trim()) {
      toast.error('Please complete shipping address')
      return false
    }

    return true
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Create order and get payment intent
      await createOrder()
    } else if (currentStep === 3) {
      // This step is handled by the payment form
    }
  }

  const createOrder = async () => {
    setIsCreatingOrder(true)

    try {
      const billingAddress = formData.sameAsShipping
        ? formData.shippingAddress
        : formData.billingAddress

      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        billingAddress,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant || null,
        })),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        setClientSecret(data.clientSecret)
        setOrderNumber(data.order.orderNumber)
        setCurrentStep(3)
        toast.success('Order created! Complete payment to finish.')
      } else {
        toast.error(data.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const subtotal = mounted ? getTotal() : 0
  const shipping = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg py-12">
      <div className="container-width px-6 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-neutral-100 mb-4">
            Secure <span className="text-gradient-primary">Checkout</span>
          </h1>
          <p className="text-neutral-400">Complete your purchase securely</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white shadow-lg shadow-primary-emerald/30'
                        : 'bg-neutral-900 text-neutral-500'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className={`mt-2 text-sm font-medium ${currentStep >= step.number ? 'text-neutral-200' : 'text-neutral-600'}`}>
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${currentStep > step.number ? 'bg-gradient-to-r from-primary-purple to-primary-emerald' : 'bg-neutral-900'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={slideInRight}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 space-y-6"
                >
                  <h2 className="text-2xl font-headline font-bold text-neutral-100 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary-emerald" />
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-headline font-bold text-neutral-100 flex items-center gap-2 pt-4">
                    <MapPin className="w-5 h-5 text-primary-purple" />
                    Shipping Address
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.street}
                        onChange={(e) => handleInputChange('street', e.target.value, 'shippingAddress')}
                        placeholder="123 Main St"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value, 'shippingAddress')}
                        placeholder="New York"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value, 'shippingAddress')}
                        placeholder="NY"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value, 'shippingAddress')}
                        placeholder="10001"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 px-6 py-3 text-neutral-400 hover:text-primary-emerald transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Cart
                    </Link>

                    <motion.button
                      onClick={handleNextStep}
                      className="px-8 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={slideInRight}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 space-y-6"
                >
                  <h2 className="text-2xl font-headline font-bold text-neutral-100 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary-emerald" />
                    Review & Continue
                  </h2>

                  <div className="p-4 bg-primary-emerald/10 border border-primary-emerald/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary-emerald flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-neutral-300">
                      <p className="font-semibold mb-1">Next: Secure Payment</p>
                      <p className="text-neutral-400">
                        Click continue to proceed to our secure payment form powered by Stripe
                      </p>
                    </div>
                  </div>

                  {/* Order Summary Preview */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-neutral-200">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-neutral-400">
                        <span>Items ({items.length}):</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Shipping:</span>
                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Tax:</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-neutral-100 pt-2 border-t border-neutral-800">
                        <span>Total:</span>
                        <span className="text-gradient-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <motion.button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-2 px-6 py-3 text-neutral-400 hover:text-primary-emerald transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </motion.button>

                    <motion.button
                      onClick={handleNextStep}
                      disabled={isCreatingOrder}
                      className="px-8 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all flex items-center gap-2 disabled:opacity-50"
                      whileHover={!isCreatingOrder ? { scale: 1.02 } : {}}
                      whileTap={!isCreatingOrder ? { scale: 0.98 } : {}}
                    >
                      {isCreatingOrder ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Order...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Form */}
              {currentStep === 3 && clientSecret && orderNumber && (
                <motion.div
                  key="step3"
                  variants={slideInRight}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 space-y-6"
                >
                  <h2 className="text-2xl font-headline font-bold text-neutral-100 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-primary-emerald" />
                    Secure Payment
                  </h2>

                  <div className="p-4 bg-primary-emerald/10 border border-primary-emerald/30 rounded-xl flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary-emerald" />
                    <p className="text-sm text-neutral-300">
                      Your payment is secured by Stripe with 256-bit encryption
                    </p>
                  </div>

                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#10b981',
                          colorBackground: '#1a1a2e',
                          colorText: '#ffffff',
                          colorDanger: '#ef4444',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          borderRadius: '12px',
                        },
                      },
                    }}
                  >
                    <CheckoutForm clientSecret={clientSecret} orderNumber={orderNumber} />
                  </Elements>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-24 p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-headline font-bold text-neutral-100">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.variant)}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-200 truncate">{item.name}</h4>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-emerald">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? <span className="text-primary-emerald">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-neutral-100 pt-3 border-t border-neutral-800">
                  <span>Total:</span>
                  <span className="text-gradient-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .text-gradient-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  )
}
