'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Trash2, Filter, Star } from 'lucide-react'
import { fadeInUp, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'
import StarRating from '@/components/products/StarRating'

interface Review {
  id: string
  rating: number
  comment: string
  approved: boolean
  createdAt: string
  user: {
    name: string
    email: string
  }
  product: {
    name: string
    slug: string
    images: string[]
  }
}

interface Stats {
  pending: number
  approved: number
  total: number
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const adminPassword = prompt('Enter admin password:')

      const response = await fetch(`/api/admin/reviews?status=${filter}`, {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews')
      }

      setReviews(data.reviews)
      setStats(data.stats)
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const adminPassword = prompt('Enter admin password:')

      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ approved: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve review')
      }

      toast.success('Review approved')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to approve review')
    }
  }

  const handleReject = async (reviewId: string) => {
    try {
      const adminPassword = prompt('Enter admin password:')

      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ approved: false }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject review')
      }

      toast.success('Review rejected')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to reject review')
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const adminPassword = prompt('Enter admin password:')

      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete review')
      }

      toast.success('Review deleted')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-white mb-2">Review Moderation</h1>
        <p className="text-neutral-600">Manage customer product reviews</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6">
          <div className="text-sm text-neutral-600 mb-1">Pending Approval</div>
          <div className="text-3xl font-bold text-amber-400">{stats.pending}</div>
        </div>
        <div className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6">
          <div className="text-sm text-neutral-600 mb-1">Approved</div>
          <div className="text-3xl font-bold text-emerald-400">{stats.approved}</div>
        </div>
        <div className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6">
          <div className="text-sm text-neutral-600 mb-1">Total Reviews</div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
        {[
          { label: 'Pending', value: 'pending' as const },
          { label: 'Approved', value: 'approved' as const },
          { label: 'All Reviews', value: 'all' as const },
        ].map((f) => (
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

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-12 text-center"
        >
          <Filter className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No reviews to show
          </h3>
          <p className="text-neutral-600">
            {filter === 'pending' && 'No reviews awaiting approval'}
            {filter === 'approved' && 'No approved reviews yet'}
            {filter === 'all' && 'No reviews submitted yet'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              variants={staggerItem}
              custom={index}
              className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full md:w-32 h-32 rounded-xl bg-darker-bg overflow-hidden flex-shrink-0">
                  {review.product.images[0] && (
                    <img
                      src={review.product.images[0]}
                      alt={review.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  {/* Product Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {review.product.name}
                    </h3>
                    <StarRating rating={review.rating} size={18} />
                  </div>

                  {/* Review Text */}
                  <p className="text-neutral-300 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                    <div>
                      <span className="font-medium text-white">{review.user.name}</span>
                      {' • '}
                      {review.user.email}
                    </div>
                    <div>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.approved
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  {!review.approved && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="hidden md:inline">Approve</span>
                    </motion.button>
                  )}

                  {review.approved && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span className="hidden md:inline">Unapprove</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="hidden md:inline">Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
