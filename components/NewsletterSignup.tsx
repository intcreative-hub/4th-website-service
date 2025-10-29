'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react'
import { hoverScale, tapScale, scaleInBounce } from '@/lib/animations'
import toast from 'react-hot-toast'

type NewsletterSignupProps = {
  variant?: 'default' | 'compact' | 'inline'
  showIcon?: boolean
  placeholder?: string
  buttonText?: string
  className?: string
}

export default function NewsletterSignup({
  variant = 'default',
  showIcon = true,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSubscribed(true)
        setEmail('')
        toast.success('Successfully subscribed to our newsletter!')

        // Reset after 3 seconds
        setTimeout(() => {
          setSubscribed(false)
        }, 3000)
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Compact variant - single line form
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={loading || subscribed}
          className="flex-1 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={loading || subscribed}
          className="px-4 py-2 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-emerald/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
          whileHover={!loading && !subscribed ? hoverScale : {}}
          whileTap={!loading && !subscribed ? tapScale : {}}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : subscribed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Subscribed!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </motion.button>
      </form>
    )
  }

  // Inline variant - for embedding in content
  if (variant === 'inline') {
    return (
      <div className={`p-6 bg-gradient-to-r from-primary-purple/10 to-primary-emerald/10 border border-neutral-800/50 rounded-xl ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          {showIcon && (
            <div className="w-12 h-12 bg-primary-emerald/20 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary-emerald" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-neutral-100 mb-1">Stay Updated</h4>
            <p className="text-sm text-neutral-400">Get the latest updates in your inbox</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={loading || subscribed}
            className="flex-1 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={loading || subscribed}
            className="px-4 py-2 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-emerald/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={!loading && !subscribed ? hoverScale : {}}
            whileTap={!loading && !subscribed ? tapScale : {}}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : subscribed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </motion.button>
        </form>
      </div>
    )
  }

  // Default variant - full featured
  return (
    <motion.div
      className={`p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Icon */}
      {showIcon && (
        <motion.div
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-purple/20 to-primary-emerald/20 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <Mail className="w-8 h-8 text-primary-emerald" />
        </motion.div>
      )}

      {/* Heading */}
      <h3 className="text-2xl font-headline font-bold text-neutral-100 text-center mb-3">
        Subscribe to Our <span className="text-gradient-primary">Newsletter</span>
      </h3>

      <p className="text-neutral-400 text-center mb-6">
        Get the latest updates, exclusive content, and special offers delivered straight to your inbox
      </p>

      {/* Success State */}
      {subscribed ? (
        <motion.div
          className="text-center"
          variants={scaleInBounce}
          initial="hidden"
          animate="visible"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-primary-emerald/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary-emerald" />
          </div>
          <h4 className="text-xl font-semibold text-neutral-100 mb-2">You're Subscribed!</h4>
          <p className="text-neutral-400">Check your inbox for a confirmation email</p>
        </motion.div>
      ) : (
        <>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all disabled:opacity-50"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold text-lg rounded-xl hover:shadow-xl hover:shadow-primary-emerald/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              whileHover={!loading ? hoverScale : {}}
              whileTap={!loading ? tapScale : {}}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {buttonText}
                </>
              )}
            </motion.button>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-neutral-500 text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </>
      )}

      <style jsx global>{`
        .text-gradient-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </motion.div>
  )
}
