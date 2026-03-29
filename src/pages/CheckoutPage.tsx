import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { placeOrder } from '@/api/orders'
import { postCartPreview } from '@/api/cart'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { formatInr, getProductName } from '@/lib/productDisplay'
import { useCart } from '@/context/CartContext'
import type { CartPreviewResponse } from '@/api/cart'

const initialForm = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, clearCart, removeItems, setLineQuantity } = useCart()
  /** Prevents redirect-to-cart when cart is cleared after a successful order. */
  const allowEmptyCartRedirect = useRef(true)
  const [form, setForm] = useState(initialForm)
  const [preview, setPreview] = useState<CartPreviewResponse | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (lines.length === 0) {
      setPreview(null)
      setLoadingPreview(false)
      return
    }
    let cancelled = false
    setLoadingPreview(true)
    postCartPreview(lines)
      .then((data) => {
        if (cancelled) return
        setPreview(data)
        if (data.removed?.length) removeItems(data.removed)
        for (const row of data.items) {
          if (row.requestedQuantity !== row.quantity) {
            setLineQuantity(row.product.id, row.quantity)
          }
        }
      })
      .catch(() => {
        if (!cancelled) setPreview(null)
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false)
      })
    return () => {
      cancelled = true
    }
  }, [lines, removeItems, setLineQuantity])

  useEffect(() => {
    if (!allowEmptyCartRedirect.current) return
    if (!loadingPreview && lines.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [lines.length, loadingPreview, navigate])

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (lines.length === 0) return
    setSubmitting(true)
    try {
      const { order } = await placeOrder(lines, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      })
      allowEmptyCartRedirect.current = false
      navigate(`/order-confirmation/${order.id}`, {
        replace: true,
        state: { order },
      })
      clearCart()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Order could not be placed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1248px] px-4 py-4">
        <nav className="mb-4 text-sm text-zinc-600">
          <Link to="/" className="hover:text-fk-blue">
            Home
          </Link>
          <span className="mx-1 text-zinc-400">/</span>
          <Link to="/cart" className="hover:text-fk-blue">
            Cart
          </Link>
          <span className="mx-1 text-zinc-400">/</span>
          <span className="font-medium text-zinc-800">Checkout</span>
        </nav>

        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl">
          Checkout
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-sm border border-[var(--color-fk-card-border)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              Delivery address
            </h2>
            {error ? (
              <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-zinc-600">
                  Full name
                </span>
                <input
                  required
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-zinc-600">
                  Mobile number
                </span>
                <input
                  required
                  type="tel"
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-zinc-600">
                  Address line 1
                </span>
                <input
                  required
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                  value={form.line1}
                  onChange={(e) => update('line1', e.target.value)}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-zinc-600">
                  Address line 2 (optional)
                </span>
                <input
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                  value={form.line2}
                  onChange={(e) => update('line2', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-zinc-600">City</span>
                <input
                  required
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-zinc-600">State</span>
                <input
                  required
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                  value={form.state}
                  onChange={(e) => update('state', e.target.value)}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-zinc-600">
                  Pincode (6 digits)
                </span>
                <input
                  required
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                  maxLength={6}
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                  value={form.pincode}
                  onChange={(e) => update('pincode', e.target.value)}
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting || !preview}
              className="w-full rounded-sm bg-fk-orange py-3 text-sm font-bold uppercase text-white shadow-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
          </form>

          <div className="h-fit space-y-4">
            <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <h2 className="text-sm font-semibold text-zinc-500">
                ORDER SUMMARY
              </h2>
              {loadingPreview ? (
                <div className="mt-4 h-32 animate-pulse rounded bg-zinc-200/80" />
              ) : preview ? (
                <>
                  <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm">
                    {preview.items.map((row) => (
                      <li
                        key={row.product.id}
                        className="flex justify-between gap-2 text-zinc-700"
                      >
                        <span className="line-clamp-2">
                          {getProductName(row.product.title)} × {row.quantity}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatInr(row.lineTotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t border-zinc-200 pt-3 text-sm">
                    <div className="flex justify-between font-semibold text-zinc-900">
                      <span>Total</span>
                      <span>{formatInr(preview.total)}</span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <p className="text-xs text-zinc-500">
              Review your items and address before placing the order. Payment is
              demo-only (COD assumed).
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
