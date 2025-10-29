'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, Tag } from 'lucide-react'
import { fadeInUp, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'
import { useCartStore } from '@/lib/store'

interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    salePrice: number | null
    images: string[]
    category: string
    stock: number
    active: boolean
    badges: string[]
  }
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      const data = await response.json()

      if (response.ok) {
        setWishlist(data.wishlist)
      }
    } catch (error) {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }

      toast.success('Removed from wishlist')
      fetchWishlist()
    } catch (error) {
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.product.id,
      name: item.product.name,
      price: item.product.salePrice || item.product.price,
      image: item.product.images[0] || '',
      slug: item.product.slug,
    })
    toast.success(`${item.product.name} added to cart`)
  }

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
        <h1 className="text-3xl font-bold text-white mb-2">My Wishlist</h1>
        <p className="text-neutral-600">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </motion.div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-12 text-center"
        >
          <Heart className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-neutral-600 mb-6">
            Save products you love for later
          </p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl"
            >
              Browse Products
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item, index) => {
            const displayPrice = item.product.salePrice || item.product.price
            const hasDiscount = item.product.salePrice !== null

            return (
              <motion.div
                key={item.id}
                variants={staggerItem}
                custom={index}
                className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 overflow-hidden hover:border-primary-purple/50 transition-all group"
              >
                {/* Product Image */}
                <Link href={`/shop/${item.product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-darker-bg">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-16 h-16 text-neutral-600" />
                      </div>
                    )}

                    {/* Badges */}
                    {item.product.badges.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {item.product.badges.map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-1 bg-primary-purple/90 backdrop-blur-sm text-white text-xs font-bold rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stock Status */}
                    {item.product.stock === 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/shop/${item.product.slug}`}>
                    <h3 className="text-white font-semibold mb-2 hover:text-primary-emerald transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="text-sm text-neutral-600 mb-3 capitalize">
                    {item.product.category}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-white">
                      ${displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-neutral-600 line-through">
                        ${item.product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(item)}
                      disabled={item.product.stock === 0}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRemove(item.product.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Continue Shopping */}
      {wishlist.length > 0 && (
        <motion.div variants={fadeInUp} className="text-center">
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-dark-bg/80 border border-neutral-800 text-neutral-200 font-semibold rounded-xl hover:border-primary-emerald transition-colors"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
