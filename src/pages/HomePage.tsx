import { CategoryStrip } from '@/components/home/CategoryStrip'
import { DealsSection } from '@/components/home/DealsSection'
import { ElectronicsSpotlight } from '@/components/home/ElectronicsSpotlight'
import { HeroBanner } from '@/components/home/HeroBanner'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-fk-bg">
      <SiteHeader />
      <CategoryStrip />
      <main>
        <HeroBanner />
        <DealsSection />
        <ElectronicsSpotlight />
      </main>
      <SiteFooter />
    </div>
  )
}
