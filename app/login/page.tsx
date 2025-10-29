'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      toast.success('Welcome back!')
      router.push('/account')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-darker-bg py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome Back
          </h1>
          <p className="text-neutral-600 text-lg">
            Sign in to your account to continue
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          variants={fadeInUp}
          className="max-w-md mx-auto bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-200 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-200 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-bg text-neutral-600">
                New customer?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link href="/register">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-darker-bg border border-neutral-800 text-neutral-200 font-semibold py-3 rounded-xl hover:border-primary-emerald transition-colors"
            >
              Create Account
            </motion.button>
          </Link>

          {/* Back to Shop */}
          <div className="mt-6 text-center">
            <Link
              href="/shop"
              className="text-sm text-neutral-600 hover:text-primary-emerald transition-colors"
            >
              Continue as guest →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
