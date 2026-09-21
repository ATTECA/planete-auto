import { getVehicle } from '@/lib/vehicles'
import { notFound } from 'next/navigation'
import VehicleForm from '@/components/admin/vehicle-form'

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const vehicle = await getVehicle(id)
    if (!vehicle) notFound()

    return <VehicleForm mode="edit" vehicle={vehicle} />
}
