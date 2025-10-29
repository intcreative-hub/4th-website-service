'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Ticket,
  Percent,
  DollarSign,
  Calendar,
  Users,
} from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'

interface Coupon {
  id: string
  code: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minPurchase: number | null
  maxUses: number | null
  uses: number
  expiresAt: string | null
  active: boolean
  createdAt: string
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: '',
    minPurchase: '',
    maxUses: '',
    expiresAt: '',
    active: true,
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const response = await fetch('/api/admin/coupons', {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setCoupons(data.coupons || [])
      } else {
        toast.error(data.error || 'Failed to fetch coupons')
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error('Failed to fetch coupons')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minPurchase: coupon.minPurchase?.toString() || '',
        maxUses: coupon.maxUses?.toString() || '',
        expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
        active: coupon.active,
      })
    } else {
      setEditingCoupon(null)
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minPurchase: '',
        maxUses: '',
        expiresAt: '',
        active: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCoupon(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || !formData.discountValue) {
      toast.error('Code and discount value are required')
      return
    }

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      if (editingCoupon) {
        // Update existing coupon
        const response = await fetch(`/api/admin/coupons/${editingCoupon.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminPassword}`,
          },
          body: JSON.stringify({
            code: formData.code,
            discountType: formData.discountType,
            discountValue: formData.discountValue,
            minPurchase: formData.minPurchase || null,
            maxUses: formData.maxUses || null,
            expiresAt: formData.expiresAt || null,
            active: formData.active,
          }),
        })

        if (response.ok) {
          toast.success('Coupon updated successfully')
          fetchCoupons()
          handleCloseModal()
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to update coupon')
        }
      } else {
        // Create new coupon
        const response = await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminPassword}`,
          },
          body: JSON.stringify({
            code: formData.code,
            discountType: formData.discountType,
            discountValue: formData.discountValue,
            minPurchase: formData.minPurchase || null,
            maxUses: formData.maxUses || null,
            expiresAt: formData.expiresAt || null,
          }),
        })

        if (response.ok) {
          toast.success('Coupon created successfully')
          fetchCoupons()
          handleCloseModal()
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to create coupon')
        }
      }
    } catch (error) {
      console.error('Error saving coupon:', error)
      toast.error('Failed to save coupon')
    }
  }

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) {
      return
    }

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      if (response.ok) {
        toast.success('Coupon deleted successfully')
        fetchCoupons()
      } else {
        toast.error('Failed to delete coupon')
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast.error('Failed to delete coupon')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-100">
            Coupon Codes
          </h1>
          <p className="text-neutral-400 mt-2">
            Create and manage discount coupons for your store
          </p>
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Coupon
        </motion.button>
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="text-center py-16 bg-dark-bg/50 rounded-2xl border border-neutral-800">
          <Ticket className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-300 mb-2">No coupons yet</h3>
          <p className="text-neutral-500 mb-6">
            Create your first coupon to offer discounts to customers
          </p>
          <motion.button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create First Coupon
          </motion.button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {coupons.map((coupon) => {
            const isExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt)
            const isMaxedOut = coupon.maxUses && coupon.uses >= coupon.maxUses

            return (
              <motion.div
                key={coupon.id}
                variants={staggerItem}
                className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800 hover:border-primary-emerald/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          coupon.active && !isExpired && !isMaxedOut
                            ? 'bg-primary-emerald/20 text-primary-emerald'
                            : 'bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        {isExpired
                          ? 'Expired'
                          : isMaxedOut
                          ? 'Max Uses Reached'
                          : coupon.active
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                      {coupon.discountType === 'PERCENTAGE' ? (
                        <Percent className="w-4 h-4 text-primary-purple" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-primary-emerald" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold font-mono text-neutral-100 mb-1">
                      {coupon.code}
                    </h3>
                    <p className="text-primary-emerald font-semibold">
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue}% OFF`
                        : `$${coupon.discountValue.toFixed(2)} OFF`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleOpenModal(coupon)}
                      className="p-2 bg-neutral-900/50 rounded-lg text-primary-purple hover:bg-primary-purple/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 bg-neutral-900/50 rounded-lg text-red-400 hover:bg-red-400/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-400">
                  {coupon.minPurchase && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Min. purchase: ${coupon.minPurchase.toFixed(2)}</span>
                    </div>
                  )}
                  {coupon.maxUses && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        Used: {coupon.uses} / {coupon.maxUses}
                      </span>
                    </div>
                  )}
                  {coupon.expiresAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-dark-bg border border-neutral-800 rounded-2xl shadow-2xl z-50 p-8"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold text-neutral-100">
                  {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-neutral-900/50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., SAVE20"
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 font-mono"
                    required
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountType: e.target.value as 'PERCENTAGE' | 'FIXED',
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({ ...formData, discountValue: e.target.value })
                      }
                      placeholder={formData.discountType === 'PERCENTAGE' ? '20' : '10.00'}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                      required
                    />
                  </div>
                </div>

                {/* Min Purchase & Max Uses */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Minimum Purchase (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minPurchase}
                      onChange={(e) =>
                        setFormData({ ...formData, minPurchase: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Max Uses (Optional)
                    </label>
                    <input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) =>
                        setFormData({ ...formData, maxUses: e.target.value })
                      }
                      placeholder="Unlimited"
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    />
                  </div>
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-neutral-800 bg-neutral-900/50 text-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                  />
                  <label htmlFor="active" className="text-sm text-neutral-300">
                    Active (customers can use this coupon)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-neutral-900/50 border border-neutral-800 text-neutral-300 font-semibold rounded-xl hover:bg-neutral-900 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-5 h-5" />
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
