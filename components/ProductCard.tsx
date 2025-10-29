'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { toast } from 'react-hot-toast'
import { scaleIn, hoverLift, tapScale } from '@/lib/animations'
import { useState } from 'react'

type ProductCardProps = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number | null
  images: string[]
  category: string
  featured?: boolean
  stock: number
}

export default function ProductCard({
  id,
  name,
  slug,
  description,
  price,
  salePrice,
  images,
  category,
  featured = false,
  stock
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isHovered, setIsHovered] = useState(false)

  const displayPrice = salePrice || price
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()

    addItem({
      id,
      name,
      price: displayPrice,
      image: images[0] || '/logo-placeholder.svg',
      slug
    })

    toast.success(`${name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    })
  }

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/shop/${slug}`}>
        <motion.div
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-bg/80 to-darker-bg/80 backdrop-blur-lg border border-neutral-800/50 hover:border-primary-emerald/50 transition-all duration-300"
          whileHover={{
            y: -5,
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
          }}
          whileTap={tapScale}
        >
          {/* Badge Section */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {featured && (
              <motion.div
                className="px-3 py-1 bg-gradient-to-r from-primary-purple to-primary-emerald rounded-full text-xs font-semibold text-white shadow-lg"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                ⭐ Featured
              </motion.div>
            )}
            {discount > 0 && (
              <motion.div
                className="px-3 py-1 bg-red-500 rounded-full text-xs font-semibold text-white shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              >
                -{discount}% OFF
              </motion.div>
            )}
            {stock === 0 && (
              <div className="px-3 py-1 bg-neutral-800 rounded-full text-xs font-semibold text-neutral-400">
                Out of Stock
              </div>
            )}
          </div>

          {/* Wishlist Icon (future feature) */}
          <motion.button
            className="absolute top-4 right-4 z-10 p-2 bg-dark-bg/80 backdrop-blur-sm rounded-full border border-neutral-800/50 hover:border-red-500/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toast('Wishlist feature coming soon!', { icon: '❤️' })
            }}
          >
            <Heart className="w-4 h-4 text-neutral-400 group-hover:text-red-500 transition-colors" />
          </motion.button>

          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden bg-neutral-900/50">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Product Image */}
            <motion.img
              src={images[0] || '/logo-placeholder.svg'}
              alt={name}
              className="w-full h-full object-cover"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Quick View Overlay */}
            <motion.div
              className="absolute inset-0 z-[2] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="flex gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.button
                  className="p-3 bg-dark-bg/90 backdrop-blur-sm rounded-full border border-primary-emerald/50 text-primary-emerald hover:bg-primary-emerald hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toast('Quick view coming soon!', { icon: '👀' })
                  }}
                >
                  <Eye className="w-5 h-5" />
                </motion.button>
                {stock > 0 && (
                  <motion.button
                    className="p-3 bg-primary-emerald/90 backdrop-blur-sm rounded-full border border-primary-emerald text-white hover:bg-primary-emerald hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleQuickAdd}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-5">
            {/* Category */}
            <div className="text-xs font-medium text-primary-emerald uppercase tracking-wider mb-2">
              {category}
            </div>

            {/* Title */}
            <h3 className="font-headline text-lg font-semibold text-neutral-200 mb-2 line-clamp-2 group-hover:text-primary-emerald transition-colors">
              {name}
            </h3>

            {/* Description */}
            <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
              {description}
            </p>

            {/* Price & Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                {salePrice ? (
                  <>
                    <span className="text-2xl font-bold text-primary-emerald">
                      ${salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-neutral-500 line-through">
                      ${price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-neutral-200">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button (Mobile) */}
              {stock > 0 && (
                <motion.button
                  className="md:hidden p-2 bg-primary-emerald rounded-lg text-white hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickAdd}
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Stock Indicator */}
            {stock > 0 && stock <= 5 && (
              <motion.div
                className="mt-3 text-xs text-yellow-500 font-medium"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Only {stock} left in stock!
              </motion.div>
            )}
          </div>

          {/* Animated Border Glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: isHovered ? 'shimmer 2s infinite' : 'none',
            }}
          />
        </motion.div>
      </Link>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </motion.div>
  )
}
