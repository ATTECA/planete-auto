import HomePageClient from '@/components/home-page-client'
import { getVehicles } from '@/lib/vehicles'

export default async function Page() {
  const vehicles = await getVehicles()
  return <HomePageClient vehicles={vehicles} />
}
