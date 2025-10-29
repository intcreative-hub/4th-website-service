'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, Check, X } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${adminPassword}` },
      })
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderNumber: string, status: string, paymentStatus?: string) => {
    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ orderNumber, status, paymentStatus }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Order updated!')
        fetchOrders()
      } else {
        toast.error(data.error || 'Failed to update order')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-emerald-400/10 text-emerald-400'
      case 'pending':
        return 'bg-yellow-400/10 text-yellow-400'
      case 'processing':
        return 'bg-blue-400/10 text-blue-400'
      default:
        return 'bg-neutral-400/10 text-neutral-400'
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    return order.status === filter || order.paymentStatus === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-100 mb-2">Orders</h1>
          <p className="text-neutral-400">Manage customer orders and fulfillment</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'processing', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <motion.div
        className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900/50 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/30">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-neutral-200">{order.orderNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-neutral-200">{order.customerName}</p>
                    <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary-emerald">${order.total.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
                      className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-400">
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => alert(`Order Items:\n${order.orderItems.map(i => `${i.name} x${i.quantity} - $${i.price}`).join('\n')}`)}
                      className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-primary-emerald"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
