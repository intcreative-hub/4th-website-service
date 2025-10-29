'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LayoutDashboard, ShoppingBag, MapPin, Heart, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface UserData {
  name: string
  email: string
}

export default function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      // User not logged in
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-darker-bg border border-neutral-800 animate-pulse" />
    )
  }

  // If not logged in, show login button
  if (!user) {
    return (
      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <User size={16} />
          <span className="hidden lg:inline">Sign In</span>
        </motion.button>
      </Link>
    )
  }

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/account',
      icon: LayoutDashboard,
    },
    {
      label: 'Orders',
      href: '/account/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Addresses',
      href: '/account/addresses',
      icon: MapPin,
    },
    {
      label: 'Wishlist',
      href: '/account/wishlist',
      icon: Heart,
    },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-primary-purple to-primary-emerald hover:shadow-lg transition-all"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <span className="hidden lg:inline text-white font-medium text-sm">
          {user.name.split(' ')[0]}
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 bg-dark-bg/95 backdrop-blur-lg rounded-2xl border border-neutral-800/50 shadow-2xl overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-neutral-800">
              <div className="font-semibold text-white">{user.name}</div>
              <div className="text-sm text-neutral-600 truncate">{user.email}</div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                      className="flex items-center gap-3 px-4 py-3 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Logout */}
            <div className="border-t border-neutral-800 p-2">
              <motion.button
                onClick={handleLogout}
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
