import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '@/api/products'
import { ProductCard } from '@/components/products/ProductCard'
import { StoreLayout } from '@/components/layout/StoreLayout'
import type { Product } from '@/types/product'

export default function ProductListPage() {
  const [searchParams] = useSearchParams()
  const raw = searchParams.get('category')
  const category = raw && raw.trim() !== '' ? raw : undefined

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProducts(category)
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
  }, [category])

  const heading = category ? `${category}` : 'All products'

  return (
    <StoreLayout activeCategory={category}>
      <div className="mx-auto max-w-[1248px] px-4 py-4">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-zinc-600 md:text-sm">
          <Link to="/" className="hover:text-fk-blue">
            Home
          </Link>
          <span aria-hidden className="text-zinc-400">
            /
          </span>
          <span className="font-medium text-zinc-800">
            {category ? category : 'Products'}
          </span>
        </nav>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl">
              {heading}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {loading ? 'Loading…' : `${products.length} items`}
            </p>
          </div>
          {!category ? (
            <p className="text-sm text-zinc-500">
              Select a category above to filter, or browse everything here.
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[280px] animate-pulse rounded-sm bg-zinc-200/80"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-sm border border-dashed border-zinc-300 bg-white px-6 py-16 text-center text-zinc-600">
            No products in this view.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
