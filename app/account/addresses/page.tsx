'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Edit, Trash2, Check } from 'lucide-react'
import { fadeInUp, staggerItem, modalBackdrop, modalContent } from '@/lib/animations'
import toast from 'react-hot-toast'

interface Address {
  id: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

interface AddressForm {
  id?: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<AddressForm>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    isDefault: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/account/addresses')
      const data = await response.json()

      if (response.ok) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address)
      setFormData(address)
    } else {
      setEditingAddress(null)
      setFormData({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA',
        isDefault: false,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAddress(null)
    setFormData({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
      isDefault: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingAddress
        ? '/api/account/addresses'
        : '/api/account/addresses'
      const method = editingAddress ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAddress ? { ...formData, id: editingAddress.id } : formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save address')
      }

      toast.success(editingAddress ? 'Address updated!' : 'Address added!')
      handleCloseModal()
      fetchAddresses()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/account/addresses?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete address')
      }

      toast.success('Address deleted')
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to delete address')
    }
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
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Saved Addresses</h1>
          <p className="text-neutral-600">Manage your shipping addresses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Address
        </motion.button>
      </motion.div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-12 text-center"
        >
          <MapPin className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No addresses saved
          </h3>
          <p className="text-neutral-600 mb-6">
            Add an address for faster checkout
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              variants={staggerItem}
              custom={index}
              className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-6 hover:border-primary-purple/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-purple" />
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-primary-emerald/20 text-primary-emerald text-xs font-medium rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(address)}
                    className="p-2 hover:bg-primary-purple/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-primary-purple" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="text-white space-y-1">
                <div>{address.street}</div>
                <div>
                  {address.city}, {address.state} {address.zip}
                </div>
                <div className="text-neutral-600">{address.country}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              variants={modalContent}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-bg rounded-2xl border border-neutral-800 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-200 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) =>
                        setFormData({ ...formData, zip: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                      placeholder="USA"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-neutral-800 bg-darker-bg text-primary-purple focus:ring-primary-purple"
                  />
                  <label htmlFor="isDefault" className="text-neutral-200">
                    Set as default address
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-darker-bg border border-neutral-800 text-neutral-200 font-semibold rounded-xl hover:border-neutral-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingAddress ? 'Update' : 'Add Address'}
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
