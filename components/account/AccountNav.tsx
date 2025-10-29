'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  User,
  Heart,
  LogOut,
} from 'lucide-react'
import { fadeInLeft, staggerItem } from '@/lib/animations'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const navItems = [
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
    label: 'Profile',
    href: '/account/profile',
    icon: User,
  },
  {
    label: 'Wishlist',
    href: '/account/wishlist',
    icon: Heart,
  },
]

export default function AccountNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      toast.success('Logged out successfully')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <motion.nav
      variants={fadeInLeft}
      initial="hidden"
      animate="visible"
      className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6 h-fit sticky top-24"
    >
      <h2 className="text-xl font-bold text-white mb-6">My Account</h2>

      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <motion.li key={item.href} variants={staggerItem}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-purple/20 to-primary-emerald/20 border border-primary-purple/50 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-darker-bg'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.li>
          )
        })}
      </ul>

      <div className="mt-6 pt-6 border-t border-neutral-800">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.nav>
  )
}
