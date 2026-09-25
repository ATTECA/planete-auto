import { getVehiclesAdmin } from '@/lib/vehicles'
import VehiclesTable from '@/components/admin/vehicles-table'

export default async function AdminVehiclesPage() {
    const vehicles = await getVehiclesAdmin()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-foreground">Véhicules</h1>
                <p className="text-sm text-muted-foreground">Gérez votre stock, ses statuts et ses fiches.</p>
            </div>
            <VehiclesTable vehicles={vehicles} />
        </div>
    )
}
