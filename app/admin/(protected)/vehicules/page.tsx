import { getVehiclesAdmin } from '@/lib/vehicles'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import DeleteVehicleButton from '@/components/admin/delete-vehicle-button'
import ArchiveVehicleButton from '@/components/admin/archive-vehicle-button'
import VehicleFormDialog from '@/components/admin/vehicle-form-dialog'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default async function AdminVehiclesPage() {
    const vehicles = await getVehiclesAdmin()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Véhicules</h1>
                <VehicleFormDialog mode="create" trigger={<Button>Ajouter un véhicule</Button>} />
            </div>
            <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16"></TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Année</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id} className={vehicle.archived ? 'opacity-50' : undefined}>
                            <TableCell>
                                <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                                    <Image src={vehicle.image} alt="" fill className="object-cover" />
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                {vehicle.name}
                                {vehicle.archived && (
                                    <Badge variant="outline" className="ml-2">Archivé</Badge>
                                )}
                            </TableCell>
                            <TableCell>{vehicle.year}</TableCell>
                            <TableCell>{vehicle.price}</TableCell>
                            <TableCell>
                                <Badge>{vehicle.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <VehicleFormDialog
                                        mode="edit"
                                        vehicle={vehicle}
                                        trigger={
                                            <Button variant="ghost" size="icon-sm">
                                                <Pencil className="size-4" />
                                                <span className="sr-only">Modifier</span>
                                            </Button>
                                        }
                                    />
                                    <ArchiveVehicleButton id={vehicle.id} archived={vehicle.archived} />
                                    <DeleteVehicleButton id={vehicle.id} name={vehicle.name} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Card>
        </div>
    )
}
