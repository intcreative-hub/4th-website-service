'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  DollarSign,
  ShoppingCart,
  Calendar,
  Users,
  TrendingUp,
  Package,
  Mail,
  Eye,
  ArrowRight,
  Clock
} from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { format } from 'date-fns'

type Stats = {
  revenue: number
  orders: number
  appointments: number
  subscribers: number
  products: number
  blogPosts: number
}

type RecentOrder = {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

type RecentAppointment = {
  id: string
  customerName: string
  service: string
  date: string
  time: string
  status: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    revenue: 0,
    orders: 0,
    appointments: 0,
    subscribers: 0,
    products: 0,
    blogPosts: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

        // Fetch orders
        const ordersRes = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${adminPassword}` },
        })
        const ordersData = await ordersRes.json()
        const orders = ordersData.orders || []

        // Fetch appointments
        const appointmentsRes = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${adminPassword}` },
        })
        const appointmentsData = await appointmentsRes.json()
        const appointments = appointmentsData.appointments || []

        // Fetch newsletter subscribers
        const newsletterRes = await fetch('/api/newsletter', {
          headers: { Authorization: `Bearer ${adminPassword}` },
        })
        const newsletterData = await newsletterRes.json()
        const subscribers = newsletterData.subscribers || []

        // Fetch products
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        const products = productsData.products || []

        // Fetch blog posts
        const blogRes = await fetch('/api/blog')
        const blogData = await blogRes.json()
        const blogPosts = blogData.posts || []

        // Calculate stats
        const totalRevenue = orders.reduce((sum: number, order: any) => {
          if (order.paymentStatus === 'paid') {
            return sum + order.total
          }
          return sum
        }, 0)

        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          appointments: appointments.length,
          subscribers: subscribers.length,
          products: products.length,
          blogPosts: blogPosts.length,
        })

        // Set recent orders (last 5)
        setRecentOrders(orders.slice(0, 5))

        // Set recent appointments (last 5)
        setRecentAppointments(appointments.slice(0, 5))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'emerald',
      change: '+12.5%',
    },
    {
      title: 'Orders',
      value: stats.orders.toString(),
      icon: ShoppingCart,
      color: 'purple',
      change: '+8.2%',
    },
    {
      title: 'Appointments',
      value: stats.appointments.toString(),
      icon: Calendar,
      color: 'blue',
      change: '+15.3%',
    },
    {
      title: 'Subscribers',
      value: stats.subscribers.toString(),
      icon: Users,
      color: 'pink',
      change: '+23.1%',
    },
  ]

  const quickActions = [
    { label: 'Add Product', href: '/admin/products', icon: Package, color: 'emerald' },
    { label: 'View Orders', href: '/admin/orders', icon: ShoppingCart, color: 'purple' },
    { label: 'Manage Appointments', href: '/admin/appointments', icon: Calendar, color: 'blue' },
    { label: 'Write Blog Post', href: '/admin/blog', icon: Eye, color: 'pink' },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'confirmed':
        return 'text-emerald-400 bg-emerald-400/10'
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'processing':
        return 'text-blue-400 bg-blue-400/10'
      case 'cancelled':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-neutral-400 bg-neutral-400/10'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-neutral-100 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-neutral-400">
          Welcome back! Here's what's happening with your business today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={staggerItem}
            className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 hover:border-primary-emerald/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-neutral-500 mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-neutral-100">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-headline font-bold text-neutral-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-3 p-4 bg-neutral-900/50 rounded-xl hover:bg-neutral-900 transition-all group"
            >
              <div
                className={`w-12 h-12 bg-${action.color}-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-400`} />
              </div>
              <span className="text-sm font-medium text-neutral-300 text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-headline font-bold text-neutral-100">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary-emerald hover:text-primary-emerald/80 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl hover:bg-neutral-900 transition-all"
                >
                  <div>
                    <p className="font-semibold text-neutral-200 text-sm">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-neutral-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-emerald">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Appointments */}
        <motion.div
          className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-headline font-bold text-neutral-100">
              Upcoming Appointments
            </h2>
            <Link
              href="/admin/appointments"
              className="text-sm text-primary-purple hover:text-primary-purple/80 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No appointments scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-xl hover:bg-neutral-900 transition-all"
                >
                  <div className="w-12 h-12 bg-primary-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-200 text-sm truncate">
                      {appointment.customerName}
                    </p>
                    <p className="text-xs text-neutral-500">{appointment.service}</p>
                    <p className="text-xs text-neutral-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(appointment.date), 'MMM d')} at {appointment.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-primary-emerald" />
            <h3 className="text-lg font-semibold text-neutral-100">Products</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-100 mb-2">{stats.products}</p>
          <p className="text-sm text-neutral-500">Active products in your store</p>
        </div>

        <div className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-primary-purple" />
            <h3 className="text-lg font-semibold text-neutral-100">Blog Posts</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-100 mb-2">{stats.blogPosts}</p>
          <p className="text-sm text-neutral-500">Published articles</p>
        </div>
      </motion.div>
    </div>
  )
}
