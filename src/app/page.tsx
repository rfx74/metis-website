import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import AboutSection from '@/components/AboutSection'
import PortfolioSection from '@/components/PortfolioSection'
import ContactSection from '@/components/ContactSection'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import ScrollReset from '@/components/ScrollReset'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <WhatsAppFloat />
      <main className="relative">
        <ScrollReset />
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <PortfolioSection />
        <ContactSection />
      </main>
    </>
  )
}