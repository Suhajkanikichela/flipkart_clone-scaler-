import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchOrderById } from '@/api/orders'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { formatInr, getProductName } from '@/lib/productDisplay'
import type { PlacedOrder } from '@/api/orders'

export default function OrderConfirmationPage() {
  const { id: rawId } = useParams()
  const location = useLocation()
  const orderId = rawId ? Number(rawId) : NaN

  const orderFromNav = useMemo(() => {
    const o = (location.state as { order?: PlacedOrder } | null)?.order
    if (!o || !Number.isInteger(orderId) || o.id !== orderId) return null
    return o
  }, [location.state, orderId])

  const fallbackOrderRef = useRef<PlacedOrder | null>(null)
  fallbackOrderRef.current = orderFromNav

  const [order, setOrder] = useState<PlacedOrder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!Number.isInteger(orderId) || orderId < 1) {
      setError('Invalid order')
      setLoading(false)
      setOrder(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setOrder(null)

    fetchOrderById(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data.order)
      })
      .catch(() => {
        if (cancelled) return
        const fallback = fallbackOrderRef.current
        if (fallback && fallback.id === orderId) {
          setOrder(fallback)
        } else {
          setError(
            'We could not load your order. Check that the API is running and try again.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [orderId])

  const validId = Number.isInteger(orderId) && orderId >= 1
  const showLoading = loading && validId

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1248px] px-4 py-8">
        {showLoading ? (
          <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-fk-blue border-t-transparent" />
            <p className="mt-6 text-lg font-medium text-zinc-900">
              Confirming your order…
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Loading order details for{' '}
              <span className="font-semibold tabular-nums text-zinc-800">
                #{orderId}
              </span>
            </p>
          </div>
        ) : error || !order ? (
          <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <p className="text-zinc-700">
              {error ?? (!validId ? 'Invalid order' : 'Order unavailable')}
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-fk-blue hover:underline"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
                ✓
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-green-700">
                Success
              </p>
              <h1 className="mt-2 text-2xl font-bold text-zinc-900 md:text-3xl">
                Congratulations!
              </h1>
              <p className="mt-3 max-w-lg text-base text-zinc-700">
                Your order has been placed successfully. Thank you for shopping
                with us — we&apos;ve received your order and will process it
                shortly.
              </p>
              <div className="mt-8 w-full max-w-md rounded-sm border-2 border-dashed border-fk-blue/40 bg-[#f8fafc] px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Order ID
                </p>
                <p
                  className="mt-2 select-all text-2xl font-bold tabular-nums tracking-tight text-zinc-900 md:text-3xl"
                  title="Order reference number"
                >
                  #{order.id}
                </p>
                <p className="mt-3 text-xs text-zinc-500">
                  Save this number for tracking and support.
                </p>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Placed on{' '}
                <span className="text-zinc-700">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-xl border-t border-zinc-100 pt-8">
              <h2 className="text-sm font-semibold text-zinc-500">
                DELIVERY ADDRESS
              </h2>
              <p className="mt-2 text-sm text-zinc-800">
                {order.shipping.fullName}
                <br />
                {order.shipping.line1}
                {order.shipping.line2 ? (
                  <>
                    <br />
                    {order.shipping.line2}
                  </>
                ) : null}
                <br />
                {order.shipping.city}, {order.shipping.state}{' '}
                {order.shipping.pincode}
                <br />
                Phone: {order.shipping.phone}
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-xl border-t border-zinc-100 pt-8">
              <h2 className="text-sm font-semibold text-zinc-500">ITEMS</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {order.items.map((line) => (
                  <li
                    key={line.id}
                    className="flex justify-between gap-4 border-b border-zinc-100 py-2 last:border-0"
                  >
                    <span className="text-zinc-800">
                      {getProductName(line.product.title)} × {line.quantity}
                    </span>
                    <span className="shrink-0 font-medium text-zinc-900">
                      {formatInr(line.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between text-base font-bold text-zinc-900">
                <span>Total paid</span>
                <span>{formatInr(order.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="rounded-sm bg-fk-blue px-6 py-2 text-sm font-semibold text-white hover:bg-fk-blue-dark"
              >
                Continue shopping
              </Link>
              <Link
                to="/"
                className="rounded-sm border border-zinc-300 px-6 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
