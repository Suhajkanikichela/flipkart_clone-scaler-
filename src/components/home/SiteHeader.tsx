import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { IconCart, IconChevronDown, IconSearch } from './icons'

export function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { itemCount } = useCart()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (location.pathname !== '/products') return
    setSearch(searchParams.get('q') ?? '')
  }, [location.pathname, location.search, searchParams])

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault()
    const q = search.trim()
    const next = new URLSearchParams()
    if (location.pathname === '/products') {
      const cat = searchParams.get('category')
      if (cat) next.set('category', cat)
    }
    if (q) next.set('q', q)
    navigate({
      pathname: '/products',
      search: next.toString() ? `?${next.toString()}` : '',
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-fk-card-border)] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-[1248px] items-center gap-3 px-4 py-3 md:gap-6">
        <Link to="/" className="shrink-0 select-none">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold italic text-fk-blue">Flipkart</span>
            <span className="text-[10px] font-medium italic text-fk-blue">
              Explore{' '}
              <span className="font-bold text-fk-yellow">Plus</span>
            </span>
          </div>
        </Link>

        <form
          onSubmit={onSearchSubmit}
          className="flex min-w-0 flex-1 items-center rounded-sm bg-fk-bg shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
        >
          <input
            type="search"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-9 w-full min-w-0 bg-transparent px-4 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
            aria-label="Search"
          />
          <button
            type="submit"
            className="flex h-9 w-11 shrink-0 items-center justify-center text-fk-blue hover:bg-white/60"
            aria-label="Search"
          >
            <IconSearch className="h-5 w-5" />
          </button>
        </form>

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
          <Link
            to="/cart"
            className="relative hidden items-center gap-2 px-3 py-1.5 hover:text-fk-blue md:flex"
          >
            <IconCart className="h-5 w-5" />
            <span>Cart</span>
            {itemCount > 0 ? (
              <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-fk-orange px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            ) : null}
          </Link>
        </nav>

        <Link
          to="/cart"
          className="relative flex items-center justify-center rounded-sm p-2 text-zinc-800 hover:bg-fk-bg md:hidden"
          aria-label="Cart"
        >
          <IconCart className="h-6 w-6" />
          {itemCount > 0 ? (
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-fk-orange px-0.5 text-[9px] font-bold text-white">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  )
}
