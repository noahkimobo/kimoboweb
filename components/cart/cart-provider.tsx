'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type CartItem = {
  productId: number
  name: string
  slug: string
  image: string
  price: number
  color: string | null
  quantity: number
  maxStock: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (productId: number, color: string | null, quantity: number) => void
  removeItem: (productId: number, color: string | null) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'kimobo_cart_v1'

function sameLine(a: CartItem, productId: number, color: string | null) {
  return a.productId === productId && a.color === color
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback<CartContextValue['addItem']>((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item.productId, item.color))
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item.productId, item.color)
            ? { ...p, quantity: Math.min(p.quantity + quantity, p.maxStock) }
            : p,
        )
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.maxStock) }]
    })
    setOpen(true)
  }, [])

  const updateQuantity = useCallback<CartContextValue['updateQuantity']>(
    (productId, color, quantity) => {
      setItems((prev) =>
        prev
          .map((p) =>
            sameLine(p, productId, color)
              ? { ...p, quantity: Math.max(0, Math.min(quantity, p.maxStock)) }
              : p,
          )
          .filter((p) => p.quantity > 0),
      )
    },
    [],
  )

  const removeItem = useCallback<CartContextValue['removeItem']>((productId, color) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, color)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.count += item.quantity
        acc.subtotal += item.quantity * item.price
        return acc
      },
      { count: 0, subtotal: 0 },
    )
  }, [items])

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    setOpen,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
