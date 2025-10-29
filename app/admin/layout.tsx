'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  BookOpen,
  Users,
  LogOut,
  Menu,
  X,
  Lock
} from 'lucide-react'
import { fadeInUp, slideInLeft } from '@/lib/animations'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: ShoppingBag, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { href: '/admin/contacts', icon: Users, label: 'Contacts' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      toast.success('Welcome to admin dashboard!')
    } else {
      toast.error('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    toast.success('Logged out successfully')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 shadow-2xl">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-purple/20 to-primary-emerald/20 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary-emerald" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-headline font-bold text-neutral-100 text-center mb-2">
              Admin Access
            </h1>
            <p className="text-neutral-400 text-center mb-8">
              Enter your password to continue
            </p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
              >
                Sign In
              </button>
            </form>

            <p className="text-xs text-neutral-500 text-center mt-6">
              Default password: <code className="text-neutral-400">admin123</code>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-dark-bg/80 backdrop-blur-lg rounded-xl border border-neutral-800 text-neutral-200"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 bg-darker-bg border-r border-neutral-800 z-40 ${
          isSidebarOpen ? 'block' : 'hidden lg:block'
        }`}
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
        transition={{ type: 'spring', damping: 20 }}
      >
            <div className="p-6 border-b border-neutral-800">
              <h2 className="text-2xl font-headline font-bold text-gradient-primary">
                Admin Panel
              </h2>
              <p className="text-sm text-neutral-500 mt-1">Manage your website</p>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-purple/20 to-primary-emerald/20 text-primary-emerald border border-primary-emerald/30'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>

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
