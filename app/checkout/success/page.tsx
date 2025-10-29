'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  CheckCircle,
  Package,
  Mail,
  ArrowRight,
  Download,
  Home,
  ShoppingBag,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { fadeInUp, scaleInBounce, confetti, successCheckmark } from '@/lib/animations'

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    if (!orderNumber) {
      router.push('/shop')
      return
    }

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders?orderNumber=${orderNumber}`)
        const data = await response.json()

        if (data.order) {
          setOrder(data.order)
        } else {
          console.error('Order not found')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [orderNumber, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-900 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-neutral-600" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-neutral-300 mb-4">
            Order Not Found
          </h2>
          <p className="text-neutral-500 mb-6">
            We couldn't find your order. Please check your email for confirmation details.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg py-12 relative overflow-hidden">
      {/* Confetti Background Effect */}
      {showConfetti && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial="hidden"
          animate="visible"
          variants={confetti}
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#8b5cf6' : '#10b981',
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}

      <div className="container-width px-6 md:px-8 relative z-10">
        {/* Success Icon */}
        <motion.div
          className="text-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-emerald/20 to-primary-purple/20 rounded-full flex items-center justify-center relative"
            variants={scaleInBounce}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-emerald to-primary-purple rounded-full opacity-20 animate-pulse"
            />
            <CheckCircle className="w-20 h-20 text-primary-emerald relative z-10" />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-emerald/10 border border-primary-emerald/30 rounded-full text-primary-emerald text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Payment Successful!</span>
            </motion.div>

            <h1 className="font-headline text-5xl md:text-6xl font-bold text-neutral-100 mb-4">
              Thank You for <span className="text-gradient-primary">Your Order!</span>
            </h1>

            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-2">
              Your order has been confirmed and will be processed shortly
            </p>

            <p className="text-sm text-neutral-500">
              Order Number:{' '}
              <span className="font-mono font-semibold text-primary-emerald">
                {order.orderNumber}
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          className="max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 space-y-6">
            {/* Confirmation Message */}
            <div className="flex items-start gap-4 p-4 bg-primary-emerald/10 border border-primary-emerald/30 rounded-xl">
              <Mail className="w-6 h-6 text-primary-emerald flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-200 mb-1">
                  Confirmation Email Sent
                </h3>
                <p className="text-sm text-neutral-400">
                  We've sent a confirmation email to{' '}
                  <span className="font-semibold text-neutral-300">{order.customerEmail}</span> with
                  your order details and receipt.
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-xl font-headline font-bold text-neutral-100 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-purple" />
                Order Items
              </h3>

              <div className="space-y-3">
                {order.orderItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center p-4 bg-neutral-900/50 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div>
                      <h4 className="font-medium text-neutral-200">{item.name}</h4>
                      <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-primary-emerald">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-neutral-800">
              <div className="flex justify-between items-center text-2xl">
                <span className="font-bold text-neutral-200">Total Paid:</span>
                <span className="font-bold text-gradient-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* What's Next */}
            <div className="pt-6 border-t border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-200 mb-3">What happens next?</h3>
              <ul className="space-y-3">
                {[
                  {
                    step: '1',
                    text: 'We'll process your order and prepare it for shipment',
                  },
                  {
                    step: '2',
                    text: 'You'll receive a shipping confirmation email with tracking info',
                  },
                  {
                    step: '3',
                    text: 'Your order will be delivered to your address',
                  },
                ].map((item) => (
                  <motion.li
                    key={item.step}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + parseInt(item.step) * 0.1 }}
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-emerald/20 text-primary-emerald rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </span>
                    <span className="text-neutral-400 pt-0.5">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => router.push('/shop')}
            className="px-8 py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold text-lg rounded-xl hover:shadow-xl hover:shadow-primary-emerald/50 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </motion.button>

          <motion.button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-neutral-900/50 border border-neutral-800 text-neutral-200 rounded-xl font-semibold hover:border-primary-emerald/50 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>

          <motion.button
            onClick={() => window.print()}
            className="px-8 py-4 bg-neutral-900/50 border border-neutral-800 text-neutral-200 rounded-xl font-semibold hover:border-primary-purple/50 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Print Receipt
          </motion.button>
        </motion.div>

        {/* Customer Support */}
        <motion.div
          className="text-center mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-neutral-500 text-sm">
            Need help with your order?{' '}
            <Link href="/contact" className="text-primary-emerald hover:underline font-medium">
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        .text-gradient-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .print-section,
          .print-section * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
