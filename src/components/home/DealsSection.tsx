const deals = [
  { title: 'Headphones', price: '₹899', tag: 'Min 50% Off', tone: 'from-sky-50 to-white' },
  { title: 'Smartwatches', price: 'From ₹1,999', tag: 'Trending', tone: 'from-amber-50 to-white' },
  { title: 'Power banks', price: 'Under ₹799', tag: 'Grab now', tone: 'from-emerald-50 to-white' },
  { title: 'Mobile covers', price: 'From ₹99', tag: 'Best sellers', tone: 'from-rose-50 to-white' },
  { title: 'Monitors', price: 'From ₹6,999', tag: 'Gaming', tone: 'from-indigo-50 to-white' },
  { title: 'Keyboards', price: 'From ₹499', tag: 'New launch', tone: 'from-violet-50 to-white' },
] as const

export function DealsSection() {
  return (
    <section className="mx-auto mt-4 max-w-[1248px] px-4">
      <div className="rounded-sm bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Deals of the Day</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              <span className="font-medium text-green-600">22 : 14 : 33</span> left
            </p>
          </div>
          <button
            type="button"
            className="rounded-sm bg-fk-blue px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fk-blue-dark"
          >
            VIEW ALL
          </button>
        </div>
        <div className="grid grid-cols-2 gap-px bg-zinc-100 sm:grid-cols-3 lg:grid-cols-6">
          {deals.map((item) => (
            <a
              key={item.title}
              href="#"
              className={`group flex flex-col bg-gradient-to-b ${item.tone} p-4 transition hover:shadow-md`}
            >
              <div className="mx-auto flex aspect-square w-full max-w-[120px] items-center justify-center rounded-md bg-white shadow-inner">
                <div className="h-16 w-16 rounded bg-zinc-200/80 transition group-hover:scale-105" />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-zinc-800">{item.title}</p>
              <p className="text-center text-sm font-semibold text-zinc-900">{item.price}</p>
              <p className="mt-1 text-center text-xs font-medium text-green-600">{item.tag}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
