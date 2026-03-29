import { Link } from 'react-router-dom'
import {
  formatInr,
  getBrand,
  getPriceParts,
  getProductName,
} from '@/lib/productDisplay'
import type { Product } from '@/types/product'

type Props = {
  product: Product
}

/** Flipkart-style PLP card: white tile, gray image well, green discount & ratings */
export function ProductCard({ product }: Props) {
  const name = getProductName(product.title)
  const brand = getBrand(product.title)
  const { mrp, selling } = getPriceParts(product.price)
  const displayPrice = selling ?? mrp ?? 0
  const hasDiscount =
    mrp !== undefined && selling !== undefined && mrp > selling

  return (
    <Link
      to={`/product/${encodeURIComponent(product.id)}`}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-[var(--color-fk-card-border)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
    >
      <div className="relative aspect-[4/5] bg-[var(--color-fk-image-well)] p-3">
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={product.url}
            alt=""
            className="max-h-full max-w-full object-contain transition duration-200 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        {product.discount ? (
          <span className="absolute bottom-2 left-2 rounded-sm bg-[var(--color-fk-green)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.discount}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2.5">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="rounded-sm bg-[var(--color-fk-green)] px-1 py-0.5 text-[10px] font-bold text-white">
            ★ 4.1
          </span>
          <span className="text-zinc-500">(1,247)</span>
        </div>

        {brand ? (
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {brand}
          </p>
        ) : null}

        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-[1.35] text-zinc-800">
          {name}
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5">
          <span className="text-base font-semibold text-zinc-900">
            {formatInr(displayPrice)}
          </span>
          {hasDiscount ? (
            <span className="text-xs text-zinc-400 line-through">
              {formatInr(mrp)}
            </span>
          ) : null}
        </div>

        {product.tagline ? (
          <p className="text-[11px] font-medium text-[var(--color-fk-green)]">
            {product.tagline}
          </p>
        ) : null}

        <div className="flex items-center gap-1 border-t border-dashed border-zinc-200 pt-2 text-[10px] text-zinc-500">
          <span
            className="font-semibold text-[var(--color-fk-assured)]"
            aria-hidden
          >
            ✓
          </span>
          <span>Assured</span>
          <span className="text-zinc-300">|</span>
          <span className="text-[var(--color-fk-green)]">Free delivery</span>
        </div>
      </div>
    </Link>
  )
}
