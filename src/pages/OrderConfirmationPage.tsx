import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchOrderById } from '@/api/orders'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { formatInr, getProductName } from '@/lib/productDisplay'
import type { PlacedOrder } from '@/api/orders'

export default function OrderConfirmationPage() {
  const { id: rawId } = useParams()
  const orderId = rawId ? Number(rawId) : NaN

  const [order, setOrder] = useState<PlacedOrder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!Number.isInteger(orderId) || orderId < 1) {
      setError('Invalid order')
      setLoading(false)
      return
    }
    let cancelled = false
    fetchOrderById(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data.order)
      })
      .catch(() => {
        if (!cancelled) setError('We could not find this order.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [orderId])

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1248px] px-4 py-8">
        {loading ? (
          <div className="h-64 animate-pulse rounded-sm bg-zinc-200/80" />
        ) : error || !order ? (
          <div className="rounded-sm border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <p className="text-zinc-700">{error ?? 'Order unavailable'}</p>
            <Link
              to="/"
              className="mt-4 inline-block text-fk-blue hover:underline"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                ✓
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
                Order placed successfully
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Thank you for shopping with us. Your order has been confirmed.
              </p>
              <p className="mt-6 text-lg font-semibold text-fk-blue">
                Order ID:{' '}
                <span className="tabular-nums text-zinc-900">#{order.id}</span>
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {new Date(order.createdAt).toLocaleString()}
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
