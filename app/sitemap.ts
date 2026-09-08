import type { MetadataRoute } from 'next'
import { vehicles } from '@/lib/vehicles'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planete-auto.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/vehicules', '/reprise', '/a-propos', '/mentions-legales'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }))

  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${SITE_URL}/vehicules/${vehicle.id}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...vehicleRoutes]
}
