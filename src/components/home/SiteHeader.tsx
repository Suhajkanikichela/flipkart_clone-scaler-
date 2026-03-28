import { Link } from 'react-router-dom'
import { IconCart, IconChevronDown, IconSearch } from './icons'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1248px] items-center gap-4 px-4 py-3 md:gap-6">
        <Link to="/" className="shrink-0 select-none">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold italic text-fk-blue">Flipkart</span>
            <span className="text-[10px] font-medium italic text-fk-blue">
              Explore{' '}
              <span className="font-bold text-fk-yellow">Plus</span>
            </span>
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 items-center rounded-sm bg-fk-bg shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
          <input
            type="search"
            placeholder="Search for products, brands and more"
            className="min-h-9 w-full min-w-0 bg-transparent px-4 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
            readOnly
            aria-label="Search"
          />
          <button
            type="button"
            className="flex h-9 w-11 shrink-0 items-center justify-center text-fk-blue hover:bg-white/60"
            aria-label="Search"
          >
            <IconSearch className="h-5 w-5" />
          </button>
        </div>

        <nav className="hidden items-center gap-1 text-[15px] font-medium text-zinc-800 md:flex">
          <button
            type="button"
            className="flex items-center gap-0.5 rounded-sm px-4 py-1.5 hover:bg-fk-bg"
          >
            Login
            <IconChevronDown className="h-4 w-4 text-fk-blue" />
          </button>
          <a href="#" className="whitespace-nowrap px-3 py-1.5 hover:text-fk-blue">
            Become a Seller
          </a>
          <button
            type="button"
            className="flex items-center gap-0.5 px-3 py-1.5 hover:text-fk-blue"
          >
            More
            <IconChevronDown className="h-4 w-4" />
          </button>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-1.5 hover:text-fk-blue"
          >
            <IconCart className="h-5 w-5" />
            <span>Cart</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
