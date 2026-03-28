import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '@/api/products'
import { StoreLayout } from '@/components/layout/StoreLayout'
import {
  formatInr,
  getBrand,
  getPriceParts,
  getProductImages,
  getProductName,
  specificationEntries,
} from '@/lib/productDisplay'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types/product'

function StarRow() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex text-amber-400">
        {'★★★★☆'.split('').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </span>
      <span className="text-sm font-semibold text-zinc-800">4.2</span>
      <span className="text-sm text-zinc-500">(2,841 Ratings &amp; 312 Reviews)</span>
    </div>
  )
}

export default function ProductDetailPage() {
  const { id: rawId } = useParams()
  const id = rawId ? decodeURIComponent(rawId) : ''
  const navigate = useNavigate()
  const { addItem, replaceCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (!id) {
      setError('Invalid product')
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    setActiveImage(0)
    setQty(1)
    fetchProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data.product)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        if (e instanceof Error && e.message === 'NOT_FOUND') {
          setError('Product not found')
          return
        }
        setError(e instanceof Error ? e.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const images = useMemo(
    () => (product ? getProductImages(product) : []),
    [product],
  )

  if (loading) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-[1248px] px-4 py-8">
          <div className="h-96 animate-pulse rounded-sm bg-zinc-200/80" />
        </div>
      </StoreLayout>
    )
  }

  if (error || !product) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-[1248px] px-4 py-12 text-center text-zinc-600">
          <p className="text-lg">{error ?? 'Product unavailable'}</p>
          <Link
            to="/"
            className="mt-4 inline-block text-fk-blue hover:underline"
          >
            Back to home
          </Link>
        </div>
      </StoreLayout>
    )
  }

  const prod = product

  const name = getProductName(prod.title)
  const brand = getBrand(prod.title)
  const { mrp, selling } = getPriceParts(prod.price)
  const pay = selling ?? mrp ?? 0
  const specs = specificationEntries(prod.title)
  const inStock = prod.stockCount > 0
  const maxQty = prod.stockCount
  const safeQty = inStock ? Math.min(Math.max(1, qty), maxQty) : 0

  function handleAddToCart() {
    if (!inStock || safeQty < 1) return
    addItem(prod.id, safeQty)
    navigate('/cart')
  }

  function handleBuyNow() {
    if (!inStock || safeQty < 1) return
    replaceCart([{ productId: prod.id, quantity: safeQty }])
    navigate('/checkout')
  }

  return (
    <StoreLayout activeCategory={prod.category}>
      <div className="mx-auto max-w-[1248px] px-4 py-4">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-zinc-600 md:text-sm">
          <Link to="/" className="hover:text-fk-blue">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <Link
            to={`/products?category=${encodeURIComponent(prod.category)}`}
            className="hover:text-fk-blue"
          >
            {prod.category}
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="line-clamp-1 font-medium text-zinc-800">{name}</span>
        </nav>

        <div className="grid gap-6 rounded-sm bg-white p-4 shadow-sm md:grid-cols-[minmax(0,440px)_1fr] md:gap-10 md:p-8">
          <div>
            <div className="sticky top-24 flex flex-col gap-4">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-sm border border-zinc-100 bg-white p-4">
                <img
                  src={images[activeImage] ?? prod.url}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 bg-white p-1 ${
                        i === activeImage
                          ? 'border-fk-blue'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              {inStock ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-zinc-600">Qty</span>
                  <div className="flex items-center rounded-sm border border-zinc-300">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                      disabled={safeQty <= 1}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span className="min-w-[2.5rem] text-center text-sm font-semibold">
                      {safeQty}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                      disabled={safeQty >= maxQty}
                      onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!inStock}
                  onClick={handleAddToCart}
                  className="flex-1 rounded-sm bg-fk-orange py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  disabled={!inStock}
                  onClick={handleBuyNow}
                  className="flex-1 rounded-sm bg-fk-yellow py-3 text-sm font-bold uppercase tracking-wide text-zinc-900 shadow-sm hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            {brand ? (
              <p className="text-sm font-medium text-zinc-500">{brand}</p>
            ) : null}
            <h1 className="mt-1 text-xl font-medium leading-snug text-zinc-900 md:text-2xl">
              {name}
            </h1>
            <div className="mt-3">
              <StarRow />
            </div>

            <div
              className={`mt-4 inline-flex items-center rounded-sm px-2 py-1 text-sm font-semibold ${
                inStock
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {inStock
                ? `In stock — ${prod.stockCount} available`
                : 'Out of stock'}
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-semibold text-zinc-900">
                {formatInr(pay)}
              </span>
              {mrp !== undefined && selling !== undefined && mrp > selling ? (
                <>
                  <span className="text-lg text-zinc-400 line-through">
                    {formatInr(mrp)}
                  </span>
                  <span className="rounded-sm bg-green-100 px-1.5 py-0.5 text-sm font-semibold text-green-800">
                    {prod.discount}
                  </span>
                </>
              ) : null}
            </div>

            <p className="mt-2 text-sm font-medium text-green-700">
              {prod.tagline}
            </p>

            <div className="mt-8 border-t border-zinc-100 pt-6">
              <h2 className="text-lg font-semibold text-zinc-900">Available offers</h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li className="flex gap-2">
                  <span className="shrink-0 text-fk-blue">🏷️</span>
                  Bank Offer 5% cashback on Flipkart Axis Bank Card on orders of ₹2,000
                  and above{' '}
                  <span className="text-fk-blue">T&amp;C</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-fk-blue">🏷️</span>
                  Special Price Get extra discount on prepaid orders.{' '}
                  <span className="text-fk-blue">T&amp;C</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 border-t border-zinc-100 pt-6 text-sm">
              <div>
                <span className="text-zinc-500">Delivery</span>
                <p className="mt-1 font-medium text-zinc-900">
                  Enter pincode — check delivery date
                </p>
              </div>
              <div>
                <span className="text-zinc-500">Services</span>
                <p className="mt-1 font-medium text-zinc-900">
                  Cash on Delivery available
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-100 pt-6">
              <h2 className="text-lg font-semibold text-zinc-900">Product details</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {prod.description}
              </p>
            </div>

            {specs.length > 0 ? (
              <div className="mt-8 border-t border-zinc-100 pt-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Specifications
                </h2>
                <dl className="mt-4 divide-y divide-zinc-100 rounded-sm border border-zinc-200">
                  {specs.map((row) => (
                    <div
                      key={row.key}
                      className="grid grid-cols-[minmax(0,140px)_1fr] gap-4 px-4 py-3 text-sm md:grid-cols-[200px_1fr]"
                    >
                      <dt className="text-zinc-500">{row.key}</dt>
                      <dd className="font-medium text-zinc-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div className="mt-8 border-t border-zinc-100 pt-6">
              <h2 className="text-lg font-semibold text-zinc-900">Seller</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Sold by <span className="font-medium text-zinc-900">RetailNet Pvt Ltd</span>{' '}
                with easy returns within 7 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
