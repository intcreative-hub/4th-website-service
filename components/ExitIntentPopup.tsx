'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState('')
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if popup has been shown before
    const popupShown = localStorage.getItem('exitPopupShown')
    const lastShown = localStorage.getItem('exitPopupLastShown')

    if (popupShown === 'true' && lastShown) {
      const daysSinceShown = Math.floor(
        (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24)
      )
      // Only show once per 7 days
      if (daysSinceShown < 7) {
        setHasShown(true)
        return
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect mouse leaving from top of viewport
      if (e.clientY <= 0 && !hasShown && !showPopup) {
        setShowPopup(true)
        setHasShown(true)
        localStorage.setItem('exitPopupShown', 'true')
        localStorage.setItem('exitPopupLastShown', Date.now().toString())
      }
    }

    // Add event listener after 5 seconds (avoid showing immediately)
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hasShown, showPopup])

  const handleClose = () => {
    setShowPopup(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email')
      return
    }

    // Here you would typically send the email to your backend/newsletter service
    try {
      // Placeholder - integrate with your email service
      toast.success('Thank you! Check your email for your discount code.')
      setShowPopup(false)
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[9999]"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="relative bg-gradient-to-br from-dark-bg via-darker-bg to-dark-bg border-2 border-primary-emerald/30 rounded-2xl shadow-2xl shadow-primary-emerald/20 p-8 mx-4">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-neutral-900/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-purple/20 to-primary-emerald/20 rounded-full flex items-center justify-center">
                  <Gift className="w-10 h-10 text-primary-emerald" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-headline font-bold text-neutral-100 mb-3">
                  Wait! Don't Leave Yet!
                </h2>
                <p className="text-lg text-neutral-300 mb-2">
                  Get <span className="text-primary-emerald font-bold">15% OFF</span> your first order
                </p>
                <p className="text-sm text-neutral-500">
                  Join our community and be the first to know about new products and exclusive deals
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Claim My 15% Discount
                </motion.button>
              </form>

              {/* Fine Print */}
              <p className="text-xs text-neutral-600 text-center mt-4">
                By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
              </p>

              {/* Decorative Elements */}
              <div className="absolute -top-1 -right-1 w-20 h-20 bg-primary-emerald/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-1 -left-1 w-20 h-20 bg-primary-purple/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
