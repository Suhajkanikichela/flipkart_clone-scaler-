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
      className="group flex flex-col overflow-hidden rounded-sm border border-zinc-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white p-4">
        <img
          src={product.url}
          alt=""
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {product.discount ? (
          <span className="absolute left-2 top-2 rounded-sm bg-fk-orange px-1.5 py-0.5 text-[11px] font-bold text-white">
            {product.discount}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-zinc-100 p-3">
        {brand ? (
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {brand}
          </p>
        ) : null}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-zinc-900">
          {name}
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-zinc-900">
            {formatInr(displayPrice)}
          </span>
          {mrp !== undefined && selling !== undefined && mrp > selling ? (
            <span className="text-xs text-zinc-400 line-through">
              {formatInr(mrp)}
            </span>
          ) : null}
        </div>
        {product.tagline ? (
          <p className="text-xs font-medium text-green-700">{product.tagline}</p>
        ) : null}
      </div>
    </Link>
  )
}
