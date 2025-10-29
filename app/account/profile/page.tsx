'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, Save } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'
import toast from 'react-hot-toast'

interface UserProfile {
  name: string
  email: string
  phone: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/account/profile')
        const data = await response.json()

        if (response.ok) {
          setProfile({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
          })
        }
      } catch (error) {
        toast.error('Failed to load profile')
      }
    }

    fetchProfile()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      setPasswordLoading(false)
      return
    }

    try {
      const response = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <motion.div
        variants={fadeInUp}
        className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          Profile Information
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                id="name"
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                id="email"
                type="email"
                required
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        variants={fadeInUp}
        className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                id="currentPassword"
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                placeholder="Enter current password"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                id="newPassword"
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                placeholder="Enter new password"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-600">
              Must include uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                id="confirmPassword"
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full pl-12 pr-4 py-3 bg-darker-bg border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-primary-purple transition-colors"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={passwordLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {passwordLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Change Password
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
