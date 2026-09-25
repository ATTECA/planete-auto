import Image from 'next/image'
import Link from 'next/link'
import { Archive, PlusCircle, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { vehicleStatusBadgeClassName, type Vehicle } from '@/lib/vehicles'

type Operation = 'added' | 'modified' | 'archived'

const OPERATION_META: Record<Operation, { label: string; icon: typeof PlusCircle; colorClass: string }> = {
    added: { label: 'Ajouté', icon: PlusCircle, colorClass: 'text-green-700 bg-green-100' },
    modified: { label: 'Modifié', icon: Wrench, colorClass: 'text-blue-700 bg-blue-100' },
    archived: { label: 'Archivé', icon: Archive, colorClass: 'text-purple-700 bg-purple-100' },
}

function operationFor(vehicle: Vehicle): Operation {
    if (vehicle.archived) return 'archived'
    if (new Date(vehicle.updatedAt).getTime() - new Date(vehicle.createdAt).getTime() > 60_000) return 'modified'
    return 'added'
}

export default function RecentActivity({ vehicles, limit = 6 }: { vehicles: Vehicle[]; limit?: number }) {
    const recent = [...vehicles]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit)

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Activité récente</h2>

            {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune activité pour le moment.</p>
            ) : (
                <div className="overflow-hidden rounded-xl border border-border">
                    <div className="grid grid-cols-[64px_minmax(0,1fr)_90px_140px_130px_110px] items-center gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <div />
                        <div>Véhicule</div>
                        <div>Réf.</div>
                        <div>Action</div>
                        <div>Statut</div>
                        <div>Le</div>
                    </div>
                    <div className="divide-y divide-border">
                        {recent.map((vehicle) => {
                            const operation = operationFor(vehicle)
                            const meta = OPERATION_META[operation]
                            const badgeClass = vehicleStatusBadgeClassName(vehicle.status)
                            const dotClass = badgeClass.match(/bg-\S+/)?.[0] ?? 'bg-muted'
                            return (
                                <div
                                    key={vehicle.id}
                                    className="grid grid-cols-[64px_minmax(0,1fr)_90px_140px_130px_110px] items-center gap-4 px-4 py-2.5 transition-colors hover:bg-muted/40"
                                >
                                    <div className="relative size-12 overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-border">
                                        <Image src={vehicle.image} alt="" fill className="object-cover" />
                                    </div>
                                    <Link
                                        href={`/admin/vehicules/${vehicle.id}`}
                                        className="min-w-0 truncate font-semibold text-foreground hover:text-primary"
                                    >
                                        {vehicle.name}
                                    </Link>
                                    <div className="text-sm text-muted-foreground">#{vehicle.id}</div>
                                    <div className={cn('flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium', meta.colorClass)}>
                                        <meta.icon className="size-3.5" />
                                        {meta.label}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                        <span className={cn('size-1.5 shrink-0 rounded-full', dotClass)} />
                                        {vehicle.status}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(vehicle.updatedAt).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
