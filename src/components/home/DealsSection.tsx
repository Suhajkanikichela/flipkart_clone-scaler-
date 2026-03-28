import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRandomProducts } from '@/api/products'
import {
  formatInr,
  getPriceParts,
  getProductName,
} from '@/lib/productDisplay'
import type { Product } from '@/types/product'

const DEAL_TONES = [
  'from-sky-50 to-white',
  'from-amber-50 to-white',
  'from-emerald-50 to-white',
  'from-rose-50 to-white',
  'from-indigo-50 to-white',
  'from-violet-50 to-white',
] as const

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
      <div className="rounded-sm bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Deals of the Day</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              <span className="font-medium text-green-600">{countdown}</span> left
            </p>
          </div>
          <Link
            to="/deals"
            className="rounded-sm bg-fk-blue px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fk-blue-dark"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="bg-zinc-100">
          <div className="flex snap-x snap-mandatory gap-px overflow-x-auto px-0 py-0 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-px [&::-webkit-scrollbar]:hidden">
            {loadError && !loading ? (
              <div className="w-full bg-white px-6 py-10 text-center text-sm text-zinc-600">
                Could not load deals. Check that the API is running.
              </div>
            ) : null}
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[140px] flex-[0_0_42%] snap-start bg-white p-4 sm:min-w-[160px] sm:flex-[0_0_33%] md:min-w-[180px] md:flex-[0_0_16.666%]"
                  >
                    <div className="mx-auto aspect-square max-w-[120px] animate-pulse rounded-md bg-zinc-200" />
                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-200" />
                    <div className="mx-auto mt-2 h-4 w-16 animate-pulse rounded bg-zinc-200" />
                  </div>
                ))
              : products.map((product, i) => {
                  const tone = DEAL_TONES[i % DEAL_TONES.length]!
                  const name = getProductName(product.title)
                  const tag = product.discount || product.tagline
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${encodeURIComponent(product.id)}`}
                      className={`min-w-[140px] flex-[0_0_42%] snap-start snap-always bg-gradient-to-b ${tone} p-4 transition hover:shadow-md sm:min-w-[160px] sm:flex-[0_0_33%] md:min-w-[180px] md:flex-[0_0_16.666%]`}
                    >
                      <div className="mx-auto flex aspect-square w-full max-w-[120px] items-center justify-center rounded-md bg-white shadow-inner">
                        <img
                          src={product.url}
                          alt=""
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-center text-sm font-medium text-zinc-800">
                        {name}
                      </p>
                      <p className="text-center text-sm font-semibold text-zinc-900">
                        {dealPriceLabel(product)}
                      </p>
                      {tag ? (
                        <p className="mt-1 text-center text-xs font-medium text-green-600">
                          {tag}
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
