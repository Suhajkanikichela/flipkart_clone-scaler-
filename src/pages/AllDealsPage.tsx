import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchShuffledProducts } from '@/api/products'
import { ProductCard } from '@/components/products/ProductCard'
import { StoreLayout } from '@/components/layout/StoreLayout'
import type { Product } from '@/types/product'

export default function AllDealsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchShuffledProducts()
      .then((data) => {
        if (!cancelled) setProducts(data.products)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Something went wrong')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1248px] px-4 py-4">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-zinc-600 md:text-sm">
          <Link to="/" className="hover:text-fk-blue">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium text-zinc-800">Deals of the Day</span>
        </nav>

        <div className="mb-4">
          <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl">
            Deals of the Day — all categories
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Mixed offers from every category, shuffled for you.
          </p>
        </div>

        {error ? (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[280px] animate-pulse rounded-sm bg-[var(--color-fk-image-well)]"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
