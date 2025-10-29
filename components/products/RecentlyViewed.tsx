'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  images: string[]
  category: string
  stock: number
  featured: boolean
}

interface RecentlyViewedProps {
  currentProductId?: string
}

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentlyViewed()
  }, [currentProductId])

  const fetchRecentlyViewed = async () => {
    try {
      // Get recently viewed product IDs from localStorage
      const recentlyViewedStr = localStorage.getItem('recentlyViewed')
      if (!recentlyViewedStr) {
        setLoading(false)
        return
      }

      const recentlyViewedIds: string[] = JSON.parse(recentlyViewedStr)

      // Filter out current product
      const filteredIds = recentlyViewedIds.filter(id => id !== currentProductId)

      if (filteredIds.length === 0) {
        setLoading(false)
        return
      }

      // Fetch product details for recently viewed items
      const productPromises = filteredIds.slice(0, 4).map(async (id) => {
        const response = await fetch(`/api/products?id=${id}`)
        const data = await response.json()
        return data.product
      })

      const fetchedProducts = await Promise.all(productPromises)
      setProducts(fetchedProducts.filter(Boolean))
    } catch (error) {
      console.error('Error fetching recently viewed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 border-t border-neutral-800/50">
      <div className="container-width px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <Eye className="w-6 h-6 text-primary-emerald" />
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-neutral-100">
            Recently <span className="text-gradient-primary">Viewed</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                description={product.description}
                price={product.price}
                salePrice={product.salePrice}
                images={product.images}
                category={product.category}
                featured={product.featured}
                stock={product.stock}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Helper function to track viewed products
export function trackProductView(productId: string) {
  try {
    const recentlyViewedStr = localStorage.getItem('recentlyViewed')
    let recentlyViewed: string[] = recentlyViewedStr
      ? JSON.parse(recentlyViewedStr)
      : []

    // Remove if already exists (to move it to front)
    recentlyViewed = recentlyViewed.filter((id) => id !== productId)

    // Add to front
    recentlyViewed.unshift(productId)

    // Keep only last 10
    recentlyViewed = recentlyViewed.slice(0, 10)

    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed))
  } catch (error) {
    console.error('Error tracking product view:', error)
  }
}
