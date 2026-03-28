import { Link } from 'react-router-dom'
import { HOME_CATEGORIES } from '@/constants/categories'

type Props = {
  activeCategory?: string
}

export function CategoryStrip({ activeCategory }: Props) {
  return (
    <nav
      className="border-b border-zinc-200 bg-white shadow-sm"
      aria-label="Product categories"
    >
      <div className="mx-auto flex max-w-[1248px] gap-2 overflow-x-auto px-2 py-3 md:justify-between md:gap-0 md:px-4 md:py-4">
        {HOME_CATEGORIES.map(({ label, emoji }) => {
          const isActive = activeCategory === label
          return (
            <Link
              key={label}
              to={`/products?category=${encodeURIComponent(label)}`}
              className={`flex min-w-[72px] flex-col items-center gap-1.5 text-center md:min-w-0 ${
                isActive ? 'rounded-md bg-fk-bg/80 ring-1 ring-fk-blue/30' : ''
              }`}
            >
              <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-b from-fk-bg to-white text-3xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] md:h-[72px] md:w-[72px]">
                {emoji}
              </span>
              <span className="max-w-[76px] text-[12px] font-semibold leading-tight text-zinc-800 md:text-[13px]">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
