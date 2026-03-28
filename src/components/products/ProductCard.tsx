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

export function ProductCard({ product }: Props) {
  const name = getProductName(product.title)
  const brand = getBrand(product.title)
  const { mrp, selling } = getPriceParts(product.price)
  const displayPrice = selling ?? mrp ?? 0

  return (
    <Link
      to={`/product/${encodeURIComponent(product.id)}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-white p-3">
        <img
          src={product.url}
          alt=""
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {product.discount ? (
          <span className="absolute left-2 top-2 rounded-sm bg-fk-orange px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.discount}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-zinc-100 px-3 pb-3 pt-2">
        <div className="flex items-center gap-1 text-[11px] text-amber-500">
          <span>★★★★☆</span>
          <span className="font-semibold text-zinc-700">4.1</span>
          <span className="text-zinc-400">(1.2k)</span>
        </div>
        {brand ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            {brand}
          </p>
        ) : null}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-snug text-zinc-900">
          {name}
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
          <span className="text-[15px] font-semibold text-zinc-900">
            {formatInr(displayPrice)}
          </span>
          {mrp !== undefined && selling !== undefined && mrp > selling ? (
            <span className="text-xs text-zinc-400 line-through">
              {formatInr(mrp)}
            </span>
          ) : null}
        </div>
        {product.tagline ? (
          <p className="text-[11px] font-semibold text-green-700">
            {product.tagline}
          </p>
        ) : null}
        <p className="text-[10px] text-zinc-400">Free delivery</p>
      </div>
    </Link>
  )
}
