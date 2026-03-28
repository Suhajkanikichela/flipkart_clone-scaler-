import { getApiBaseUrl } from '@/lib/api'
import type { Product } from '@/types/product'

export type CartLinePayload = { productId: string; quantity: number }

export type CartPreviewItem = {
  product: Product
  /** Quantity used for pricing (clamped to stock). */
  quantity: number
  requestedQuantity: number
  unitPrice: number
  lineTotal: number
  stockCount: number
}

export type CartPreviewResponse = {
  items: CartPreviewItem[]
  subtotal: number
  total: number
  itemCount: number
  /** Product IDs dropped (unknown or out of stock). */
  removed?: string[]
}

export async function postCartPreview(
  items: CartLinePayload[],
): Promise<CartPreviewResponse> {
  const res = await fetch(`${getApiBaseUrl()}/cart/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? `Cart preview failed (${res.status})`)
  }
  return res.json() as Promise<CartPreviewResponse>
}
