'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a2844',
          color: '#f3f4f6',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#f3f4f6',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#f3f4f6',
          },
        },
      }}
    />
  )
}
