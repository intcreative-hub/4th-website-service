'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Search, Filter, X, BookOpen, Clock, Calendar, Eye, ArrowRight, Tag } from 'lucide-react'
import Link from 'next/link'
import { fadeInUp, staggerContainer, staggerItem, hoverLift, hoverScale } from '@/lib/animations'
import { BLOG_CATEGORIES } from '@/lib/config'
import { format } from 'date-fns'
import NewsletterSignup from '@/components/NewsletterSignup'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  author: string
  category: string | null
  tags: string[]
  views: number
  readTime: number
  publishedAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch blog posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/blog')
        const data = await response.json()
        setPosts(data.posts || [])
        setFilteredPosts(data.posts || [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Filter posts
  useEffect(() => {
    let filtered = posts

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    setFilteredPosts(filtered)
  }, [selectedCategory, searchQuery, posts])

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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-purple/10 border border-primary-purple/30 rounded-full text-primary-purple text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <BookOpen className="w-4 h-4" />
              <span>Insights & Updates</span>
            </motion.div>

            <h1 className="font-headline text-5xl md:text-7xl font-bold text-neutral-100 mb-6">
              Our <span className="text-gradient-primary">Blog</span>
            </h1>

            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Stay updated with the latest insights, tips, and industry news
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
                placeholder="Search articles..."
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
              <motion.button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white shadow-lg shadow-primary-emerald/30'
                    : 'bg-neutral-900/50 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-primary-emerald/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All Posts
              </motion.button>

              {BLOG_CATEGORIES.map((category, index) => (
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
          </div>

          {/* Results Count */}
          <motion.div
            className="mt-4 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              'Loading articles...'
            ) : (
              <>
                Showing <span className="text-primary-emerald font-medium">{filteredPosts.length}</span> of{' '}
                <span className="text-neutral-400">{posts.length}</span> articles
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container-width px-6 md:px-8">
          {loading ? (
            // Loading Skeletons
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} variants={staggerItem} className="animate-pulse">
                  <div className="aspect-video bg-neutral-900 rounded-2xl mb-4" />
                  <div className="h-6 bg-neutral-900 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-neutral-900 rounded w-full mb-2" />
                  <div className="h-4 bg-neutral-900 rounded w-2/3" />
                </motion.div>
              ))}
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            // Empty State
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-900 rounded-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-neutral-600" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-neutral-300 mb-2">
                No Articles Found
              </h3>
              <p className="text-neutral-500 mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'No articles match your filters. Try adjusting your selection.'}
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
            // Blog Grid
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={staggerItem}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <motion.div
                      className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 overflow-hidden hover:border-primary-emerald/50 transition-all"
                      whileHover="hover"
                      variants={hoverLift}
                    >
                      {/* Cover Image */}
                      <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                        {post.coverImage ? (
                          <motion.img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-neutral-700" />
                          </div>
                        )}

                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-primary-purple text-white text-xs font-bold rounded-full">
                              {BLOG_CATEGORIES.find((c) => c.id === post.category)?.name || post.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-headline font-bold text-neutral-100 mb-3 group-hover:text-primary-emerald transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-900/50 border border-neutral-800 rounded text-xs text-neutral-500"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Author & Read More */}
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                          <span className="text-sm text-neutral-500">By {post.author}</span>
                          <motion.span
                            className="flex items-center gap-2 text-sm font-medium text-primary-emerald group-hover:gap-3 transition-all"
                            whileHover={{ x: 5 }}
                          >
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      {!loading && filteredPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-primary-purple/10 to-primary-emerald/10 border-y border-neutral-800/50">
          <motion.div
            className="container-width px-6 md:px-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
              Never Miss an <span className="text-gradient-primary">Update</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest articles delivered straight to your inbox
            </p>

            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              <NewsletterSignup variant="compact" showIcon={false} />
            </div>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
