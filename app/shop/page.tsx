'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Search, Filter, X, ShoppingBag } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { PRODUCT_CATEGORIES } from '@/lib/config'

type Product = {
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
  active: boolean
  tags: string[]
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.products || [])
        setFilteredProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'featured') {
        filtered = filtered.filter((p) => p.featured)
      } else {
        filtered = filtered.filter((p) => p.category === selectedCategory)
      }
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, products])

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/20 to-primary-emerald/20 animate-pulse" />
        </div>

        <div className="container-width px-6 md:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-emerald/10 border border-primary-emerald/30 rounded-full text-primary-emerald text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Premium Products & Services</span>
            </motion.div>

            <h1 className="font-headline text-5xl md:text-7xl font-bold text-neutral-100 mb-6">
              Our{' '}
              <span className="text-gradient-primary">Shop</span>
            </h1>

            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Discover our curated collection of premium products and services designed to help your business thrive
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-neutral-800/50">
        <div className="container-width px-6 md:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <motion.div
              className="relative w-full md:w-96"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>

            {/* Category Pills */}
            <motion.div
              className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {PRODUCT_CATEGORIES.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white shadow-lg shadow-primary-emerald/30'
                      : 'bg-neutral-900/50 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-primary-emerald/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>

            {/* Filter Button (Mobile) */}
            <motion.button
              className="md:hidden flex items-center gap-2 px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 hover:border-primary-emerald/50 transition-all"
              onClick={() => setShowFilters(!showFilters)}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </motion.button>
          </div>

          {/* Results Count */}
          <motion.div
            className="mt-4 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              'Loading products...'
            ) : (
              <>
                Showing <span className="text-primary-emerald font-medium">{filteredProducts.length}</span> of{' '}
                <span className="text-neutral-400">{products.length}</span> products
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-width px-6 md:px-8">
          {loading ? (
            // Loading Skeletons
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="animate-pulse"
                >
                  <div className="aspect-square bg-neutral-900 rounded-2xl mb-4" />
                  <div className="h-4 bg-neutral-900 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-900 rounded w-1/2" />
                </motion.div>
              ))}
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            // Empty State
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-900 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-neutral-600" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-neutral-300 mb-2">
                No Products Found
              </h3>
              <p className="text-neutral-500 mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'No products match your filters. Try adjusting your selection.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="px-6 py-3 bg-primary-emerald text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            // Products Grid
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
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
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {!loading && filteredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-primary-purple/10 to-primary-emerald/10 border-y border-neutral-800/50">
          <motion.div
            className="container-width px-6 md:px-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
              We offer custom solutions tailored to your specific needs. Get in touch with us to discuss your requirements.
            </p>
            <motion.a
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </motion.div>
        </section>
      )}

      <style jsx global>{`
        .text-gradient-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  )
}
