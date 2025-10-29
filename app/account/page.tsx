'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ShoppingBag,
  MapPin,
  Heart,
  Star,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { fadeInUp, staggerItem } from '@/lib/animations'

interface UserData {
  id: string
  email: string
  name: string
  phone: string | null
  createdAt: string
  stats: {
    orders: number
    addresses: number
    wishlist: number
    reviews: number
  }
}

export default function AccountDashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (response.ok) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin" />
      </div>
    )
  }

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : ''

  const stats = [
    {
      label: 'Total Orders',
      value: user?.stats.orders || 0,
      icon: ShoppingBag,
      href: '/account/orders',
      color: 'from-primary-purple to-purple-600',
    },
    {
      label: 'Saved Addresses',
      value: user?.stats.addresses || 0,
      icon: MapPin,
      href: '/account/addresses',
      color: 'from-primary-emerald to-emerald-600',
    },
    {
      label: 'Wishlist Items',
      value: user?.stats.wishlist || 0,
      icon: Heart,
      href: '/account/wishlist',
      color: 'from-pink-500 to-rose-600',
    },
    {
      label: 'Reviews Written',
      value: user?.stats.reviews || 0,
      icon: Star,
      href: '#',
      color: 'from-amber-500 to-orange-600',
    },
  ]

  const quickActions = [
    {
      title: 'Continue Shopping',
      description: 'Browse our latest products',
      href: '/shop',
      icon: ShoppingBag,
    },
    {
      title: 'View Orders',
      description: 'Track your purchases',
      href: '/account/orders',
      icon: ShoppingBag,
    },
    {
      title: 'Manage Addresses',
      description: 'Update shipping information',
      href: '/account/addresses',
      icon: MapPin,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        variants={fadeInUp}
        className="bg-gradient-to-r from-primary-purple to-primary-emerald rounded-2xl p-8 text-white"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-white/80 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member since {memberSince}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              custom={index}
            >
              <Link href={stat.href}>
                <div className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6 hover:border-primary-purple/50 transition-all group cursor-pointer">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeInUp}
        className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link key={action.title} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-darker-bg rounded-xl p-6 border border-neutral-800 hover:border-primary-purple/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary-purple" />
                    <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-primary-emerald group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {action.description}
                  </p>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div
        variants={fadeInUp}
        className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          Account Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-neutral-600 block mb-1">
              Email Address
            </label>
            <div className="text-white font-medium">{user?.email}</div>
          </div>

          <div>
            <label className="text-sm text-neutral-600 block mb-1">
              Phone Number
            </label>
            <div className="text-white font-medium">
              {user?.phone || 'Not provided'}
            </div>
          </div>
        </div>

        <Link href="/account/profile">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Edit Profile
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
