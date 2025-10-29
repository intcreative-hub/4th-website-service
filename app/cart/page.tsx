'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Package,
  Tag,
  Truck,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { fadeInUp, staggerContainer, staggerItem, hoverScale, tapScale } from '@/lib/animations'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRemoveItem = (id: string, variant?: any) => {
    removeItem(id, variant)
    toast.success('Item removed from cart')
  }

  const handleUpdateQuantity = (id: string, quantity: number, variant?: any) => {
    if (quantity < 1) {
      handleRemoveItem(id, variant)
    } else {
      updateQuantity(id, quantity, variant)
    }
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
      toast.success('Cart cleared')
    }
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // Mock coupon validation
      if (couponCode.toLowerCase() === 'welcome10') {
        setAppliedCoupon(couponCode)
        toast.success('Coupon applied successfully!')
      } else {
        toast.error('Invalid coupon code')
      }
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  // Calculate totals
  const subtotal = mounted ? getTotal() : 0
  const discount = appliedCoupon ? subtotal * 0.1 : 0
  const shipping = subtotal > 50 ? 0 : 10
  const tax = (subtotal - discount) * 0.08 // 8% tax
  const total = subtotal - discount + shipping + tax

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg">
        <div className="container-width px-6 md:px-8 py-12">
          <div className="h-12 w-48 bg-neutral-900 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-900 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="h-96 bg-neutral-900 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/20 to-primary-emerald/20 animate-pulse" />
        </div>

        <div className="container-width px-6 md:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-purple/10 border border-primary-purple/30 rounded-full text-primary-purple text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{items.length} {items.length === 1 ? 'Item' : 'Items'} in Cart</span>
            </motion.div>

            <h1 className="font-headline text-5xl md:text-7xl font-bold text-neutral-100 mb-6">
              Your <span className="text-gradient-primary">Shopping Cart</span>
            </h1>

            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Review your items and proceed to checkout when ready
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container-width px-6 md:px-8">
          {items.length === 0 ? (
            // Empty Cart State
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-neutral-900 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-neutral-600" />
              </div>

              <h3 className="text-3xl font-headline font-bold text-neutral-300 mb-4">
                Your cart is empty
              </h3>

              <p className="text-neutral-500 text-lg mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start shopping to find amazing products!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => router.push('/shop')}
                  className="px-8 py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Products
                </motion.button>

                <motion.button
                  onClick={() => router.push('/')}
                  className="px-8 py-4 bg-neutral-900/50 border border-neutral-800 text-neutral-200 rounded-xl font-semibold hover:border-primary-emerald/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Cart Items Grid
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Back to Shop Link */}
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-emerald transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>

                {/* Items List */}
                <motion.div
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.variant ? JSON.stringify(item.variant) : ''}`}
                      variants={staggerItem}
                      className="flex flex-col sm:flex-row gap-4 p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 hover:border-primary-emerald/30 transition-all group"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/shop/${item.slug}`}
                        className="flex-shrink-0"
                      >
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          className="w-full sm:w-32 h-32 object-cover rounded-xl"
                          whileHover={{ scale: 1.05 }}
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/shop/${item.slug}`}>
                          <h3 className="text-xl font-semibold text-neutral-100 mb-2 hover:text-primary-emerald transition-colors">
                            {item.name}
                          </h3>
                        </Link>

                        {item.variant && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {Object.entries(item.variant)
                              .filter(([_, value]) => value)
                              .map(([key, value]) => (
                                <span
                                  key={key}
                                  className="px-3 py-1 bg-neutral-900/50 border border-neutral-800 rounded-lg text-xs text-neutral-400"
                                >
                                  {key}: {value}
                                </span>
                              ))}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 p-2 bg-neutral-900/50 border border-neutral-800 rounded-xl w-fit">
                            <motion.button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.variant)}
                              className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-primary-emerald transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-5 h-5" />
                            </motion.button>

                            <span className="w-12 text-center text-xl font-semibold text-neutral-200">
                              {item.quantity}
                            </span>

                            <motion.button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.variant)}
                              className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-primary-emerald transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-5 h-5" />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-neutral-500">${item.price.toFixed(2)} each</span>
                            <span className="text-2xl font-bold text-gradient-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => handleRemoveItem(item.id, item.variant)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Clear Cart Button */}
                <motion.button
                  onClick={handleClearCart}
                  className="w-full sm:w-auto px-6 py-3 text-red-400 border border-red-400/30 rounded-xl hover:bg-red-400/10 transition-all flex items-center justify-center gap-2 mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </motion.button>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  className="sticky top-24 p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-headline font-bold text-neutral-100">
                    Order Summary
                  </h2>

                  {/* Coupon Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        disabled={!!appliedCoupon}
                        className="flex-1 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all disabled:opacity-50"
                      />
                      <motion.button
                        onClick={handleApplyCoupon}
                        disabled={!!appliedCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-primary-purple text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply
                      </motion.button>
                    </div>
                    {appliedCoupon && (
                      <motion.p
                        className="text-sm text-primary-emerald flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        ✓ Coupon "{appliedCoupon}" applied!
                      </motion.p>
                    )}
                    <p className="text-xs text-neutral-500">Try: WELCOME10 for 10% off</p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 py-4 border-y border-neutral-800">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-primary-emerald">
                        <span>Discount (10%):</span>
                        <span className="font-semibold">-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-400">
                      <span>Shipping:</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-primary-emerald">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {subtotal > 0 && subtotal < 50 && (
                      <motion.p
                        className="text-xs text-neutral-500 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Truck className="w-4 h-4" />
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </motion.p>
                    )}

                    <div className="flex justify-between text-neutral-400">
                      <span>Tax (8%):</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center text-2xl">
                    <span className="font-bold text-neutral-200">Total:</span>
                    <span className="font-bold text-gradient-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold text-lg rounded-xl hover:shadow-xl hover:shadow-primary-emerald/50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Shield className="w-4 h-4 text-primary-emerald" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Truck className="w-4 h-4 text-primary-purple" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Package className="w-4 h-4 text-primary-emerald" />
                      <span>Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <ShoppingCart className="w-4 h-4 text-primary-purple" />
                      <span>Quality Assured</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

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
