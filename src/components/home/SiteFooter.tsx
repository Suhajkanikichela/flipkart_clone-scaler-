export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-[#172337] text-zinc-300">
      <div className="mx-auto max-w-[1248px] px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              About
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Help
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Payments
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Consumer policy
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Cancellation &amp; Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms Of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Mail us
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              Demo address line for UI clone — not affiliated with Flipkart.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-600/80 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Flipkart-style demo — visual reference only.
        </div>
      </div>
    </footer>
  )
}
