'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  showNumber?: boolean
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
  showNumber = false,
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            className={`${
              interactive
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default'
            }`}
          >
            {isPartial ? (
              <div className="relative" style={{ width: size, height: size }}>
                <Star
                  size={size}
                  className="absolute text-neutral-600"
                  fill="none"
                />
                <div
                  className="absolute overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    size={size}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                </div>
              </div>
            ) : (
              <Star
                size={size}
                className={
                  isFilled ? 'text-amber-400' : 'text-neutral-600'
                }
                fill={isFilled ? 'currentColor' : 'none'}
              />
            )}
          </motion.button>
        )
      })}
      {showNumber && (
        <span className="text-sm text-neutral-400 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
