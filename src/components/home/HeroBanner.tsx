export function HeroBanner() {
  return (
    <section className="mx-auto max-w-[1248px] px-4 pt-4">
      <div className="overflow-hidden rounded-sm bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 shadow-md">
        <div className="flex min-h-[200px] flex-col justify-center gap-2 px-8 py-10 text-white md:min-h-[260px] md:flex-row md:items-center md:justify-between md:px-14">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-90">
              Big Saving Days
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Best deals on TVs, Mobiles &amp; more
            </h1>
            <p className="mt-3 max-w-md text-sm opacity-95 md:text-base">
              Bank offers &amp; extra discounts — limited period. Style inspired by Flipkart home.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center rounded-sm bg-white px-6 py-2.5 text-sm font-bold text-fk-orange shadow"
            >
              Shop now
            </button>
          </div>
          <div
            className="mt-6 hidden shrink-0 rounded-lg bg-white/15 p-6 backdrop-blur md:mt-0 md:block"
            aria-hidden
          >
            <div className="h-32 w-48 rounded-md bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  )
}
