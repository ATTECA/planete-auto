import VehiclesPageClient from '@/components/vehicules-page-client'
import { getVehicles } from '@/lib/vehicles'

export default async function VehiclesPage() {
  const vehicles = await getVehicles()
  return <VehiclesPageClient vehicles={vehicles} />
}
