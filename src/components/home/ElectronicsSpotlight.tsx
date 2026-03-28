const tiles = [
  { title: 'Best of Electronics', subtitle: 'TVs, ACs & more', accent: 'from-blue-600 to-indigo-700' },
  { title: 'Audio store', subtitle: 'Speakers & soundbars', accent: 'from-orange-500 to-red-600' },
  { title: 'Laptops & tablets', subtitle: 'Work from anywhere', accent: 'from-teal-600 to-cyan-700' },
] as const

export function ElectronicsSpotlight() {
  return (
    <section className="mx-auto mt-4 max-w-[1248px] px-4 pb-8">
      <div className="grid gap-4 md:grid-cols-3">
        {tiles.map((tile) => (
          <a
            key={tile.title}
            href="#"
            className={`relative overflow-hidden rounded-sm bg-gradient-to-br ${tile.accent} p-6 text-white shadow-md transition hover:shadow-lg`}
          >
            <h3 className="text-lg font-bold">{tile.title}</h3>
            <p className="mt-1 text-sm opacity-90">{tile.subtitle}</p>
            <span className="mt-4 inline-block rounded-sm bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              Shop now
            </span>
            <div
              className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-white/10"
              aria-hidden
            />
          </a>
        ))}
      </div>
    </section>
  )
}
