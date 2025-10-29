'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { useCartStore } from '@/lib/store'
import { fadeInUp, staggerContainer, staggerItem, hoverScale, tapScale, hoverLift } from '@/lib/animations'
import toast from 'react-hot-toast'

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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addItem } = useCartStore()

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?slug=${slug}`)
        const data = await response.json()

        if (data.product) {
          setProduct(data.product)

          // Fetch related products (same category)
          if (data.product.category) {
            const relatedResponse = await fetch(`/api/products?category=${data.product.category}&limit=4`)
            const relatedData = await relatedResponse.json()
            // Filter out current product
            const filtered = (relatedData.products || []).filter((p: Product) => p.id !== data.product.id)
            setRelatedProducts(filtered.slice(0, 4))
          }
        } else {
          toast.error('Product not found')
          router.push('/shop')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug, router])

  const handleAddToCart = async () => {
    if (!product) return

    setAddingToCart(true)

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0],
        slug: product.slug,
      })

      toast.success(
        <div>
          <strong>{product.name}</strong> added to cart!
        </div>,
        {
          duration: 3000,
          icon: '🛒',
        }
      )
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    })
  }

  const displayPrice = product?.salePrice || product?.price || 0
  const originalPrice = product?.price || 0
  const discount = product?.salePrice
    ? Math.round(((originalPrice - product.salePrice) / originalPrice) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg">
        {/* Breadcrumb Skeleton */}
        <div className="container-width px-6 md:px-8 pt-8">
          <div className="h-6 w-48 bg-neutral-900 rounded animate-pulse" />
        </div>

        {/* Product Skeleton */}
        <div className="container-width px-6 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-neutral-900 rounded-2xl animate-pulse" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-neutral-900 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-neutral-900 rounded animate-pulse" />
              <div className="h-8 w-1/3 bg-neutral-900 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-neutral-900 rounded animate-pulse" />
                <div className="h-4 bg-neutral-900 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-neutral-900 rounded animate-pulse" />
              </div>
              <div className="h-16 bg-neutral-900 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg">
      {/* Breadcrumbs */}
      <motion.div
        className="container-width px-6 md:px-8 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/shop" className="hover:text-primary-emerald transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
          <span>/</span>
          <span className="text-neutral-400">{product.category}</span>
          <span>/</span>
          <span className="text-neutral-300">{product.name}</span>
        </div>
      </motion.div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container-width px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Main Image */}
              <motion.div
                className="relative aspect-square bg-neutral-900/50 rounded-2xl overflow-hidden group"
                layoutId={`product-image-${product.id}`}
              >
                <motion.img
                  src={product.images[selectedImage] || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <span className="px-3 py-1 bg-primary-purple text-white text-xs font-bold rounded-full">
                      FEATURED
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="px-3 py-1 bg-neutral-800 text-neutral-400 text-xs font-bold rounded-full">
                      OUT OF STOCK
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                      ONLY {product.stock} LEFT
                    </span>
                  )}
                </div>

                {/* Wishlist */}
                <motion.button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 w-10 h-10 bg-dark-bg/80 backdrop-blur-lg rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`}
                  />
                </motion.button>
              </motion.div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-emerald shadow-lg shadow-primary-emerald/30'
                          : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <motion.span
                className="inline-block px-4 py-2 bg-primary-emerald/10 border border-primary-emerald/30 rounded-full text-primary-emerald text-sm font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                {product.category}
              </motion.span>

              {/* Title */}
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-neutral-100">
                {product.name}
              </h1>

              {/* Rating (placeholder) */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-neutral-500">(128 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-primary">
                  ${displayPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="text-2xl text-neutral-500 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-lg text-neutral-400 leading-relaxed">
                {product.description}
              </p>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-900/50 border border-neutral-800 rounded-lg text-sm text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-5 h-5 text-primary-emerald" />
                <span className="text-neutral-400">
                  {product.stock > 0 ? (
                    <>In Stock: <span className="text-primary-emerald font-semibold">{product.stock} available</span></>
                  ) : (
                    <span className="text-red-400">Out of Stock</span>
                  )}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-300">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 p-2 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                    <motion.button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-primary-emerald disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>

                    <span className="w-12 text-center text-xl font-semibold text-neutral-200">
                      {quantity}
                    </span>

                    <motion.button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-primary-emerald disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <span className="text-sm text-neutral-500">
                    Total: <span className="text-primary-emerald font-bold text-lg">${(displayPrice * quantity).toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold text-lg rounded-xl hover:shadow-xl hover:shadow-primary-emerald/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
                whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </motion.button>

              {/* Features */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-neutral-800"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={staggerItem} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 bg-primary-emerald/10 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary-emerald" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-300">Free Shipping</div>
                    <div className="text-neutral-500">On orders over $50</div>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 bg-primary-purple/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-purple" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-300">Secure Payment</div>
                    <div className="text-neutral-500">100% protected</div>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 bg-primary-emerald/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-emerald" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-300">Easy Returns</div>
                    <div className="text-neutral-500">30-day guarantee</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary-purple/5 to-primary-emerald/5 border-y border-neutral-800/50">
          <div className="container-width px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
                Related <span className="text-gradient-primary">Products</span>
              </h2>
              <p className="text-neutral-400 text-lg">
                You might also like these products from the same category
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  slug={relatedProduct.slug}
                  description={relatedProduct.description}
                  price={relatedProduct.price}
                  salePrice={relatedProduct.salePrice}
                  images={relatedProduct.images}
                  category={relatedProduct.category}
                  featured={relatedProduct.featured}
                  stock={relatedProduct.stock}
                />
              ))}
            </motion.div>
          </div>
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
