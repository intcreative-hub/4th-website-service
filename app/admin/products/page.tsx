'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Save,
  Package2
} from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem, modalBackdrop, modalContent } from '@/lib/animations'
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

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    images: '',
    category: '',
    stock: '',
    featured: false,
    active: true,
    tags: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        salePrice: product.salePrice?.toString() || '',
        images: product.images.join(', '),
        category: product.category,
        stock: product.stock.toString(),
        featured: product.featured,
        active: product.active,
        tags: product.tags.join(', '),
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        salePrice: '',
        images: '',
        category: '',
        stock: '',
        featured: false,
        active: true,
        tags: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      }

      const url = '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      const body = editingProduct
        ? { ...productData, id: editingProduct.id }
        : productData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingProduct ? 'Product updated!' : 'Product created!')
        handleCloseModal()
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product deleted!')
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-100 mb-2">Products</h1>
          <p className="text-neutral-400">Manage your product catalog</p>
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Products Table */}
      <motion.div
        className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900/50 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors"
                  variants={staggerItem}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-neutral-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-neutral-200">{product.name}</p>
                        <p className="text-xs text-neutral-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary-purple/10 text-primary-purple text-xs font-medium rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-200">
                      <p className="font-semibold">${product.price.toFixed(2)}</p>
                      {product.salePrice && (
                        <p className="text-xs text-primary-emerald">
                          Sale: ${product.salePrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        product.stock > 10
                          ? 'text-emerald-400'
                          : product.stock > 0
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {product.featured && (
                        <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-medium rounded w-fit">
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded w-fit ${
                          product.active
                            ? 'bg-emerald-400/10 text-emerald-400'
                            : 'bg-neutral-400/10 text-neutral-400'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/variants`}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-primary-purple transition-all"
                        title="Manage Variants"
                      >
                        <Package2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-primary-emerald transition-all"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-400 transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No products yet</p>
            <p className="text-sm">Get started by adding your first product</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-dark-bg rounded-2xl border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              variants={modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-dark-bg z-10">
                <h2 className="text-2xl font-headline font-bold text-neutral-100">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Images (comma-separated URLs)
                  </label>
                  <textarea
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    rows={2}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-primary-emerald transition-all"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-800 text-primary-emerald focus:ring-primary-emerald"
                    />
                    <span className="text-sm text-neutral-300">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-800 text-primary-emerald focus:ring-primary-emerald"
                    />
                    <span className="text-sm text-neutral-300">Active</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
