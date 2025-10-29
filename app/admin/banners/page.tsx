'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Megaphone,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'

interface Banner {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'promo'
  link: string | null
  startDate: string
  endDate: string | null
  active: boolean
  createdAt: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'promo',
    link: '',
    startDate: '',
    endDate: '',
    active: true,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const response = await fetch('/api/admin/banners', {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setBanners(data.banners || [])
      } else {
        toast.error(data.error || 'Failed to fetch banners')
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      toast.error('Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        message: banner.message,
        type: banner.type,
        link: banner.link || '',
        startDate: banner.startDate.split('T')[0],
        endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
        active: banner.active,
      })
    } else {
      setEditingBanner(null)
      setFormData({
        title: '',
        message: '',
        type: 'info',
        link: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        active: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBanner(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.message) {
      toast.error('Title and message are required')
      return
    }

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      if (editingBanner) {
        // Update existing banner
        const response = await fetch(`/api/admin/banners/${editingBanner.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminPassword}`,
          },
          body: JSON.stringify({
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link || null,
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            active: formData.active,
          }),
        })

        if (response.ok) {
          toast.success('Banner updated successfully')
          fetchBanners()
          handleCloseModal()
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to update banner')
        }
      } else {
        // Create new banner
        const response = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminPassword}`,
          },
          body: JSON.stringify({
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link || null,
            startDate: formData.startDate,
            endDate: formData.endDate || null,
          }),
        })

        if (response.ok) {
          toast.success('Banner created successfully')
          fetchBanners()
          handleCloseModal()
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to create banner')
        }
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('Failed to save banner')
    }
  }

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      if (response.ok) {
        toast.success('Banner deleted successfully')
        fetchBanners()
      } else {
        toast.error('Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Failed to delete banner')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'success':
        return 'bg-primary-emerald/20 text-primary-emerald border-primary-emerald/30'
      case 'promo':
        return 'bg-primary-purple/20 text-primary-purple border-primary-purple/30'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
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
            Promo Banners
          </h1>
          <p className="text-neutral-400 mt-2">
            Manage promotional banners displayed across your site
          </p>
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </motion.button>
      </div>

      {/* Banners List */}
      {banners.length === 0 ? (
        <div className="text-center py-16 bg-dark-bg/50 rounded-2xl border border-neutral-800">
          <Megaphone className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-300 mb-2">No banners yet</h3>
          <p className="text-neutral-500 mb-6">
            Create your first promotional banner to engage visitors
          </p>
          <motion.button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create First Banner
          </motion.button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              variants={staggerItem}
              className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800 hover:border-primary-emerald/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(
                        banner.type
                      )}`}
                    >
                      {banner.type.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        banner.active
                          ? 'bg-primary-emerald/20 text-primary-emerald'
                          : 'bg-neutral-700 text-neutral-400'
                      }`}
                    >
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                    {banner.title}
                  </h3>
                  <p className="text-neutral-400 mb-4">{banner.message}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Start: {new Date(banner.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    {banner.endDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          End: {new Date(banner.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {banner.link && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-emerald hover:underline"
                        >
                          View Link
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleOpenModal(banner)}
                    className="p-2 bg-neutral-900/50 rounded-lg text-primary-purple hover:bg-primary-purple/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 bg-neutral-900/50 rounded-lg text-red-400 hover:bg-red-400/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
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
                  {editingBanner ? 'Edit Banner' : 'Create Banner'}
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Flash Sale!"
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g., Get 30% off all products this weekend only!"
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    required
                  />
                </div>

                {/* Type & Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Banner Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as 'info' | 'warning' | 'success' | 'promo',
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="promo">Promo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="/shop"
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 rounded border-neutral-800 bg-neutral-900/50 text-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                  />
                  <label htmlFor="active" className="text-sm text-neutral-300">
                    Active (show on website)
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
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
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
