'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'

interface AnalyticsData {
  revenue: {
    total: number
    byStatus: {
      completed: number
      pending: number
      cancelled: number
    }
    dailyTrends: Array<{ date: string; revenue: number }>
  }
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
    averageOrderValue: number
  }
  topProducts: Array<{
    id: string
    name: string
    quantity: number
    revenue: number
  }>
  customers: {
    total: number
    new: number
    growth: Array<{ date: string; total: number }>
  }
  inventory: {
    totalProducts: number
    outOfStock: number
    lowStock: Array<{
      id: string
      name: string
      stock: number
      price: number
    }>
  }
  categories: Array<{
    category: string
    productCount: number
  }>
  recentActivity: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    customer: {
      name: string
      email: string
    }
  }>
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [exportLoading, setExportLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const response = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setAnalytics(data.analytics)
      } else {
        toast.error(data.error || 'Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string) => {
    try {
      setExportLoading(type)
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const response = await fetch(`/api/admin/analytics/export?type=${type}`, {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`${type} data exported successfully`)
      } else {
        toast.error('Failed to export data')
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    } finally {
      setExportLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-400">Failed to load analytics data</p>
      </div>
    )
  }

  // Prepare chart data
  const orderStatusData = [
    { name: 'Completed', value: analytics.orders.completed, color: COLORS[1] },
    { name: 'Pending', value: analytics.orders.pending, color: COLORS[2] },
    { name: 'Cancelled', value: analytics.orders.cancelled, color: COLORS[3] },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-100">
            Analytics Dashboard
          </h1>
          <p className="text-neutral-400 mt-2">
            Track your business performance and insights
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-neutral-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-primary-emerald"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Total Revenue */}
        <motion.div
          variants={staggerItem}
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800 hover:border-primary-emerald/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-emerald/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-emerald" />
            </div>
            <TrendingUp className="w-5 h-5 text-primary-emerald" />
          </div>
          <h3 className="text-3xl font-bold text-neutral-100 mb-1">
            ${analytics.revenue.total.toFixed(2)}
          </h3>
          <p className="text-sm text-neutral-500">Total Revenue</p>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          variants={staggerItem}
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800 hover:border-primary-purple/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-purple/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary-purple" />
            </div>
            <span className="text-xs text-neutral-500">
              Avg: ${analytics.orders.averageOrderValue.toFixed(2)}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-neutral-100 mb-1">
            {analytics.orders.total}
          </h3>
          <p className="text-sm text-neutral-500">Total Orders</p>
        </motion.div>

        {/* Total Customers */}
        <motion.div
          variants={staggerItem}
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800 hover:border-primary-emerald/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-emerald/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-emerald" />
            </div>
            <span className="text-xs text-primary-emerald">+{analytics.customers.new} new</span>
          </div>
          <h3 className="text-3xl font-bold text-neutral-100 mb-1">
            {analytics.customers.total}
          </h3>
          <p className="text-sm text-neutral-500">Total Customers</p>
        </motion.div>

        {/* Products */}
        <motion.div
          variants={staggerItem}
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800 hover:border-orange-500/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
            {analytics.inventory.outOfStock > 0 && (
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            )}
          </div>
          <h3 className="text-3xl font-bold text-neutral-100 mb-1">
            {analytics.inventory.totalProducts}
          </h3>
          <p className="text-sm text-neutral-500">
            {analytics.inventory.outOfStock} out of stock
          </p>
        </motion.div>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends */}
        <motion.div
          className="lg:col-span-2 p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800"
          variants={fadeInUp}
        >
          <h3 className="text-xl font-semibold text-neutral-100 mb-6">
            Revenue Trends (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenue.dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800"
          variants={fadeInUp}
        >
          <h3 className="text-xl font-semibold text-neutral-100 mb-6">
            Order Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-100">
              Top Products
            </h3>
            <button
              onClick={() => handleExport('products')}
              disabled={exportLoading === 'products'}
              className="flex items-center gap-2 px-4 py-2 bg-primary-emerald/10 border border-primary-emerald/30 rounded-lg text-primary-emerald hover:bg-primary-emerald/20 transition-colors disabled:opacity-50"
            >
              {exportLoading === 'products' ? (
                <div className="w-4 h-4 border-2 border-primary-emerald border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topProducts.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue']
                  return [value, 'Quantity']
                }}
              />
              <Legend />
              <Bar dataKey="quantity" fill="#8b5cf6" name="Quantity" />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Growth */}
        <motion.div
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-100">
              Customer Growth
            </h3>
            <button
              onClick={() => handleExport('customers')}
              disabled={exportLoading === 'customers'}
              className="flex items-center gap-2 px-4 py-2 bg-primary-purple/10 border border-primary-purple/30 rounded-lg text-primary-purple hover:bg-primary-purple/20 transition-colors disabled:opacity-50"
            >
              {exportLoading === 'customers' ? (
                <div className="w-4 h-4 border-2 border-primary-purple border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.customers.growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Low Stock Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <motion.div
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-semibold text-neutral-100">
              Low Stock Alerts
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.inventory.lowStock.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">
                All products are well stocked
              </p>
            ) : (
              analytics.inventory.lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl border border-neutral-800"
                >
                  <div>
                    <p className="font-semibold text-neutral-200">{product.name}</p>
                    <p className="text-sm text-neutral-500">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg font-semibold ${
                      product.stock === 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-100">
              Recent Orders
            </h3>
            <button
              onClick={() => handleExport('orders')}
              disabled={exportLoading === 'orders'}
              className="flex items-center gap-2 px-4 py-2 bg-primary-emerald/10 border border-primary-emerald/30 rounded-lg text-primary-emerald hover:bg-primary-emerald/20 transition-colors disabled:opacity-50"
            >
              {exportLoading === 'orders' ? (
                <div className="w-4 h-4 border-2 border-primary-emerald border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export
            </button>
          </div>
          <div className="space-y-3">
            {analytics.recentActivity.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl border border-neutral-800"
              >
                <div>
                  <p className="font-semibold text-neutral-200">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-emerald">
                    ${order.total.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      order.status === 'delivered' || order.status === 'completed'
                        ? 'bg-primary-emerald/20 text-primary-emerald'
                        : order.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Export All Button */}
      <motion.div
        className="flex items-center justify-center pt-6"
        variants={fadeInUp}
      >
        <button
          onClick={() => handleExport('revenue')}
          disabled={exportLoading === 'revenue'}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all disabled:opacity-50"
        >
          {exportLoading === 'revenue' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          Export Revenue Report
        </button>
      </motion.div>
    </div>
  )
}
