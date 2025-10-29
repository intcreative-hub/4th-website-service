import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
  variant?: {
    id?: string
    name?: string
    sku?: string
    attributes?: Record<string, string>
    // Legacy support for simple variants
    size?: string
    color?: string
    [key: string]: any
  }
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, variant?: CartItem['variant']) => void
  updateQuantity: (id: string, quantity: number, variant?: CartItem['variant']) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
}

// Helper to create a unique key for cart items (including variants)
const getItemKey = (id: string, variant?: CartItem['variant']) => {
  if (!variant) return id
  return `${id}-${JSON.stringify(variant)}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const itemKey = getItemKey(item.id, item.variant)
          const existingItem = state.items.find(
            (i) => getItemKey(i.id, i.variant) === itemKey
          )

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                getItemKey(i.id, i.variant) === itemKey
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        })
      },

      removeItem: (id, variant) => {
        set((state) => {
          const itemKey = getItemKey(id, variant)
          return {
            items: state.items.filter((i) => getItemKey(i.id, i.variant) !== itemKey),
          }
        })
      },

      updateQuantity: (id, quantity, variant) => {
        set((state) => {
          const itemKey = getItemKey(id, variant)
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => getItemKey(i.id, i.variant) !== itemKey),
            }
          }
          return {
            items: state.items.map((i) =>
              getItemKey(i.id, i.variant) === itemKey ? { ...i, quantity } : i
            ),
          }
        })
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
