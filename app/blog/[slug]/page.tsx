'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  User,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { fadeInUp, staggerContainer, staggerItem, hoverLift } from '@/lib/animations'
import { BLOG_CATEGORIES } from '@/lib/config'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  author: string
  category: string | null
  tags: string[]
  views: number
  readTime: number
  publishedAt: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog?slug=${slug}`)
        const data = await response.json()

        if (data.post) {
          setPost(data.post)

          // Fetch related posts (same category)
          if (data.post.category) {
            const relatedResponse = await fetch(`/api/blog?category=${data.post.category}&limit=3`)
            const relatedData = await relatedResponse.json()
            // Filter out current post
            const filtered = (relatedData.posts || []).filter((p: BlogPost) => p.id !== data.post.id)
            setRelatedPosts(filtered.slice(0, 3))
          }
        } else {
          toast.error('Blog post not found')
          router.push('/blog')
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        toast.error('Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug, router])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ''

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
      setShowShareMenu(false)
    } else if (platform in shareUrls) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
      setShowShareMenu(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg">
        {/* Breadcrumb Skeleton */}
        <div className="container-width px-6 md:px-8 pt-8">
          <div className="h-6 w-48 bg-neutral-900 rounded animate-pulse" />
        </div>

        {/* Hero Skeleton */}
        <div className="container-width px-6 md:px-8 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-12 bg-neutral-900 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-neutral-900 rounded w-1/2 animate-pulse" />
            <div className="aspect-video bg-neutral-900 rounded-2xl animate-pulse" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-neutral-900 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  const categoryName = post.category
    ? BLOG_CATEGORIES.find((c) => c.id === post.category)?.name || post.category
    : 'Uncategorized'

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg">
      {/* Breadcrumbs */}
      <motion.div
        className="container-width px-6 md:px-8 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-emerald transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </motion.div>

      {/* Article Header */}
      <article className="py-12">
        <div className="container-width px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-primary-purple/10 border border-primary-purple/30 rounded-full text-primary-purple text-sm font-medium">
                {categoryName}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-100 mb-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              {post.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views} views
              </span>
            </motion.div>

            {/* Share Button */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <motion.button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-300 hover:text-primary-emerald hover:border-primary-emerald/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>

                {/* Share Menu */}
                {showShareMenu && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-48 p-2 bg-dark-bg/95 backdrop-blur-lg rounded-xl border border-neutral-800 shadow-xl z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:text-primary-emerald hover:bg-neutral-900/50 rounded-lg transition-all text-sm"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:text-primary-emerald hover:bg-neutral-900/50 rounded-lg transition-all text-sm"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:text-primary-emerald hover:bg-neutral-900/50 rounded-lg transition-all text-sm"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:text-primary-emerald hover:bg-neutral-900/50 rounded-lg transition-all text-sm"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Copy Link
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Cover Image */}
            {post.coverImage && (
              <motion.div
                className="relative aspect-video rounded-2xl overflow-hidden mb-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              className="prose prose-invert prose-lg max-w-none mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Render content - in production, use MDX or a rich text editor */}
              <div
                className="text-neutral-300 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              />
            </motion.div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 pt-8 border-t border-neutral-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="flex items-center gap-2 text-sm text-neutral-500 mr-2">
                  <Tag className="w-4 h-4" />
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-neutral-900/50 border border-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-primary-emerald hover:border-primary-emerald/50 transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary-purple/5 to-primary-emerald/5 border-y border-neutral-800/50">
          <div className="container-width px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
                Related <span className="text-gradient-primary">Articles</span>
              </h2>
              <p className="text-neutral-400 text-lg">
                Continue reading with these related posts
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {relatedPosts.map((relatedPost) => (
                <motion.article key={relatedPost.id} variants={staggerItem}>
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <motion.div
                      className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 overflow-hidden hover:border-primary-emerald/50 transition-all h-full"
                      variants={hoverLift}
                      whileHover="hover"
                    >
                      {/* Cover Image */}
                      <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                        {relatedPost.coverImage ? (
                          <motion.img
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-neutral-700" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(relatedPost.publishedAt), 'MMM d')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {relatedPost.readTime} min
                          </span>
                        </div>

                        <h3 className="text-lg font-headline font-bold text-neutral-100 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        <p className="text-neutral-400 text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.article>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prose {
          max-width: none;
        }

        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .prose h2 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: #f1f5f9;
        }

        .prose h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #f1f5f9;
        }

        .prose ul,
        .prose ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
        }

        .prose strong {
          color: #10b981;
          font-weight: 600;
        }

        .prose a {
          color: #8b5cf6;
          text-decoration: underline;
        }

        .prose a:hover {
          color: #10b981;
        }

        .prose code {
          background: rgba(139, 92, 246, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          color: #a78bfa;
        }

        .prose blockquote {
          border-left: 4px solid #8b5cf6;
          padding-left: 1.5rem;
          margin-left: 0;
          margin-bottom: 1.5rem;
          font-style: italic;
          color: #cbd5e1;
        }
      `}</style>
    </div>
  )
}
