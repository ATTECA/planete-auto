import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import FloatingQuoteCta from '@/components/floating-quote-cta'
import RealtimeVehiclesRefresher from '@/components/realtime-vehicles-refresher'
import { garageJsonLd, serializeJsonLd } from '@/lib/structured-data'
import './globals.css'

export const metadata: Metadata = {
  // Share previews (WhatsApp, Facebook…) need absolute URLs; relative image paths are resolved against this.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planete-auto.vercel.app'),
  // Default preview card for pages that don't set their own (vehicle pages do).
  openGraph: {
    siteName: 'Planète Auto',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Planète Auto, véhicules d’occasion à Saint-Jean-de-Védas' }],
  },
  twitter: { card: 'summary_large_image' },
  title: {
    default: 'Planète Auto | Achat, vente et reprise de véhicules d’occasion',
    // Every other page only sets its own name; the brand is added here once.
    template: '%s | Planète Auto',
  },
  description: 'Achat, vente et reprise de véhicules d’occasion toutes marques à Saint-Jean-de-Védas. Financement, garanties et démarches administratives.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: 'any' },
    ],
    apple: '/favicon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {/* Garage facts for Google (address, phone, hours), on every page. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(garageJsonLd()) }} />
        <RealtimeVehiclesRefresher />
        {children}
        <FloatingQuoteCta />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
