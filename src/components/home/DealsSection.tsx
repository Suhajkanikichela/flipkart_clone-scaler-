import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRandomProducts } from '@/api/products'
import {
  formatInr,
  getPriceParts,
  getProductName,
} from '@/lib/productDisplay'
import type { Product } from '@/types/product'

function useCountdownToEndOfDay() {
  const [label, setLabel] = useState(() => formatCountdown())

  useEffect(() => {
    const tick = () => setLabel(formatCountdown())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return label
}

function formatCountdown(): string {
  const now = new Date()
  const end = new Date(now)
  end.setHours(24, 0, 0, 0)
  let ms = end.getTime() - now.getTime()
  if (ms <= 0) return '00 : 00 : 00'
  const s = Math.floor(ms / 1000) % 60
  const m = Math.floor(ms / 60000) % 60
  const h = Math.floor(ms / 3600000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)} : ${pad(m)} : ${pad(s)}`
}

function dealPriceLabel(product: Product): string {
  const { mrp, selling } = getPriceParts(product.price)
  const main = selling ?? mrp
  if (main === undefined) return '—'
  if (mrp !== undefined && selling !== undefined && mrp > selling) {
    return formatInr(selling)
  }
  return formatInr(main)
}

export function DealsSection() {
  const countdown = useCountdownToEndOfDay()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchRandomProducts(6)
      .then((data) => {
        if (!cancelled) {
          setProducts(data.products)
          setLoadError(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([])
          setLoadError(true)
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
    <section className="mx-auto mt-4 max-w-[1248px] px-4">
      <div className="overflow-hidden rounded-sm border border-[var(--color-fk-card-border)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between border-b border-[var(--color-fk-card-border)] px-4 py-3 md:px-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 md:text-xl">
              Deals of the Day
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 md:text-sm">
              <span className="font-semibold text-[var(--color-fk-green)]">
                {countdown}
              </span>{' '}
              left
            </p>
          </div>
          <Link
            to="/deals"
            className="rounded-sm bg-fk-blue px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:scale-105 hover:bg-fk-blue-dark hover:shadow-md active:scale-100 md:px-5 md:text-sm"
          >
            View All
          </Link>
        </div>

        <div className="bg-[var(--color-fk-bg)]">
          <div className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:justify-between [&::-webkit-scrollbar]:hidden">
            {loadError && !loading ? (
              <div className="w-full bg-white px-6 py-10 text-center text-sm text-zinc-600">
                Could not load deals. Check that the API is running.
              </div>
            ) : null}
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[45%] flex-[0_0_45%] snap-start border-r border-[var(--color-fk-card-border)] bg-white p-3 last:border-r-0 sm:min-w-[33%] sm:flex-[0_0_33%] md:min-w-0 md:flex-1 md:border-r md:last:border-r-0"
                  >
                    <div className="mx-auto aspect-square max-w-[130px] animate-pulse rounded-sm bg-[var(--color-fk-image-well)]" />
                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-zinc-200" />
                    <div className="mx-auto mt-2 h-4 w-20 animate-pulse rounded bg-zinc-200" />
                  </div>
                ))
              : products.map((product) => {
                  const name = getProductName(product.title)
                  const { mrp, selling } = getPriceParts(product.price)
                  const showStrike =
                    mrp !== undefined &&
                    selling !== undefined &&
                    mrp > selling
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${encodeURIComponent(product.id)}`}
                      className="group min-w-[45%] flex-[0_0_45%] snap-start border-r border-[var(--color-fk-card-border)] bg-white p-3 transition-all duration-200 last:border-r-0 hover:z-10 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:translate-y-0 active:shadow-sm sm:min-w-[33%] sm:flex-[0_0_33%] md:min-w-0 md:flex-1 md:border-r md:last:border-r-0"
                    >
                      <div className="relative mx-auto flex aspect-square w-full max-w-[130px] items-center justify-center overflow-hidden rounded-sm bg-[var(--color-fk-image-well)] p-2">
                        <img
                          src={product.url}
                          alt=""
                          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {product.discount ? (
                          <span className="absolute bottom-1 left-1 rounded-sm bg-[var(--color-fk-green)] px-1 py-px text-[9px] font-bold text-white">
                            {product.discount}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 line-clamp-2 min-h-[2.25rem] text-center text-[12px] leading-tight text-zinc-800">
                        {name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
                        <span className="text-sm font-semibold text-zinc-900">
                          {dealPriceLabel(product)}
                        </span>
                        {showStrike ? (
                          <span className="text-xs text-zinc-400 line-through">
                            {formatInr(mrp!)}
                          </span>
                        ) : null}
                      </div>
                      {product.tagline ? (
                        <p className="mt-1 line-clamp-1 text-center text-[11px] font-medium text-[var(--color-fk-green)]">
                          {product.tagline}
                        </p>
                      ) : null}
                    </Link>
                  )
                })}
          </div>
        </div>
      </div>
    </section>
  )
}
