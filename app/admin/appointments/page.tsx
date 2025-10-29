'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

type Appointment = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: string
  date: string
  time: string
  notes: string | null
  status: string
  createdAt: string
}

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    try {
      setLoading(true)
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${adminPassword}` },
      })
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ id, status }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Appointment updated!')
        fetchAppointments()
      } else {
        toast.error(data.error || 'Failed to update appointment')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-emerald-400/10 text-emerald-400'
      case 'pending':
        return 'bg-yellow-400/10 text-yellow-400'
      case 'cancelled':
        return 'bg-red-400/10 text-red-400'
      default:
        return 'bg-neutral-400/10 text-neutral-400'
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true
    return apt.status === filter
  })

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
          <h1 className="text-3xl font-headline font-bold text-neutral-100 mb-2">Appointments</h1>
          <p className="text-neutral-400">Manage bookings and schedules</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="p-6 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 hover:border-primary-emerald/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-purple/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-purple" />
              </div>
              <select
                value={apt.status}
                onChange={(e) => updateStatus(apt.id, e.target.value)}
                className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(apt.status)} border-0 cursor-pointer`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <h3 className="text-lg font-semibold text-neutral-100 mb-2">{apt.customerName}</h3>
            <p className="text-sm text-neutral-400 mb-4">{apt.service}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar className="w-4 h-4" />
                {format(new Date(apt.date), 'EEEE, MMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Clock className="w-4 h-4" />
                {apt.time}
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <User className="w-4 h-4" />
                {apt.customerEmail}
              </div>
            </div>

            {apt.notes && (
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <p className="text-xs text-neutral-500 font-semibold mb-1">Notes:</p>
                <p className="text-sm text-neutral-400">{apt.notes}</p>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12 text-neutral-500 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No appointments found</p>
        </div>
      )}
    </div>
  )
}
