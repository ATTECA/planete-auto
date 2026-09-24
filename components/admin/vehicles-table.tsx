'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Pencil, Search, Car, CheckCircle2, Clock3, Tag, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DeleteVehicleButton from '@/components/admin/delete-vehicle-button'
import ArchiveVehicleButton from '@/components/admin/archive-vehicle-button'
import DuplicateVehicleButton from '@/components/admin/duplicate-vehicle-button'
import { vehicleSlug, vehicleStatusBadgeClassName, type Vehicle } from '@/lib/vehicles'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'disponible' | 'reserve' | 'vendu' | 'archive'

const STATUS_MATCH: Record<Exclude<StatusFilter, 'all'>, (status: string) => boolean> = {
    disponible: (s) => s.includes('disponible'),
    reserve: (s) => s.includes('reserv'),
    vendu: (s) => s.includes('vendu'),
    archive: (s) => s.includes('archiv'),
}

function normalize(status: string) {
    return status
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
}

export default function VehiclesTable({ vehicles }: { vehicles: Vehicle[] }) {
    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

    const counts = useMemo(() => {
        const normalized = vehicles.map((v) => normalize(v.status))
        return {
            total: vehicles.length,
            disponible: normalized.filter(STATUS_MATCH.disponible).length,
            reserve: normalized.filter(STATUS_MATCH.reserve).length,
            vendu: normalized.filter(STATUS_MATCH.vendu).length,
            archive: normalized.filter(STATUS_MATCH.archive).length,
        }
    }, [vehicles])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return vehicles.filter((vehicle) => {
            const matchesQuery = !q || `${vehicle.name} ${vehicle.meta}`.toLowerCase().includes(q) || String(vehicle.id).includes(q)
            const matchesStatus = statusFilter === 'all' || STATUS_MATCH[statusFilter](normalize(vehicle.status))
            return matchesQuery && matchesStatus
        })
    }, [vehicles, query, statusFilter])

    const stats: { key: StatusFilter; label: string; value: number; icon: typeof Car; accent: string; dot: string }[] = [
        { key: 'all', label: 'Total', value: counts.total, icon: Car, accent: 'text-foreground bg-foreground/5', dot: 'bg-foreground' },
        { key: 'disponible', label: 'Disponible', value: counts.disponible, icon: CheckCircle2, accent: 'text-green-700 bg-green-100', dot: 'bg-green-600' },
        { key: 'reserve', label: 'Réservé', value: counts.reserve, icon: Clock3, accent: 'text-orange-700 bg-orange-100', dot: 'bg-orange-400' },
        { key: 'vendu', label: 'Vendu', value: counts.vendu, icon: Tag, accent: 'text-blue-700 bg-blue-100', dot: 'bg-blue-600' },
        { key: 'archive', label: 'Archivé', value: counts.archive, icon: Archive, accent: 'text-purple-700 bg-purple-100', dot: 'bg-purple-600' },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {stats.map(({ key, label, value, icon: Icon, accent, dot }) => {
                    const isActive = statusFilter === key
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setStatusFilter(key)}
                            className={cn(
                                'group relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200',
                                isActive
                                    ? 'border-transparent bg-foreground text-background shadow-lg shadow-foreground/20 scale-[1.02]'
                                    : 'border-border bg-card hover:-translate-y-0.5 hover:shadow-md',
                            )}
                        >
                            <div className={cn('flex size-9 items-center justify-center rounded-lg', isActive ? 'bg-background/15' : accent)}>
                                <Icon className={cn('size-4.5', isActive && 'text-background')} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold tabular-nums">{value}</div>
                                <div className={cn('flex items-center gap-1.5 text-xs font-medium', isActive ? 'text-background/70' : 'text-muted-foreground')}>
                                    {key !== 'all' && <span className={cn('size-1.5 rounded-full', isActive ? 'bg-background/70' : dot)} />}
                                    {label}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher un véhicule par nom ou référence..."
                    className="h-11 pl-10 text-base"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
                    <Car className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-foreground">Aucun véhicule ne correspond</p>
                    <p className="text-sm text-muted-foreground">Essayez une autre recherche ou un autre filtre.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="grid grid-cols-[64px_minmax(0,1fr)_90px_120px_130px_110px_auto] items-center gap-4 border-b border-border bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <div />
                        <div>Véhicule</div>
                        <div>Réf.</div>
                        <div>Prix</div>
                        <div>Statut</div>
                        <div>Ajouté le</div>
                        <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-border">
                        {filtered.map((vehicle) => {
                            const isArchived = vehicle.archived
                            const badgeClass = vehicleStatusBadgeClassName(vehicle.status)
                            const dotClass = badgeClass.match(/bg-\S+/)?.[0] ?? 'bg-muted'
                            return (
                                <div
                                    key={vehicle.id}
                                    className={cn(
                                        'grid grid-cols-[64px_minmax(0,1fr)_90px_120px_130px_110px_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40',
                                        isArchived && 'opacity-55',
                                    )}
                                >
                                    <div className="relative size-14 overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-border">
                                        <Image src={vehicle.image} alt="" fill className="object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <Link
                                            href={`/vehicules/${vehicleSlug(vehicle)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline! block truncate font-semibold text-foreground hover:text-primary"
                                        >
                                            {vehicle.name}
                                        </Link>
                                        <p className="truncate text-xs text-muted-foreground">{vehicle.meta}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">#{vehicle.id}</div>
                                    <div className="font-semibold tabular-nums text-foreground">{vehicle.price}</div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                        <span className={cn('size-1.5 shrink-0 rounded-full', dotClass)} />
                                        {vehicle.status}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{new Date(vehicle.createdAt).toLocaleDateString('fr-FR')}</div>
                                    <div className="flex items-center justify-end gap-1 rounded-lg bg-muted/60 p-1">
                                        <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href={`/admin/vehicules/${vehicle.id}`} />}>
                                            <Pencil className="size-4" />
                                            <span className="sr-only">Modifier</span>
                                        </Button>
                                        <DuplicateVehicleButton id={vehicle.id} />
                                        <ArchiveVehicleButton id={vehicle.id} archived={vehicle.archived} />
                                        <DeleteVehicleButton id={vehicle.id} name={vehicle.name} />
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
