'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, AlertCircle, CheckCircle, Megaphone } from 'lucide-react'
import Link from 'next/link'

interface Banner {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'promo'
  link: string | null
  startDate: string
  endDate: string | null
}

export default function PromoBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([])

  useEffect(() => {
    // Load dismissed banners from localStorage
    const dismissed = localStorage.getItem('dismissedBanners')
    if (dismissed) {
      setDismissedBanners(JSON.parse(dismissed))
    }

    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      const data = await response.json()

      if (response.ok) {
        setBanners(data.banners || [])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    }
  }

  const handleDismiss = (bannerId: string) => {
    const updated = [...dismissedBanners, bannerId]
    setDismissedBanners(updated)
    localStorage.setItem('dismissedBanners', JSON.stringify(updated))
  }

  // Filter out dismissed banners
  const visibleBanners = banners.filter(
    (banner) => !dismissedBanners.includes(banner.id)
  )

  if (visibleBanners.length === 0) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'promo':
        return <Megaphone className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400'
      case 'success':
        return 'bg-primary-emerald/10 border-primary-emerald/30 text-primary-emerald'
      case 'promo':
        return 'bg-gradient-to-r from-primary-purple/20 to-primary-emerald/20 border-primary-purple/30 text-white'
      default:
        return 'bg-primary-purple/10 border-primary-purple/30 text-primary-purple'
    }
  }

  return (
    <AnimatePresence>
      {visibleBanners.map((banner) => (
        <motion.div
          key={banner.id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`border-b ${getColors(banner.type)}`}
        >
          <div className="container-width px-6 md:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {getIcon(banner.type)}
                <div className="flex-1">
                  <span className="font-semibold">{banner.title}</span>
                  <span className="mx-2">•</span>
                  <span>{banner.message}</span>
                  {banner.link && (
                    <Link
                      href={banner.link}
                      className="ml-3 underline hover:no-underline font-medium"
                    >
                      Learn More →
                    </Link>
                  )}
                </div>
              </div>
              <motion.button
                onClick={() => handleDismiss(banner.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
