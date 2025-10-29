'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Info
} from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { fadeInUp, slideInRight, slideInLeft, scaleInBounce, confetti } from '@/lib/animations'
import { BOOKING_CONFIG } from '@/lib/config'
import toast from 'react-hot-toast'

type BookingData = {
  service: string
  date: Date | undefined
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

export default function BookingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    service: '',
    date: undefined,
    time: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([]) // For future enhancement

  const steps = [
    { number: 1, title: 'Service & Date', icon: CalendarIcon },
    { number: 2, title: 'Time', icon: Clock },
    { number: 3, title: 'Your Info', icon: User },
  ]

  // Disable past dates and non-working days
  const disabledDays = [
    { before: addDays(new Date(), 1) }, // Disable today and past
    { dayOfWeek: [0, 6] }, // Disable weekends (0 = Sunday, 6 = Saturday)
    // Can add specific dates here
  ]

  const handleServiceSelect = (serviceId: string) => {
    const service = BOOKING_CONFIG.services.find((s) => s.id === serviceId)
    if (service) {
      setBookingData({ ...bookingData, service: service.name })
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setBookingData({ ...bookingData, date })
  }

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time })
  }

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData({ ...bookingData, [field]: value })
  }

  const validateStep1 = () => {
    if (!bookingData.service) {
      toast.error('Please select a service')
      return false
    }
    if (!bookingData.date) {
      toast.error('Please select a date')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!bookingData.time) {
      toast.error('Please select a time slot')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!bookingData.customerName.trim()) {
      toast.error('Please enter your name')
      return false
    }
    if (!bookingData.customerEmail.trim() || !bookingData.customerEmail.includes('@')) {
      toast.error('Please enter a valid email')
      return false
    }
    if (!bookingData.customerPhone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          service: bookingData.service,
          date: bookingData.date?.toISOString(),
          time: bookingData.time,
          notes: bookingData.notes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setBookingComplete(true)
        toast.success('Booking confirmed! Check your email for details.')
      } else {
        toast.error(data.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedService = BOOKING_CONFIG.services.find((s) => s.name === bookingData.service)

  // Success State
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg py-12 relative overflow-hidden">
        {/* Confetti */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial="hidden"
          animate="visible"
          variants={confetti}
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#8b5cf6' : '#10b981',
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>

        <div className="container-width px-6 md:px-8 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-emerald/20 to-primary-purple/20 rounded-full flex items-center justify-center"
              variants={scaleInBounce}
            >
              <Check className="w-20 h-20 text-primary-emerald" />
            </motion.div>

            <h1 className="font-headline text-4xl md:text-5xl font-bold text-neutral-100 mb-4">
              Booking <span className="text-gradient-primary">Confirmed!</span>
            </h1>

            <p className="text-xl text-neutral-400 mb-8">
              We've sent a confirmation email to{' '}
              <span className="font-semibold text-neutral-300">{bookingData.customerEmail}</span>
            </p>

            <div className="p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50 text-left mb-8">
              <h3 className="text-xl font-headline font-bold text-neutral-100 mb-6">
                Appointment Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary-purple mt-0.5" />
                  <div>
                    <div className="text-sm text-neutral-500">Service</div>
                    <div className="font-semibold text-neutral-200">{bookingData.service}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary-emerald mt-0.5" />
                  <div>
                    <div className="text-sm text-neutral-500">Date & Time</div>
                    <div className="font-semibold text-neutral-200">
                      {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')} at{' '}
                      {bookingData.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary-purple mt-0.5" />
                  <div>
                    <div className="text-sm text-neutral-500">Contact</div>
                    <div className="font-semibold text-neutral-200">{bookingData.customerName}</div>
                    <div className="text-sm text-neutral-400">{bookingData.customerPhone}</div>
                  </div>
                </div>

                {selectedService && selectedService.price > 0 && (
                  <div className="flex items-start gap-3 pt-4 border-t border-neutral-800">
                    <DollarSign className="w-5 h-5 text-primary-emerald mt-0.5" />
                    <div>
                      <div className="text-sm text-neutral-500">Price</div>
                      <div className="font-bold text-2xl text-gradient-primary">
                        ${selectedService.price}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => router.push('/')}
                className="px-8 py-4 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.button>

              <motion.button
                onClick={() => {
                  setBookingComplete(false)
                  setCurrentStep(1)
                  setBookingData({
                    service: '',
                    date: undefined,
                    time: '',
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    notes: '',
                  })
                }}
                className="px-8 py-4 bg-neutral-900/50 border border-neutral-800 text-neutral-200 rounded-xl font-semibold hover:border-primary-emerald/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Another
              </motion.button>
            </div>
          </motion.div>
        </div>

        <style jsx global>{`
          .text-gradient-primary {
            background: linear-gradient(135deg, #8b5cf6 0%, #10b981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-darker-bg to-dark-bg py-12">
      <div className="container-width px-6 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-emerald/10 border border-primary-emerald/30 rounded-full text-primary-emerald text-sm font-medium mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Easy Online Booking</span>
          </motion.div>

          <h1 className="font-headline text-4xl md:text-5xl font-bold text-neutral-100 mb-4">
            Schedule Your <span className="text-gradient-primary">Appointment</span>
          </h1>
          <p className="text-neutral-400 text-lg">
            Choose your service, pick a date and time that works for you
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-primary-purple to-primary-emerald text-white shadow-lg shadow-primary-emerald/30'
                        : 'bg-neutral-900 text-neutral-500'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.number ? 'text-neutral-200' : 'text-neutral-600'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-primary-purple to-primary-emerald'
                        : 'bg-neutral-900'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Service & Date */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Service Selection */}
                <div className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50">
                  <h2 className="text-2xl font-headline font-bold text-neutral-100 mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-primary-purple" />
                    Select Service
                  </h2>

                  <div className="space-y-3">
                    {BOOKING_CONFIG.services.map((service) => (
                      <motion.button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          bookingData.service === service.name
                            ? 'border-primary-emerald bg-primary-emerald/10'
                            : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-200 mb-1">{service.name}</h3>
                            <p className="text-sm text-neutral-500">{service.duration} minutes</p>
                          </div>
                          {service.price > 0 && (
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary-emerald">
                                ${service.price}
                              </div>
                            </div>
                          )}
                          {service.price === 0 && (
                            <div className="px-2 py-1 bg-primary-emerald/20 text-primary-emerald text-xs font-bold rounded">
                              FREE
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50">
                  <h2 className="text-2xl font-headline font-bold text-neutral-100 mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-primary-emerald" />
                    Choose Date
                  </h2>

                  <div className="booking-calendar">
                    <DayPicker
                      mode="single"
                      selected={bookingData.date}
                      onSelect={handleDateSelect}
                      disabled={disabledDays}
                      modifiersClassNames={{
                        selected: 'booking-selected',
                        today: 'booking-today',
                      }}
                    />
                  </div>

                  <div className="mt-4 p-3 bg-primary-purple/10 border border-primary-purple/30 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary-purple mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-neutral-400">
                      We're available Monday through Friday. Weekend appointments coming soon!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Time Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50"
              >
                <h2 className="text-2xl font-headline font-bold text-neutral-100 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary-emerald" />
                  Select Time Slot
                </h2>

                <div className="mb-6 p-4 bg-neutral-900/50 rounded-xl">
                  <div className="flex items-center gap-3 text-neutral-300">
                    <CalendarIcon className="w-5 h-5 text-primary-purple" />
                    <span className="font-semibold">
                      {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400">{bookingData.service}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {BOOKING_CONFIG.timeSlots.map((time) => (
                    <motion.button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                        bookingData.time === time
                          ? 'border-primary-emerald bg-primary-emerald/10 text-primary-emerald'
                          : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-neutral-800">
                  <motion.button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-neutral-400 hover:text-primary-emerald transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>

                  <motion.button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Customer Info */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 md:p-8 bg-dark-bg/80 backdrop-blur-lg rounded-2xl border border-neutral-800/50"
              >
                <h2 className="text-2xl font-headline font-bold text-neutral-100 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary-purple" />
                  Your Information
                </h2>

                {/* Booking Summary */}
                <div className="mb-8 p-4 bg-neutral-900/50 rounded-xl space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="w-4 h-4 text-primary-emerald" />
                    <span className="text-neutral-400">Service:</span>
                    <span className="font-semibold text-neutral-200">{bookingData.service}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="w-4 h-4 text-primary-purple" />
                    <span className="text-neutral-400">Date:</span>
                    <span className="font-semibold text-neutral-200">
                      {bookingData.date && format(bookingData.date, 'MMM d, yyyy')} at{' '}
                      {bookingData.time}
                    </span>
                  </div>
                  {selectedService && selectedService.price > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="w-4 h-4 text-primary-emerald" />
                      <span className="text-neutral-400">Price:</span>
                      <span className="font-bold text-primary-emerald">${selectedService.price}</span>
                    </div>
                  )}
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input
                        type="text"
                        value={bookingData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input
                        type="email"
                        value={bookingData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input
                        type="tel"
                        value={bookingData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-neutral-500" />
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Any special requirements or questions..."
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-neutral-800">
                  <motion.button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-neutral-400 hover:text-primary-emerald transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-primary-purple to-primary-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-emerald/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .text-gradient-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Calendar Styles */
        .booking-calendar {
          color: #f1f5f9;
        }

        .booking-calendar .rdp {
          --rdp-cell-size: 45px;
          --rdp-accent-color: #10b981;
          --rdp-background-color: rgba(16, 185, 129, 0.1);
          margin: 0;
        }

        .booking-calendar .rdp-months {
          justify-content: center;
        }

        .booking-calendar .rdp-month {
          width: 100%;
        }

        .booking-calendar .rdp-caption {
          color: #f1f5f9;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .booking-calendar .rdp-head_cell {
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .booking-calendar .rdp-cell {
          padding: 2px;
        }

        .booking-calendar .rdp-button {
          border-radius: 8px;
          font-weight: 500;
          color: #cbd5e1;
          border: 2px solid transparent;
        }

        .booking-calendar .rdp-day_today {
          background-color: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          font-weight: 700;
        }

        .booking-calendar .rdp-day_selected {
          background: linear-gradient(135deg, #8b5cf6 0%, #10b981 100%) !important;
          color: white !important;
          font-weight: 700;
          border: 2px solid #10b981;
        }

        .booking-calendar .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: rgba(100, 116, 139, 0.2);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.3);
        }

        .booking-calendar .rdp-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .booking-calendar .rdp-button:disabled:hover {
          background-color: transparent;
        }
      `}</style>
    </div>
  )
}
