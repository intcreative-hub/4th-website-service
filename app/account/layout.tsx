'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AccountNav from '@/components/account/AccountNav'
import { staggerContainer } from '@/lib/animations'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')

        if (!response.ok) {
          // Not authenticated, redirect to login
          router.push('/login')
          return
        }

        setLoading(false)
      } catch (error) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-darker-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-darker-bg py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <AccountNav />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}
