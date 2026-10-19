import type { MetadataRoute } from 'next'
import { getVehicles, vehicleSlug } from '@/lib/vehicles'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planete-auto.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getVehicles()

  // The home page and the stock list change whenever a vehicle does.
  const latestVehicleUpdate = vehicles.reduce<Date | undefined>((latest, vehicle) => {
    const updated = new Date(vehicle.updatedAt)
    return !latest || updated > latest ? updated : latest
  }, undefined)

  const stockRoutes = ['', '/vehicules'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: latestVehicleUpdate,
  }))

  // No lastModified here: a date that is always "now" teaches Google to ignore the field.
  const staticRoutes = ['/reprise', '/prestations', '/devis', '/contact', '/a-propos', '/mentions-legales'].map((path) => ({
    url: `${SITE_URL}${path}`,
  }))

  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${SITE_URL}/vehicules/${vehicleSlug(vehicle)}`,
    lastModified: new Date(vehicle.updatedAt),
  }))

  return [...stockRoutes, ...staticRoutes, ...vehicleRoutes]
}
