'use client'

import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createVehicle, updateVehicle, type VehicleFormState } from '@/app/admin/(protected)/vehicules/actions'
import type { Vehicle } from '@/lib/vehicles'

export default function VehicleFormDialog({
    mode,
    vehicle,
    trigger,
}: {
    mode: 'create' | 'edit'
    vehicle?: Vehicle
    trigger: ReactNode
}) {
    const [open, setOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const action = mode === 'create' ? createVehicle : updateVehicle
    const [state, formAction, pending] = useActionState<VehicleFormState, FormData>(action, undefined)
    const uid = mode === 'edit' ? `edit-${vehicle?.id}` : 'create'

    useEffect(() => {
        if (state && 'success' in state) {
            setOpen(false)
            formRef.current?.reset()
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={trigger} />
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Ajouter un véhicule' : 'Modifier le véhicule'}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="flex flex-col gap-4">
                    {mode === 'edit' && vehicle && <input type="hidden" name="id" value={vehicle.id} />}

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`name-${uid}`}>Nom</Label>
                        <Input id={`name-${uid}`} name="name" defaultValue={vehicle?.name} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`meta-${uid}`}>Version</Label>
                        <Input id={`meta-${uid}`} name="meta" defaultValue={vehicle?.meta} required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`mainPhoto-${uid}`}>Photo principale</Label>
                        {vehicle?.image && (
                            <div className="relative mb-1 size-20 overflow-hidden rounded-md bg-muted">
                                <Image src={vehicle.image} alt="" fill className="object-cover" />
                            </div>
                        )}
                        <Input
                            id={`mainPhoto-${uid}`}
                            name="mainPhoto"
                            type="file"
                            accept="image/*"
                            required={mode === 'create'}
                        />
                        {mode === 'edit' && (
                            <p className="text-xs text-muted-foreground">Laisser vide pour conserver la photo actuelle.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`year-${uid}`}>Année</Label>
                            <Input id={`year-${uid}`} name="year" defaultValue={vehicle?.year} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`km-${uid}`}>Kilométrage</Label>
                            <Input id={`km-${uid}`} name="km" defaultValue={vehicle?.km} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`fuel-${uid}`}>Énergie</Label>
                            <Input id={`fuel-${uid}`} name="fuel" defaultValue={vehicle?.fuel} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`gearbox-${uid}`}>Boîte</Label>
                            <Input id={`gearbox-${uid}`} name="gearbox" defaultValue={vehicle?.gearbox} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`price-${uid}`}>Prix</Label>
                            <Input id={`price-${uid}`} name="price" defaultValue={vehicle?.price} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={`tag-${uid}`}>Tag</Label>
                            <Input id={`tag-${uid}`} name="tag" defaultValue={vehicle?.tag ?? 'Nouveauté'} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`status-${uid}`}>Statut</Label>
                        <Input id={`status-${uid}`} name="status" defaultValue={vehicle?.status ?? 'Disponible'} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`description-${uid}`}>Description</Label>
                        <Textarea id={`description-${uid}`} name="description" defaultValue={vehicle?.description} />
                    </div>

                    {state && 'error' in state && (
                        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={pending}>
                            {pending ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
