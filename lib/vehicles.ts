import vehicleData from '@/data/vehicles.json'

export type Vehicle = {
  id: number
  featured?: boolean
  featuredOrder?: number
  name: string
  meta: string
  year: string
  km: string
  fuel: string
  gearbox: string
  price: string
  tag: string
  status: string
  image: string
  gallery: string[]
  description?: string
  details: [string, string][]
}

export const vehicles: Vehicle[] = vehicleData

export function getVehicle(id: string) {
  return vehicles.find((vehicle) => vehicle.id === Number(id))
}
