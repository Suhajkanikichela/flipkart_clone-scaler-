import { getApiBaseUrl } from '@/lib/api'
import type { Product } from '@/types/product'

export type ShippingPayload = {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export type OrderLineResponse = {
  id: number
  quantity: number
  unitPrice: number
  lineTotal: number
  product: Product
}

export type PlacedOrder = {
  id: number
  totalAmount: number
  status: string
  createdAt: string
  shipping: {
    fullName: string | null
    phone: string | null
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    pincode: string | null
  }
  items: OrderLineResponse[]
}

export async function placeOrder(
  items: { productId: string; quantity: number }[],
  shipping: ShippingPayload,
): Promise<{ order: PlacedOrder }> {
  const res = await fetch(`${getApiBaseUrl()}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      shipping: {
        fullName: shipping.fullName,
        phone: shipping.phone,
        line1: shipping.line1,
        line2: shipping.line2 ?? '',
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
      },
    }),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? `Order failed (${res.status})`)
  }
  return res.json() as Promise<{ order: PlacedOrder }>
}

export async function fetchOrderById(orderId: number): Promise<{ order: PlacedOrder }> {
  const res = await fetch(`${getApiBaseUrl()}/orders/${orderId}`)
  if (!res.ok) {
    throw new Error('Order not found')
  }
  return res.json() as Promise<{ order: PlacedOrder }>
}
