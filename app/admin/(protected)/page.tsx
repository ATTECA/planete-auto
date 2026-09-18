import Link from 'next/link'
import { getVehicles } from '@/lib/vehicles'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import VehicleFormDialog from '@/components/admin/vehicle-form-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Car, MessageSquare, Tag, Plus, TriangleAlert } from 'lucide-react'

export default async function AdminDashboardPage() {
    const vehicles = await getVehicles()
    const recentVehicles = vehicles.slice(0, 5)
    const soldVehicles = vehicles.filter((v) => v.status?.toLowerCase().includes('vendu'))

    const stats = [
        { label: 'Véhicules en stock', value: String(vehicles.length), icon: Car },
        { label: 'Nouvelles demandes', value: '—', icon: MessageSquare },
        { label: 'Véhicules vendus', value: String(soldVehicles.length), icon: Tag },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-foreground">Tableau de bord</h1>
                    <p className="text-sm text-muted-foreground">Aperçu de l&apos;activité du site.</p>
                </div>
                <VehicleFormDialog
                    mode="create"
                    trigger={
                        <Button>
                            <Plus className="size-4" />
                            Ajouter un véhicule
                        </Button>
                    }
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map(({ label, value, icon: Icon }) => (
                    <Card key={label} className="gap-3">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                                <Icon className="size-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-foreground">{value}</CardContent>
                    </Card>
                ))}
            </div>

            {soldVehicles.length > 0 && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                    <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-foreground">
                            {soldVehicles.length} véhicule{soldVehicles.length > 1 ? 's' : ''} marqué{soldVehicles.length > 1 ? 's' : ''} vendu{soldVehicles.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Le site ne les retire pas automatiquement : ils restent visibles par les visiteurs tant qu&apos;ils ne sont pas supprimés ou modifiés.
                        </p>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Véhicules récents</CardTitle>
                    <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/admin/vehicules" />}>
                        Voir tout
                    </Button>
                </CardHeader>
                <CardContent>
                    {recentVehicles.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">Aucun véhicule pour le moment.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Année</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentVehicles.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>{vehicle.name}</TableCell>
                                        <TableCell>{vehicle.year}</TableCell>
                                        <TableCell>{vehicle.price}</TableCell>
                                        <TableCell>
                                            <Badge>{vehicle.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
