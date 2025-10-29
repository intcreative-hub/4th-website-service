'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600/20 hover:text-blue-500',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-sky-500/20 hover:text-sky-400',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-700/20 hover:text-blue-600',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-neutral-600/20 hover:text-neutral-300',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        `Check out this product: ${shareUrl}`
      )}`,
    },
  ]

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-400 font-medium">Share:</span>
      <div className="flex gap-2">
        {shareLinks.map((platform) => (
          <motion.a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 bg-neutral-900/50 rounded-lg text-neutral-400 transition-all ${platform.color}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`Share on ${platform.name}`}
          >
            <platform.icon className="w-4 h-4" />
          </motion.a>
        ))}
        <motion.button
          onClick={handleCopyLink}
          className="p-2 bg-neutral-900/50 rounded-lg text-neutral-400 hover:bg-primary-emerald/20 hover:text-primary-emerald transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Copy link"
        >
          <LinkIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
