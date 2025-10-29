'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Users, Trash2, Download } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  createdAt: string
}

type Subscriber = {
  id: string
  email: string
  active: boolean
  createdAt: string
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contacts' | 'subscribers'>('contacts')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

      // Fetch contacts
      const contactsRes = await fetch('/api/contact', {
        headers: { Authorization: `Bearer ${adminPassword}` },
      })
      const contactsData = await contactsRes.json()
      setContacts(contactsData.submissions || [])

      // Fetch subscribers
      const subscribersRes = await fetch('/api/newsletter', {
        headers: { Authorization: `Bearer ${adminPassword}` },
      })
      const subscribersData = await subscribersRes.json()
      setSubscribers(subscribersData.subscribers || [])
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact submission?')) return

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminPassword}` },
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Contact deleted!')
        fetchData()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch(`/api/newsletter?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminPassword}` },
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Subscriber deleted!')
        fetchData()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const exportToCSV = () => {
    const data = activeTab === 'contacts' ? contacts : subscribers
    const headers = activeTab === 'contacts'
      ? ['Name', 'Email', 'Phone', 'Message', 'Date']
      : ['Email', 'Active', 'Date']

    const rows = data.map((item) => {
      if (activeTab === 'contacts') {
        const contact = item as Contact
        return [
          contact.name,
          contact.email,
          contact.phone || '',
          `"${contact.message.replace(/"/g, '""')}"`,
          format(new Date(contact.createdAt), 'yyyy-MM-dd HH:mm'),
        ].join(',')
      } else {
        const subscriber = item as Subscriber
        return [
          subscriber.email,
          subscriber.active ? 'Yes' : 'No',
          format(new Date(subscriber.createdAt), 'yyyy-MM-dd HH:mm'),
        ].join(',')
      }
    })

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported to CSV!')
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
          <h1 className="text-3xl font-headline font-bold text-neutral-100 mb-2">
            Contacts & Subscribers
          </h1>
          <p className="text-neutral-400">View messages and newsletter subscribers</p>
        </div>
        <motion.button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold rounded-xl hover:bg-neutral-800 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-5 h-5" />
          Export CSV
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'contacts'
              ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Mail className="w-4 h-4 inline-block mr-2" />
          Contact Submissions ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'subscribers'
              ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Users className="w-4 h-4 inline-block mr-2" />
          Newsletter ({subscribers.length})
        </button>
      </div>

      {/* Content */}
      <motion.div
        className="bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {activeTab === 'contacts' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-900/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Message</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/30">
                    <td className="px-6 py-4 text-neutral-200">{contact.name}</td>
                    <td className="px-6 py-4 text-neutral-400">{contact.email}</td>
                    <td className="px-6 py-4 text-neutral-400">{contact.phone || '-'}</td>
                    <td className="px-6 py-4 text-neutral-400 max-w-md truncate">{contact.message}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {contacts.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No contact submissions yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-900/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300">Subscribed</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/30">
                    <td className="px-6 py-4 text-neutral-200">{subscriber.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          subscriber.active
                            ? 'bg-emerald-400/10 text-emerald-400'
                            : 'bg-neutral-400/10 text-neutral-400'
                        }`}
                      >
                        {subscriber.active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {format(new Date(subscriber.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {subscribers.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No subscribers yet</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
