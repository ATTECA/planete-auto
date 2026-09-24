import { getVehiclesAdmin } from '@/lib/vehicles'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import VehiclesTable from '@/components/admin/vehicles-table'

export default async function AdminVehiclesPage() {
    const vehicles = await getVehiclesAdmin()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-foreground">Véhicules</h1>
                    <p className="text-sm text-muted-foreground">Gérez votre stock, ses statuts et ses fiches.</p>
                </div>
                <Button nativeButton={false} render={<Link href="/admin/vehicules/new" />}>
                    <Plus className="size-4" />
                    Ajouter un véhicule
                </Button>
            </div>
            <VehiclesTable vehicles={vehicles} />
        </div>
    )
}
