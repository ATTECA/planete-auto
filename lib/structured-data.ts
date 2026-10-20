import { vehicleSlug, vehicleStatusCategory, type Vehicle } from '@/lib/vehicles'
import { SITE_URL } from '@/lib/site-url'

/**
 * Google structured data (JSON-LD, schema.org): machine-readable facts that let Google show
 * the garage's address and hours, and a car's price and details, directly in search results.
 * Check the output with https://search.google.com/test/rich-results after deploying.
 */

const GARAGE_ID = `${SITE_URL}/#garage`

type JsonLd = Record<string, unknown>

export function garageJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    // Both a used-car dealer and a workshop (mécanique, carrosserie, pneus).
    '@type': ['AutoDealer', 'AutoRepair'],
    '@id': GARAGE_ID,
    name: 'Planète Auto',
    url: SITE_URL,
    logo: `${SITE_URL}/planete-auto-logo.png`,
    image: `${SITE_URL}/og-cover.jpg`,
    telephone: '+33467825412',
    email: 'contact@planeteauto34.fr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2371 Route de Lavérune',
      postalCode: '34430',
      addressLocality: 'Saint-Jean-de-Védas',
      addressRegion: 'Occitanie',
      addressCountry: 'FR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 43.5931637, longitude: 3.8320012 },
    hasMap: 'https://www.google.com/maps/place/Plan%C3%A8te+autos/@43.5926281,3.8321068,18z',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '12:30' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '14:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '17:00' },
    ],
    areaServed: 'Montpellier et Hérault',
  }
}

/** "7 990 €" → 7990, "272 694 km" → 272694. Returns undefined when there is no number. */
export function parseNumber(text: string | undefined): number | undefined {
  const digits = (text ?? '').replace(/[^\d]/g, '')
  return digits ? Number(digits) : undefined
}

const AVAILABILITY = {
  disponible: 'https://schema.org/InStock',
  reserve: 'https://schema.org/LimitedAvailability',
  vendu: 'https://schema.org/SoldOut',
  archive: 'https://schema.org/Discontinued',
  autre: 'https://schema.org/InStock',
} as const

export function vehicleJsonLd(vehicle: Vehicle): JsonLd {
  const detail = (label: string) => vehicle.details.find(([key]) => key === label)?.[1]
  const price = parseNumber(vehicle.price)
  const km = parseNumber(vehicle.km)
  const brand = detail('Marque') ?? vehicle.name.split(' ')[0]
  const photos = vehicle.gallery.length > 0 ? vehicle.gallery : [vehicle.image]
  const url = `${SITE_URL}/vehicules/${vehicleSlug(vehicle)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.name} ${vehicle.meta}`.trim(),
    url,
    image: photos.filter(Boolean).map((photo) => (photo.startsWith('/') ? `${SITE_URL}${photo}` : photo)),
    description: vehicle.description || undefined,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    model: detail('Modèle'),
    vehicleModelDate: vehicle.year || undefined,
    mileageFromOdometer: km !== undefined ? { '@type': 'QuantitativeValue', value: km, unitCode: 'KMT' } : undefined,
    fuelType: vehicle.fuel || undefined,
    vehicleTransmission: vehicle.gearbox || undefined,
    bodyType: vehicle.carrosserie || undefined,
    color: detail('Couleur'),
    numberOfDoors: parseNumber(detail('Nombre de portes')),
    itemCondition: 'https://schema.org/UsedCondition',
    offers:
      price !== undefined
        ? {
            '@type': 'Offer',
            price,
            priceCurrency: 'EUR',
            availability: AVAILABILITY[vehicleStatusCategory(vehicle.status)],
            itemCondition: 'https://schema.org/UsedCondition',
            url,
            seller: { '@id': GARAGE_ID },
          }
        : undefined,
  }
}

/** Serializes for a <script type="application/ld+json">; "<" is escaped so text typed in the admin can't close the tag. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
