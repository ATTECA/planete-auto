import { describe, expect, it } from 'vitest'
import { parseNumber, serializeJsonLd, vehicleJsonLd } from '@/lib/structured-data'
import type { Vehicle } from '@/lib/vehicles'

const baseVehicle: Vehicle = {
  id: 4,
  name: 'Peugeot 3008',
  meta: '1.6 BlueHDi 120ch Allure',
  year: '2017',
  km: '272 694 km',
  fuel: 'Diesel',
  gearbox: 'Manuelle',
  carrosserie: 'SUV',
  price: '7 990 €',
  tag: '',
  status: 'Disponible',
  image: '/vehicles/peugeot.jpg',
  gallery: [],
  details: [['Marque', 'PEUGEOT'], ['Couleur', 'Gris'], ['Nombre de portes', '5']],
  archived: false,
  createdAt: '2026-09-01T00:00:00Z',
  updatedAt: '2026-09-01T00:00:00Z',
}

type Offer = { price: number; availability: string }

describe('parseNumber', () => {
  it('reads a price with spaces and a euro sign', () => {
    expect(parseNumber('7 990 €')).toBe(7990)
  })

  it('reads a mileage', () => {
    expect(parseNumber('272 694 km')).toBe(272694)
  })

  it('returns undefined when there is no number', () => {
    expect(parseNumber('Nous consulter')).toBeUndefined()
    expect(parseNumber(undefined)).toBeUndefined()
  })
})

describe('vehicleJsonLd', () => {
  it('describes the car with its price, mileage and details', () => {
    const data = vehicleJsonLd(baseVehicle)
    expect(data['@type']).toBe('Car')
    expect((data.offers as Offer).price).toBe(7990)
    expect(data.mileageFromOdometer).toMatchObject({ value: 272694, unitCode: 'KMT' })
    expect(data.brand).toEqual({ '@type': 'Brand', name: 'PEUGEOT' })
    expect(data.numberOfDoors).toBe(5)
  })

  it('turns a local photo path into a full URL', () => {
    const data = vehicleJsonLd(baseVehicle)
    expect((data.image as string[])[0]).toMatch(/^https:\/\/.+\/vehicles\/peugeot\.jpg$/)
  })

  it('maps the vehicle status to availability', () => {
    const availability = (status: string) => (vehicleJsonLd({ ...baseVehicle, status }).offers as Offer).availability
    expect(availability('Disponible')).toBe('https://schema.org/InStock')
    expect(availability('Réservé')).toBe('https://schema.org/LimitedAvailability')
    expect(availability('Vendu')).toBe('https://schema.org/SoldOut')
  })

  it('leaves out the offer when the price is not a number', () => {
    expect(vehicleJsonLd({ ...baseVehicle, price: 'Nous consulter' }).offers).toBeUndefined()
  })
})

describe('serializeJsonLd', () => {
  it('escapes "<" so admin text cannot close the script tag', () => {
    const json = serializeJsonLd({ description: '</script><script>alert(1)</script>' })
    expect(json).not.toContain('<')
  })
})
