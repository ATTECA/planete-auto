import type { MetadataRoute } from 'next'
import { getVehicles, vehicleSlug } from '@/lib/vehicles'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planete-auto.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/vehicules', '/reprise', '/a-propos', '/mentions-legales'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }))

  const vehicles = await getVehicles()
  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${SITE_URL}/vehicules/${vehicleSlug(vehicle)}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...vehicleRoutes]
}
