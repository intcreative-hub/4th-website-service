'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Calendar, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react'
import { fadeInUp, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  orderItems: {
    id: string
    name: string
    price: number
    quantity: number
    product: {
      name: string
      slug: string
      images: string[]
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/account/orders?status=${filter}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
      } else {
        toast.error('Failed to load orders')
      }
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'processing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-white mb-2">Order History</h1>
        <p className="text-neutral-600">View and track all your orders</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-wrap gap-3"
      >
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === f.value
                ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white'
                : 'bg-dark-bg/80 text-neutral-400 border border-neutral-800 hover:border-primary-purple/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-12 text-center"
        >
          <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No orders found
          </h3>
          <p className="text-neutral-600 mb-6">
            You haven't placed any orders yet
          </p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              variants={staggerItem}
              custom={index}
              className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6 hover:border-primary-purple/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Order #{order.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1">
                    ${order.total.toFixed(2)}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {order.orderItems.length} item(s)
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-neutral-800 pt-4 space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-darker-bg border border-neutral-800 overflow-hidden">
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/shop/${item.product.slug}`}
                        className="text-white hover:text-primary-emerald transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-neutral-600">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-white font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
