'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { slideInDown, fadeIn, staggerContainer, staggerItem, hoverScale, tapScale } from '@/lib/animations'
import toast from 'react-hot-toast'

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { items, removeItem, updateQuantity, getItemCount, getTotal } = useCartStore()

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

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

  const handleViewCart = () => {
    setIsOpen(false)
    router.push('/cart')
  }

  const handleCheckout = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  const itemCount = mounted ? getItemCount() : 0
  const total = mounted ? getTotal() : 0

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary-purple text-primary-purple font-semibold text-sm transition-all duration-300 hover:bg-primary-purple hover:text-white hover:shadow-lg hover:shadow-primary-purple/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="hidden sm:inline">Cart</span>

        {/* Item Count Badge */}
        {mounted && itemCount > 0 && (
          <motion.span
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary-purple to-primary-emerald text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-dark-bg/95 backdrop-blur-xl rounded-2xl border border-neutral-800/50 shadow-2xl shadow-black/50 overflow-hidden z-50"
            variants={slideInDown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800/50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-emerald" />
                <h3 className="font-semibold text-lg text-neutral-100">
                  Shopping Cart
                  {mounted && itemCount > 0 && (
                    <span className="ml-2 text-sm text-neutral-500">({itemCount} items)</span>
                  )}
                </h3>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto">
              {!mounted ? (
                // Loading state
                <div className="p-4 space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 bg-neutral-900 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-900 rounded w-3/4" />
                        <div className="h-3 bg-neutral-900 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                // Empty State
                <motion.div
                  className="py-12 px-4 text-center"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-neutral-900 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-neutral-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-300 mb-2">Your cart is empty</h4>
                  <p className="text-sm text-neutral-500 mb-4">
                    Start adding some amazing products!
                  </p>
                  <motion.button
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/shop')
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-primary-purple to-primary-emerald text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Products
                  </motion.button>
                </motion.div>
              ) : (
                // Cart Items List
                <motion.div
                  className="p-4 space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.variant ? JSON.stringify(item.variant) : ''}`}
                      variants={staggerItem}
                      className="flex gap-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/30 hover:border-primary-emerald/30 transition-all group"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex-shrink-0"
                      >
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          whileHover={{ scale: 1.05 }}
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <h4 className="font-medium text-neutral-200 text-sm truncate hover:text-primary-emerald transition-colors">
                            {item.name}
                          </h4>
                        </Link>

                        {item.variant && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {Object.entries(item.variant)
                              .filter(([_, value]) => value)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(', ')}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-neutral-900 rounded-lg p-1">
                            <motion.button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.variant)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-primary-emerald transition-colors"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>

                            <span className="text-sm font-semibold text-neutral-200 w-6 text-center">
                              {item.quantity}
                            </span>

                            <motion.button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.variant)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-primary-emerald transition-colors"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <span className="text-sm font-bold text-primary-emerald">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => handleRemoveItem(item.id, item.variant)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {mounted && items.length > 0 && (
              <div className="p-4 border-t border-neutral-800/50 space-y-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-neutral-300">Subtotal:</span>
                  <span className="font-bold text-2xl text-gradient-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Shipping Notice */}
                <p className="text-xs text-neutral-500 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    onClick={handleViewCart}
                    className="px-4 py-3 bg-neutral-900/50 border border-neutral-800 text-neutral-200 rounded-xl font-medium hover:border-primary-emerald/50 hover:text-primary-emerald transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Cart
                  </motion.button>

                  <motion.button
                    onClick={handleCheckout}
                    className="px-4 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-emerald/50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
