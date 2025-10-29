'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Eye, Save } from 'lucide-react'
import { fadeInUp, modalBackdrop, modalContent } from '@/lib/animations'
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
  published: boolean
  views: number
  readTime: number
  publishedAt: string | null
  createdAt: string
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
    published: false,
    readTime: '5',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || '',
        category: post.category || '',
        tags: post.tags.join(', '),
        published: post.published,
        readTime: post.readTime.toString(),
      })
    } else {
      setEditingPost(null)
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        category: '',
        tags: '',
        published: false,
        readTime: '5',
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const postData = {
        ...formData,
        readTime: parseInt(formData.readTime),
        tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      }

      const method = editingPost ? 'PUT' : 'POST'
      const body = editingPost ? { ...postData, id: editingPost.id } : postData

      const response = await fetch('/api/blog', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingPost ? 'Post updated!' : 'Post created!')
        setShowModal(false)
        fetchPosts()
      } else {
        toast.error(data.error || 'Failed to save post')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminPassword}` },
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Post deleted!')
        fetchPosts()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-100 mb-2">Blog Posts</h1>
          <p className="text-neutral-400">Manage your blog content</p>
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          New Post
        </motion.button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 hover:border-primary-emerald/30 transition-all"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
            )}

            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-neutral-100 line-clamp-2 flex-1">
                {post.title}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ml-2 ${
                  post.published
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'bg-yellow-400/10 text-yellow-400'
                }`}
              >
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>

            <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views}
              </span>
              <span>{post.readTime} min</span>
              {post.publishedAt && <span>{format(new Date(post.publishedAt), 'MMM d')}</span>}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(post)}
                className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id, post.title)}
                className="px-4 py-2 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-400/20 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          <p>No blog posts yet</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-dark-bg rounded-2xl border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              variants={modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-dark-bg z-10">
                <h2 className="text-2xl font-headline font-bold text-neutral-100">
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Excerpt *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Read Time</label>
                    <input
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-neutral-300">Published</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-200"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Saving...' : <><Save className="w-5 h-5" /> Save</>}
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
