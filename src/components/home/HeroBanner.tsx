import { Link } from 'react-router-dom'

/** Quick category shortcuts on the hero (each opens filtered PLP). */
const HERO_CATEGORY_CHIPS: { label: string; category: string }[] = [
  { label: 'Mobiles', category: 'Mobiles' },
  { label: 'Electronics', category: 'Electronics' },
  { label: 'Fashion', category: 'Fashion' },
  { label: 'Home', category: 'Home' },
  { label: 'Appliances', category: 'Appliances' },
]

function categoryHref(category: string) {
  return `/products?category=${encodeURIComponent(category)}`
}

export function HeroBanner() {
  return (
    <section className="mx-auto max-w-[1248px] px-4 pt-4">
      <div className="overflow-hidden rounded-sm bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 shadow-md ring-1 ring-black/5">
        <div className="flex min-h-[200px] flex-col justify-center gap-2 px-8 py-10 text-white md:min-h-[260px] md:flex-row md:items-center md:justify-between md:px-14">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-90">
              Big Saving Days
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Best deals on TVs, Mobiles &amp; more
            </h1>
            <p className="mt-3 max-w-md text-sm opacity-95 md:text-base">
              Bank offers &amp; extra discounts — tap a category or shop the full
              electronics range.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={categoryHref('Electronics')}
                className="inline-flex items-center justify-center rounded-sm bg-white px-6 py-2.5 text-sm font-bold text-fk-orange shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                Shop now
              </Link>
              <span className="hidden text-sm opacity-80 sm:inline">or explore:</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {HERO_CATEGORY_CHIPS.map(({ label, category }) => (
                <Link
                  key={category}
                  to={categoryHref(category)}
                  className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur transition hover:scale-105 hover:bg-white/25 hover:shadow-md active:scale-95"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div
            className="mt-6 hidden shrink-0 rounded-lg bg-white/15 p-6 backdrop-blur md:mt-0 md:block"
            aria-hidden
          >
            <div className="h-32 w-48 rounded-md bg-white/20 shadow-inner transition hover:rotate-1" />
          </div>
        </div>
      </div>
    </section>
  )
}
