import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Planète Auto | L’automobile autrement',
  description: 'Véhicules d’occasion sélectionnés, reprise et accompagnement automobile à Saint-Jean-de-Védas.',
  generator: 'v0.app',
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
