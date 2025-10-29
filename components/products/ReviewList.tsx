'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ThumbsUp } from 'lucide-react'
import StarRating from './StarRating'
import { staggerItem } from '@/lib/animations'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
  }
}

interface ReviewStats {
  total: number
  averageRating: number
  distribution: {
    rating: number
    count: number
  }[]
}

interface ReviewListProps {
  productId: string
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}/reviews`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-12 text-center">
        <MessageCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No reviews yet
        </h3>
        <p className="text-neutral-600">
          Be the first to review this product!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-white mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={stats.averageRating} size={24} showNumber={false} />
            <p className="text-neutral-600 mt-2">
              Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const dist = stats.distribution.find((d) => d.rating === rating)
              const count = dist?.count || 0
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-neutral-400">{rating}</span>
                    <StarRating rating={1} maxRating={1} size={14} />
                  </div>
                  <div className="flex-1 h-2 bg-darker-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-neutral-600 w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            variants={staggerItem}
            custom={index}
            className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-purple to-primary-emerald flex items-center justify-center text-white font-bold">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {review.user.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} size={18} />
            </div>

            <p className="text-neutral-300 leading-relaxed">{review.comment}</p>

            {/* Optional: Helpful button */}
            {/* <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-800">
              <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-emerald transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful (0)</span>
              </button>
            </div> */}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
