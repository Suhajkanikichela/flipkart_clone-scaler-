import { Link } from 'react-router-dom'

const tiles = [
  {
    title: 'Best of Electronics',
    subtitle: 'Earbuds, smartwatches & more',
    category: 'Electronics',
    accent: 'from-blue-600 to-indigo-700',
  },
  {
    title: 'Mobiles & more',
    subtitle: '5G phones & accessories',
    category: 'Mobiles',
    accent: 'from-orange-500 to-red-600',
  },
  {
    title: 'Home & living',
    subtitle: 'Furniture, décor & kitchen',
    category: 'Home',
    accent: 'from-teal-600 to-cyan-700',
  },
] as const

function categoryHref(category: string) {
  return `/products?category=${encodeURIComponent(category)}`
}

export function ElectronicsSpotlight() {
  return (
    <section className="mx-auto mt-4 max-w-[1248px] px-4 pb-8">
      <div className="grid gap-4 md:grid-cols-3">
        {tiles.map((tile) => (
          <Link
            key={tile.title}
            to={categoryHref(tile.category)}
            className={`group relative block overflow-hidden rounded-sm bg-gradient-to-br ${tile.accent} p-6 text-white shadow-md ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-white/30 active:translate-y-0 active:shadow-md`}
          >
            <h3 className="text-lg font-bold transition group-hover:translate-x-0.5">
              {tile.title}
            </h3>
            <p className="mt-1 text-sm opacity-90">{tile.subtitle}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-sm bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur transition group-hover:bg-white group-hover:text-zinc-900">
              Shop now
              <span
                className="inline-block transition group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </span>
            <div
              className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 transition duration-500 group-hover:scale-110 group-hover:bg-white/15"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
              }}
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
