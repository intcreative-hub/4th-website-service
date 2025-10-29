'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import StarRating from './StarRating'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  productId: string
  productName: string
  onSuccess?: () => void
}

export default function ReviewForm({
  productId,
  productName,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      toast.success('Review submitted! It will appear after approval.')
      setRating(0)
      setComment('')

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      if (error.message.includes('already reviewed')) {
        toast.error('You have already reviewed this product')
      } else if (error.message.includes('Authentication required')) {
        toast.error('Please sign in to leave a review')
      } else {
        toast.error(error.message || 'Failed to submit review')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            Your Rating
          </label>
          <StarRating
            rating={rating}
            interactive
            onRatingChange={setRating}
            size={32}
          />
          {rating > 0 && (
            <p className="text-sm text-neutral-600 mt-1">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-neutral-200 mb-2"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors resize-none"
            placeholder={`Share your thoughts about ${productName}...`}
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-neutral-600">Minimum 10 characters</p>
            <p className="text-xs text-neutral-600">
              {comment.length}/500
            </p>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || rating === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Review
            </>
          )}
        </motion.button>

        <p className="text-xs text-neutral-600 text-center">
          Your review will be visible after admin approval
        </p>
      </form>
    </motion.div>
  )
}
