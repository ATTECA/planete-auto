import { getVehiclesAdmin, vehicleSlug, vehicleStatusBadgeClassName } from '@/lib/vehicles'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import DeleteVehicleButton from '@/components/admin/delete-vehicle-button'
import ArchiveVehicleButton from '@/components/admin/archive-vehicle-button'
import DuplicateVehicleButton from '@/components/admin/duplicate-vehicle-button'

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
import { cn } from '@/lib/utils'

export default async function AdminVehiclesPage() {
    const vehicles = await getVehiclesAdmin()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Véhicules</h1>
                <Button nativeButton={false} render={<Link href="/admin/vehicules/new" />}>Ajouter un véhicule</Button>
            </div>
            <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16"></TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Réf.</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Ajouté le</TableHead>
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
                                <Link
                                    href={`/vehicules/${vehicleSlug(vehicle)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline!"
                                >
                                    {vehicle.name}
                                </Link>
                            </TableCell>
                            <TableCell>{vehicle.id}</TableCell>
                            <TableCell>{vehicle.price}</TableCell>
                            <TableCell>
                                <Badge className={cn(vehicleStatusBadgeClassName(vehicle.status))}>{vehicle.status}</Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(vehicle.createdAt).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href={`/admin/vehicules/${vehicle.id}`} />}>
                                        <Pencil className="size-4" />
                                        <span className="sr-only">Modifier</span>
                                    </Button>
                                    <DuplicateVehicleButton id={vehicle.id} />
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
