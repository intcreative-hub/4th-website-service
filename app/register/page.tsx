'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      toast.success('Account created successfully!')
      router.push('/account')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
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
            Create Account
          </h1>
          <p className="text-neutral-600 text-lg">
            Join us and start shopping with exclusive benefits
          </p>
        </motion.div>

        {/* Register Form */}
        <motion.div
          variants={fadeInUp}
          className="max-w-md mx-auto bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-200 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

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

            {/* Phone (Optional) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-neutral-200 mb-2"
              >
                Phone Number <span className="text-neutral-600">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="(555) 123-4567"
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
                  placeholder="Min. 8 characters"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-600">
                Must include uppercase, lowercase, number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-200 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="Re-enter password"
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link href="/login">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-darker-bg border border-neutral-800 text-neutral-200 font-semibold py-3 rounded-xl hover:border-primary-emerald transition-colors"
            >
              Sign In Instead
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
