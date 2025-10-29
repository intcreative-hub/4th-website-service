'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Package } from 'lucide-react'
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

interface VariantSelectorProps {
  productId: string
  basePrice: number
  onVariantChange: (variant: ProductVariant | null, price: number) => void
}

export default function VariantSelector({
  productId,
  basePrice,
  onVariantChange,
}: VariantSelectorProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  // Extract unique attribute keys and values
  const [attributes, setAttributes] = useState<Record<string, string[]>>({})

  useEffect(() => {
    fetchVariants()
  }, [productId])

  useEffect(() => {
    if (variants.length > 0) {
      // Extract unique attributes
      const attrs: Record<string, Set<string>> = {}

      variants.forEach((variant) => {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attrs[key]) {
            attrs[key] = new Set()
          }
          attrs[key].add(value as string)
        })
      })

      // Convert Sets to Arrays
      const attributesMap: Record<string, string[]> = {}
      Object.entries(attrs).forEach(([key, valueSet]) => {
        attributesMap[key] = Array.from(valueSet).sort()
      })

      setAttributes(attributesMap)
    }
  }, [variants])

  const fetchVariants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}/variants`)
      const data = await response.json()

      if (response.ok) {
        setVariants(data.variants)
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVariantSelect = (variant: ProductVariant) => {
    if (variant.stock === 0) {
      toast.error('This variant is out of stock')
      return
    }

    setSelectedVariant(variant)
    const price = variant.price || basePrice
    onVariantChange(variant, price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 border-2 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (variants.length === 0) {
    return null
  }

  // If there are variants, show attribute selectors
  if (Object.keys(attributes).length > 0) {
    return (
      <div className="space-y-4">
        {Object.entries(attributes).map(([attributeKey, values]) => (
          <div key={attributeKey}>
            <label className="block text-sm font-medium text-neutral-200 mb-2 capitalize">
              {attributeKey}
            </label>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                // Find variant that matches this attribute value
                const matchingVariant = variants.find(
                  (v) => v.attributes[attributeKey] === value
                )

                const isSelected =
                  selectedVariant?.attributes[attributeKey] === value
                const isOutOfStock = matchingVariant && matchingVariant.stock === 0

                return (
                  <motion.button
                    key={value}
                    type="button"
                    onClick={() =>
                      matchingVariant && handleVariantSelect(matchingVariant)
                    }
                    disabled={isOutOfStock}
                    whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
                    whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white border-2 border-primary-purple'
                        : isOutOfStock
                        ? 'bg-darker-bg text-neutral-600 border border-neutral-800 cursor-not-allowed line-through'
                        : 'bg-darker-bg text-neutral-300 border border-neutral-800 hover:border-primary-purple/50'
                    }`}
                  >
                    {value}
                    {isSelected && (
                      <Check className="inline-block ml-1 w-4 h-4" />
                    )}
                    {isOutOfStock && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Selected Variant Info */}
        {selectedVariant && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary-emerald/10 border border-primary-emerald/30 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-emerald" />
                <div>
                  <div className="text-sm text-neutral-400">Selected:</div>
                  <div className="font-semibold text-white">
                    {selectedVariant.name}
                  </div>
                  <div className="text-xs text-neutral-600">
                    SKU: {selectedVariant.sku}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-400">Stock:</div>
                <div className="font-semibold text-primary-emerald">
                  {selectedVariant.stock} available
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // Fallback: Show variant list if no structured attributes
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-200 mb-2">
        Select Variant
      </label>
      {variants.map((variant) => {
        const isSelected = selectedVariant?.id === variant.id
        const isOutOfStock = variant.stock === 0

        return (
          <motion.button
            key={variant.id}
            type="button"
            onClick={() => handleVariantSelect(variant)}
            disabled={isOutOfStock}
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
            className={`w-full p-4 rounded-xl transition-all text-left ${
              isSelected
                ? 'bg-gradient-to-r from-primary-purple/20 to-primary-emerald/20 border-2 border-primary-purple'
                : isOutOfStock
                ? 'bg-darker-bg border border-neutral-800 cursor-not-allowed opacity-50'
                : 'bg-darker-bg border border-neutral-800 hover:border-primary-purple/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{variant.name}</div>
                <div className="text-xs text-neutral-600">SKU: {variant.sku}</div>
              </div>
              <div className="text-right">
                {variant.price && (
                  <div className="text-lg font-bold text-white">
                    ${variant.price.toFixed(2)}
                  </div>
                )}
                <div
                  className={`text-sm ${
                    isOutOfStock ? 'text-red-400' : 'text-primary-emerald'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : `${variant.stock} in stock`}
                </div>
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
