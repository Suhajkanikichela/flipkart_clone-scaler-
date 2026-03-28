import type { ReactNode } from 'react'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'

type Props = {
  children: ReactNode
  activeCategory?: string
}

export function StoreLayout({ children, activeCategory }: Props) {
  return (
    <div className="min-h-screen bg-fk-bg">
      <SiteHeader />
      <CategoryStrip activeCategory={activeCategory} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
