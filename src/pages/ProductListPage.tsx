import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '@/api/products'
import { ProductCard } from '@/components/products/ProductCard'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { HOME_CATEGORIES } from '@/constants/categories'
import type { Product } from '@/types/product'

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const category =
    categoryParam && categoryParam.trim() !== '' ? categoryParam.trim() : undefined
  const qParam = searchParams.get('q')
  const searchQuery = qParam && qParam.trim() !== '' ? qParam.trim() : undefined

  const [searchDraft, setSearchDraft] = useState(searchQuery ?? '')

  useEffect(() => {
    setSearchDraft(searchQuery ?? '')
  }, [searchQuery])

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProducts(category, searchQuery)
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
  }, [category, searchQuery])

  function onCategoryChange(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('category', value)
    else next.delete('category')
    setSearchParams(next)
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    const t = searchDraft.trim()
    if (t) next.set('q', t)
    else next.delete('q')
    setSearchParams(next)
  }

  const heading =
    searchQuery && category
      ? `${category} — “${searchQuery}”`
      : searchQuery
        ? `Search: “${searchQuery}”`
        : category
          ? category
          : 'All products'

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

        <div className="mb-6 flex flex-col gap-4 rounded-sm border border-[var(--color-fk-card-border)] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl">
              {heading}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {loading ? 'Loading…' : `${products.length} items`}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
            <label className="flex min-w-[180px] flex-col text-xs font-medium text-zinc-600">
              Category
              <select
                value={category ?? ''}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="mt-1 rounded-sm border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-fk-blue"
              >
                <option value="">All categories</option>
                {HOME_CATEGORIES.map(({ label }) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <form
              onSubmit={onSearchSubmit}
              className="flex min-w-0 flex-1 gap-2 sm:max-w-md"
            >
              <input
                type="search"
                placeholder="Search by product name"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                className="min-w-0 flex-1 rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
              />
              <button
                type="submit"
                className="shrink-0 rounded-sm bg-fk-blue px-4 py-2 text-sm font-semibold text-white hover:bg-fk-blue-dark"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] animate-pulse rounded-sm bg-[var(--color-fk-image-well)]"
                />
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-sm border border-dashed border-zinc-300 bg-white px-6 py-16 text-center text-zinc-600">
            No products match your filters.
          </div>
        ) : (
          <div className="rounded-sm border border-[var(--color-fk-card-border)] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
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
