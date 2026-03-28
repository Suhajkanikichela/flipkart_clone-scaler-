import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postCartPreview } from '@/api/cart'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { formatInr, getProductName } from '@/lib/productDisplay'
import { useCart } from '@/context/CartContext'
import type { CartPreviewResponse } from '@/api/cart'

export default function CartPage() {
  const { lines, setLineQuantity, removeItem, removeItems, itemCount } =
    useCart()
  const [preview, setPreview] = useState<CartPreviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (lines.length === 0) {
      setPreview(null)
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    postCartPreview(lines)
      .then((data) => {
        if (cancelled) return
        setPreview(data)
        if (data.removed?.length) {
          removeItems(data.removed)
        }
        for (const row of data.items) {
          if (row.requestedQuantity !== row.quantity) {
            setLineQuantity(row.product.id, row.quantity)
          }
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setPreview(null)
          const msg =
            e instanceof Error
              ? e.message
              : typeof e === 'string'
                ? e
                : 'Could not load cart'
          setError(
            msg === 'Failed to fetch'
              ? 'Cannot reach the API. Start the backend (port 3000) or set VITE_API_URL.'
              : msg,
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lines, removeItems, setLineQuantity])

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1248px] px-4 py-4">
        <nav className="mb-4 text-sm text-zinc-600">
          <Link to="/" className="hover:text-fk-blue">
            Home
          </Link>
          <span className="mx-1 text-zinc-400">/</span>
          <span className="font-medium text-zinc-800">Shopping Cart</span>
        </nav>

        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl">
          My Cart {itemCount > 0 ? `(${itemCount} items)` : ''}
        </h1>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-sm border border-dashed border-zinc-300 bg-white px-8 py-16 text-center">
            <p className="text-zinc-600">Your cart is empty.</p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-sm bg-fk-blue px-6 py-2 text-sm font-semibold text-white hover:bg-fk-blue-dark"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {error ? (
                <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {error}
                </div>
              ) : null}
              {loading ? (
                <div className="h-48 animate-pulse rounded-sm bg-zinc-200/80" />
              ) : preview ? (
                preview.items.map((row) => {
                  const name = getProductName(row.product.title)
                  return (
                    <div
                      key={row.product.id}
                      className="flex gap-4 rounded-sm border border-zinc-200 bg-white p-4 shadow-sm"
                    >
                      <Link
                        to={`/product/${encodeURIComponent(row.product.id)}`}
                        className="h-28 w-28 shrink-0 overflow-hidden rounded-sm border border-zinc-100 bg-white p-1"
                      >
                        <img
                          src={row.product.url}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${encodeURIComponent(row.product.id)}`}
                          className="line-clamp-2 font-medium text-zinc-900 hover:text-fk-blue"
                        >
                          {name}
                        </Link>
                        <p className="mt-1 text-sm text-zinc-500">
                          Seller: RetailNet
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex items-center rounded-sm border border-zinc-200">
                            <button
                              type="button"
                              className="px-3 py-1 text-lg leading-none text-zinc-600 hover:bg-zinc-50"
                              aria-label="Decrease"
                              onClick={() =>
                                setLineQuantity(
                                  row.product.id,
                                  row.quantity - 1,
                                )
                              }
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-medium">
                              {row.quantity}
                            </span>
                            <button
                              type="button"
                              className="px-3 py-1 text-lg leading-none text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                              aria-label="Increase"
                              disabled={row.quantity >= row.stockCount}
                              onClick={() =>
                                setLineQuantity(
                                  row.product.id,
                                  row.quantity + 1,
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-semibold text-fk-blue hover:underline"
                            onClick={() => removeItem(row.product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-zinc-900">
                          {formatInr(row.lineTotal)}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatInr(row.unitPrice)} × {row.quantity}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : null}
            </div>

            {preview && !loading ? (
              <div className="h-fit rounded-sm border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-28">
                <h2 className="text-sm font-semibold text-zinc-500">
                  PRICE DETAILS
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-700">
                    <span>Price ({preview.itemCount} items)</span>
                    <span>{formatInr(preview.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-700">
                    <span>Discount</span>
                    <span className="text-green-600">−₹0</span>
                  </div>
                  <div className="flex justify-between text-zinc-700">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3 font-semibold text-zinc-900">
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span>{formatInr(preview.total)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-green-700">
                  Your order is eligible for FREE Delivery.
                </p>
                <Link
                  to="/checkout"
                  className="mt-4 block w-full rounded-sm bg-fk-orange py-3 text-center text-sm font-bold uppercase text-white shadow-sm hover:bg-orange-600"
                >
                  Place order
                </Link>
                <Link
                  to="/products"
                  className="mt-3 block text-center text-sm font-semibold text-fk-blue hover:underline"
                >
                  Continue shopping
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
