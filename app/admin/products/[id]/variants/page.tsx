'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  X,
  Save,
  ArrowLeft,
} from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import toast from 'react-hot-toast'

interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number | null
  stock: number
  attributes: Record<string, string>
  active: boolean
}

interface Product {
  id: string
  name: string
  price: number
}

export default function AdminVariantsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '0',
    attributes: {} as Record<string, string>,
    active: true,
  })
  const [attributeKey, setAttributeKey] = useState('')
  const [attributeValue, setAttributeValue] = useState('')

  useEffect(() => {
    fetchProduct()
    fetchVariants()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products?id=${productId}`)
      const data = await response.json()
      if (data.product) {
        setProduct(data.product)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to fetch product')
    }
  }

  const fetchVariants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}/variants`)
      const data = await response.json()

      if (response.ok) {
        setVariants(data.variants || [])
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
      toast.error('Failed to fetch variants')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (variant?: ProductVariant) => {
    if (variant) {
      setEditingVariant(variant)
      setFormData({
        name: variant.name,
        sku: variant.sku,
        price: variant.price?.toString() || '',
        stock: variant.stock.toString(),
        attributes: { ...variant.attributes },
        active: variant.active,
      })
    } else {
      setEditingVariant(null)
      setFormData({
        name: '',
        sku: '',
        price: '',
        stock: '0',
        attributes: {},
        active: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVariant(null)
    setAttributeKey('')
    setAttributeValue('')
  }

  const handleAddAttribute = () => {
    if (attributeKey && attributeValue) {
      setFormData({
        ...formData,
        attributes: {
          ...formData.attributes,
          [attributeKey]: attributeValue,
        },
      })
      setAttributeKey('')
      setAttributeValue('')
    }
  }

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...formData.attributes }
    delete newAttributes[key]
    setFormData({ ...formData, attributes: newAttributes })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.sku) {
      toast.error('Name and SKU are required')
      return
    }

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      if (editingVariant) {
        // Update existing variant
        const response = await fetch(`/api/admin/variants/${editingVariant.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminPassword}`,
          },
          body: JSON.stringify({
            name: formData.name,
            sku: formData.sku,
            price: formData.price ? parseFloat(formData.price) : null,
            stock: parseInt(formData.stock),
            attributes: formData.attributes,
            active: formData.active,
          }),
        })

        if (response.ok) {
          toast.success('Variant updated successfully')
          fetchVariants()
          handleCloseModal()
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to update variant')
        }
      } else {
        // Create new variant
        const response = await fetch(`/api/products/${productId}/variants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminPassword}`,
          },
          body: JSON.stringify({
            name: formData.name,
            sku: formData.sku,
            price: formData.price ? parseFloat(formData.price) : null,
            stock: parseInt(formData.stock),
            attributes: formData.attributes,
          }),
        })

        if (response.ok) {
          toast.success('Variant created successfully')
          fetchVariants()
          handleCloseModal()
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to create variant')
        }
      }
    } catch (error) {
      console.error('Error saving variant:', error)
      toast.error('Failed to save variant')
    }
  }

  const handleDelete = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) {
      return
    }

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      const response = await fetch(`/api/admin/variants/${variantId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      })

      if (response.ok) {
        toast.success('Variant deleted successfully')
        fetchVariants()
      } else {
        toast.error('Failed to delete variant')
      }
    } catch (error) {
      console.error('Error deleting variant:', error)
      toast.error('Failed to delete variant')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-primary-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <h1 className="text-3xl font-headline font-bold text-neutral-100">
            Manage Variants
          </h1>
          {product && (
            <p className="text-neutral-400 mt-2">
              Product: <span className="text-neutral-300 font-semibold">{product.name}</span>
            </p>
          )}
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Variant
        </motion.button>
      </div>

      {/* Variants List */}
      {variants.length === 0 ? (
        <div className="text-center py-16 bg-dark-bg/50 rounded-2xl border border-neutral-800">
          <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-300 mb-2">No variants yet</h3>
          <p className="text-neutral-500 mb-6">
            Create variants to offer different options for this product
          </p>
          <motion.button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create First Variant
          </motion.button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {variants.map((variant) => (
            <motion.div
              key={variant.id}
              variants={staggerItem}
              className="p-6 bg-dark-bg/50 rounded-2xl border border-neutral-800 hover:border-primary-emerald/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-100 mb-1">
                    {variant.name}
                  </h3>
                  <p className="text-sm text-neutral-500">SKU: {variant.sku}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleOpenModal(variant)}
                    className="p-2 bg-neutral-900/50 rounded-lg text-primary-purple hover:bg-primary-purple/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(variant.id)}
                    className="p-2 bg-neutral-900/50 rounded-lg text-red-400 hover:bg-red-400/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {variant.price !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Price:</span>
                    <span className="text-neutral-300 font-semibold">
                      ${variant.price.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Stock:</span>
                  <span
                    className={`font-semibold ${
                      variant.stock === 0
                        ? 'text-red-400'
                        : variant.stock <= 5
                        ? 'text-orange-400'
                        : 'text-primary-emerald'
                    }`}
                  >
                    {variant.stock} units
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Status:</span>
                  <span
                    className={`font-semibold ${
                      variant.active ? 'text-primary-emerald' : 'text-neutral-500'
                    }`}
                  >
                    {variant.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {Object.keys(variant.attributes).length > 0 && (
                <div>
                  <p className="text-xs text-neutral-500 mb-2">Attributes:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-primary-emerald/10 border border-primary-emerald/30 rounded-lg text-xs text-primary-emerald"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-dark-bg border border-neutral-800 rounded-2xl shadow-2xl z-50 p-8"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold text-neutral-100">
                  {editingVariant ? 'Edit Variant' : 'Create Variant'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-neutral-900/50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Variant Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Small - Red, Large - Blue"
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    required
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., PROD-SM-RED"
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    required
                  />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Price Override
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Leave empty to use product price"
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                      required
                    />
                  </div>
                </div>

                {/* Attributes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Attributes
                  </label>
                  <div className="space-y-3">
                    {/* Add Attribute Form */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={attributeKey}
                        onChange={(e) => setAttributeKey(e.target.value)}
                        placeholder="Key (e.g., size, color)"
                        className="flex-1 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald"
                      />
                      <input
                        type="text"
                        value={attributeValue}
                        onChange={(e) => setAttributeValue(e.target.value)}
                        placeholder="Value (e.g., Small, Red)"
                        className="flex-1 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary-emerald"
                      />
                      <motion.button
                        type="button"
                        onClick={handleAddAttribute}
                        className="px-4 py-2 bg-primary-emerald/20 border border-primary-emerald/30 rounded-xl text-primary-emerald hover:bg-primary-emerald/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Existing Attributes */}
                    {Object.keys(formData.attributes).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(formData.attributes).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 px-3 py-2 bg-primary-emerald/10 border border-primary-emerald/30 rounded-lg"
                          >
                            <span className="text-sm text-primary-emerald">
                              {key}: {value}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttribute(key)}
                              className="text-primary-emerald/60 hover:text-primary-emerald transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 rounded border-neutral-800 bg-neutral-900/50 text-primary-emerald focus:ring-2 focus:ring-primary-emerald/20"
                  />
                  <label htmlFor="active" className="text-sm text-neutral-300">
                    Active (visible to customers)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-neutral-900/50 border border-neutral-800 text-neutral-300 font-semibold rounded-xl hover:bg-neutral-900 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-5 h-5" />
                    {editingVariant ? 'Update Variant' : 'Create Variant'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
