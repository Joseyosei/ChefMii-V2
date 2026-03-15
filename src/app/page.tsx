import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/home/hero'
import { FeaturedChefs } from '@/components/home/featured-chefs'
import { DesignPreviews } from '@/components/home/design-previews'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'

export const metadata: Metadata = {
  title: 'ChefMii – Hire a Chef for Any Occasion',
  description: 'From home dinners to presidential banquets, ChefMii connects you with top chefs globally.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedChefs />
        <DesignPreviews />
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  )
}
