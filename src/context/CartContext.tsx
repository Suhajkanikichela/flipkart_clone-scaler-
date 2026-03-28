import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartLine = { productId: string; quantity: number }

const STORAGE_KEY = 'fk_cart_v1'

function readStoredLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((row) => ({
        productId: String((row as { productId?: unknown }).productId ?? ''),
        quantity: Number((row as { quantity?: unknown }).quantity),
      }))
      .filter((l) => l.productId && Number.isInteger(l.quantity) && l.quantity > 0)
  } catch {
    return []
  }
}

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  addItem: (productId: string, quantity?: number) => void
  setLineQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  removeItems: (productIds: string[]) => void
  clearCart: () => void
  replaceCart: (lines: CartLine[]) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredLines)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  const addItem = useCallback((productId: string, quantity = 1) => {
    if (quantity < 1) return
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId)
      if (i < 0) return [...prev, { productId, quantity }]
      const next = [...prev]
      const cur = next[i]!
      next[i] = { ...cur, quantity: cur.quantity + quantity }
      return next
    })
  }, [])

  const setLineQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setLines((prev) => prev.filter((l) => l.productId !== productId))
      return
    }
    setLines((prev) => {
      const cur = prev.find((l) => l.productId === productId)
      if (cur && cur.quantity === quantity) return prev
      return prev.map((l) =>
        l.productId === productId ? { ...l, quantity } : l,
      )
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const removeItems = useCallback((productIds: string[]) => {
    if (productIds.length === 0) return
    const drop = new Set(productIds)
    setLines((prev) => {
      const next = prev.filter((l) => !drop.has(l.productId))
      return next.length === prev.length ? prev : next
    })
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const replaceCart = useCallback((next: CartLine[]) => {
    setLines(
      next.filter(
        (l) => l.productId && Number.isInteger(l.quantity) && l.quantity > 0,
      ),
    )
  }, [])

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      addItem,
      setLineQuantity,
      removeItem,
      removeItems,
      clearCart,
      replaceCart,
    }),
    [
      lines,
      itemCount,
      addItem,
      setLineQuantity,
      removeItem,
      removeItems,
      clearCart,
      replaceCart,
    ],
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
