import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Planète Auto | Achat, vente et reprise de véhicules d’occasion',
  description: 'Achat, vente et reprise de véhicules d’occasion toutes marques à Saint-Jean-de-Védas. Financement, garanties et démarches administratives.',
  icons: {
    icon: [{ url: '/Plan de travail 3 copie 12@300x.png', type: 'image/png', sizes: 'any' }],
    apple: '/Plan de travail 3 copie 12@300x.png',
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
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
