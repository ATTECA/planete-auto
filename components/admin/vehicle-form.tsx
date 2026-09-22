'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createVehicle, updateVehicle, type VehicleFormState } from '@/app/admin/(protected)/vehicules/actions'
import {
    COMMON_CARROSSERIES,
    COMMON_DETAIL_LABELS,
    COMMON_EQUIPMENT_CATEGORIES,
    COMMON_EQUIPMENT_ITEMS,
    COMMON_FUELS,
    COMMON_GEARBOXES,
    equipmentItemsForCategory,
    type Vehicle,
} from '@/lib/vehicles'

type Photo = { id: string; url: string; kind: 'existing' } | { id: string; url: string; kind: 'new'; file: File }

const COMMON_TAGS = ['Nouveauté', 'Promotion', 'Bonne affaire', 'Coup de cœur']
const COMMON_STATUSES = ['Disponible', 'Réservé', 'Vendu', 'Archivé']

/** Sentinel select value meaning "the admin typed a custom value instead of picking one". */
const CUSTOM = '__custom__'

function resolveChoice(choice: string, custom: string) {
    return choice === CUSTOM ? custom : choice
}

type DetailRow = { id: string; choice: string; custom: string; value: string }
type EquipmentItemRow = { id: string; choice: string; custom: string }
type EquipmentGroupRow = { id: string; categoryChoice: string; categoryCustom: string; items: EquipmentItemRow[] }

function toDetailRow([label, value]: [string, string]): DetailRow {
    const isKnown = COMMON_DETAIL_LABELS.includes(label)
    return { id: crypto.randomUUID(), choice: isKnown ? label : CUSTOM, custom: isKnown ? '' : label, value }
}

function toEquipmentItemRow(item: string): EquipmentItemRow {
    const isKnown = COMMON_EQUIPMENT_ITEMS.includes(item)
    return { id: crypto.randomUUID(), choice: isKnown ? item : CUSTOM, custom: isKnown ? '' : item }
}

function toEquipmentGroupRow(group: { category: string; items: string[] }): EquipmentGroupRow {
    const isKnown = COMMON_EQUIPMENT_CATEGORIES.includes(group.category)
    return {
        id: crypto.randomUUID(),
        categoryChoice: isKnown ? group.category : CUSTOM,
        categoryCustom: isKnown ? '' : group.category,
        items: group.items.map(toEquipmentItemRow),
    }
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
                    {number}
                </span>
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            {children}
        </div>
    )
}

function Field({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: React.ReactNode; hint?: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={htmlFor} className="text-base">
                {label}
            </Label>
            {children}
            {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        </div>
    )
}

const selectClassName =
    'h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export default function VehicleForm({ mode, vehicle }: { mode: 'create' | 'edit'; vehicle?: Vehicle }) {
    const action = mode === 'create' ? createVehicle : updateVehicle
    const [state, formAction, pending] = useActionState<VehicleFormState, FormData>(action, undefined)

    const [detailRows, setDetailRows] = useState<DetailRow[]>((vehicle?.details ?? []).map(toDetailRow))
    const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroupRow[]>(
        (vehicle?.equipment ?? []).map(toEquipmentGroupRow),
    )

    const [photos, setPhotos] = useState<Photo[]>(
        (vehicle?.gallery ?? []).map((url) => ({ id: url, url, kind: 'existing' })),
    )
    const newPhotosInputRef = useRef<HTMLInputElement>(null)

    // Keeps the hidden multi-file input in sync with the "new" photos in `photos`,
    // in their current display order, so a normal form submit carries the right files.
    useEffect(() => {
        const input = newPhotosInputRef.current
        if (!input) return
        const dataTransfer = new DataTransfer()
        for (const photo of photos) {
            if (photo.kind === 'new') dataTransfer.items.add(photo.file)
        }
        input.files = dataTransfer.files
    }, [photos])

    function addPhotos(files: FileList | null) {
        if (!files) return
        const added: Photo[] = Array.from(files).map((file) => ({
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            kind: 'new',
            file,
        }))
        setPhotos((current) => [...current, ...added])
    }

    function movePhoto(index: number, direction: -1 | 1) {
        setPhotos((current) => {
            const target = index + direction
            if (target < 0 || target >= current.length) return current
            const next = [...current]
            ;[next[index], next[target]] = [next[target], next[index]]
            return next
        })
    }

    function removePhoto(id: string) {
        setPhotos((current) => current.filter((photo) => photo.id !== id))
    }

    const initialTagIsCustom = !!vehicle?.tag && !COMMON_TAGS.includes(vehicle.tag)
    const [tagChoice, setTagChoice] = useState<string>(initialTagIsCustom ? CUSTOM : vehicle?.tag ?? COMMON_TAGS[0])
    const [customTag, setCustomTag] = useState<string>(initialTagIsCustom ? vehicle!.tag : '')

    const galleryOrder = JSON.stringify(
        photos.map((photo) => (photo.kind === 'existing' ? { kind: 'existing', url: photo.url } : { kind: 'new' })),
    )

    const details = detailRows.map((row) => [resolveChoice(row.choice, row.custom), row.value] as [string, string])
    const equipment = equipmentGroups.map((group) => ({
        category: resolveChoice(group.categoryChoice, group.categoryCustom),
        items: group.items.map((item) => resolveChoice(item.choice, item.custom)),
    }))

    return (
        <div className="flex flex-col gap-6 pb-16">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    {mode === 'create' ? 'Ajouter un véhicule' : `Modifier : ${vehicle?.name}`}
                </h1>
                <Button variant="outline" nativeButton={false} render={<Link href="/admin/vehicules" />}>
                    Retour à la liste
                </Button>
            </div>

            <form action={formAction} className="flex flex-col gap-6">
                {mode === 'edit' && vehicle && <input type="hidden" name="id" value={vehicle.id} />}

                <Section number={1} title="Informations générales">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Nom du véhicule" htmlFor="name" hint="Exemple : Audi A5 Cabriolet">
                            <Input id="name" name="name" className="h-11 text-base" defaultValue={vehicle?.name} required />
                        </Field>
                        <Field label="Version / finition" htmlFor="meta" hint="Exemple : 3.0 V6 TDI 245ch S line">
                            <Input id="meta" name="meta" className="h-11 text-base" defaultValue={vehicle?.meta} required />
                        </Field>
                        <Field label="Année" htmlFor="year">
                            <Input id="year" name="year" className="h-11 text-base" defaultValue={vehicle?.year} />
                        </Field>
                        <Field label="Kilométrage" htmlFor="km" hint="Juste le nombre, sans « km »">
                            <Input
                                id="km"
                                name="km"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                className="h-11 text-base"
                                defaultValue={vehicle?.km ? vehicle.km.replace(/\D/g, '') : ''}
                            />
                        </Field>
                        <Field label="Énergie" htmlFor="fuel">
                            <select
                                id="fuel"
                                name="fuel"
                                defaultValue={vehicle?.fuel ?? COMMON_FUELS[0]}
                                className={selectClassName}
                            >
                                {[...new Set([...COMMON_FUELS, ...(vehicle?.fuel ? [vehicle.fuel] : [])])].map((fuel) => (
                                    <option key={fuel} value={fuel}>
                                        {fuel}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Boîte de vitesse" htmlFor="gearbox">
                            <select
                                id="gearbox"
                                name="gearbox"
                                defaultValue={vehicle?.gearbox ?? COMMON_GEARBOXES[0]}
                                className={selectClassName}
                            >
                                {[...new Set([...COMMON_GEARBOXES, ...(vehicle?.gearbox ? [vehicle.gearbox] : [])])].map((gearbox) => (
                                    <option key={gearbox} value={gearbox}>
                                        {gearbox}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Type de carrosserie" htmlFor="carrosserie">
                            <select
                                id="carrosserie"
                                name="carrosserie"
                                defaultValue={vehicle?.carrosserie || COMMON_CARROSSERIES[0]}
                                className={selectClassName}
                            >
                                {[...new Set([...COMMON_CARROSSERIES, ...(vehicle?.carrosserie ? [vehicle.carrosserie] : [])])].map((carrosserie) => (
                                    <option key={carrosserie} value={carrosserie}>
                                        {carrosserie}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Prix" htmlFor="price" hint="Juste le nombre, sans « € »">
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                className="h-11 text-base"
                                defaultValue={vehicle?.price ? vehicle.price.replace(/\D/g, '') : ''}
                            />
                        </Field>
                        <Field label="Étiquette" htmlFor="tag">
                            <select
                                id="tag"
                                value={tagChoice}
                                onChange={(e) => setTagChoice(e.target.value)}
                                className={selectClassName}
                            >
                                {COMMON_TAGS.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                                <option value={CUSTOM}>Autre (à préciser)...</option>
                            </select>
                            {tagChoice === CUSTOM ? (
                                <Input
                                    name="tag"
                                    className="mt-2 h-11 text-base"
                                    placeholder="Écrivez votre étiquette"
                                    value={customTag}
                                    onChange={(e) => setCustomTag(e.target.value)}
                                    required
                                />
                            ) : (
                                <input type="hidden" name="tag" value={tagChoice} />
                            )}
                        </Field>
                        <Field label="Statut" htmlFor="status">
                            <select
                                id="status"
                                name="status"
                                defaultValue={vehicle?.status ?? 'Disponible'}
                                className={selectClassName}
                            >
                                {[...new Set([...COMMON_STATUSES, ...(vehicle?.status ? [vehicle.status] : [])])].map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <Field label="Description" htmlFor="description">
                        <Textarea id="description" name="description" className="min-h-24 text-base" defaultValue={vehicle?.description} />
                    </Field>
                </Section>

                <Section number={2} title="Photos">
                    <p className="text-sm text-muted-foreground">
                        Ajoutez une ou plusieurs photos. La première photo de la liste est celle utilisée comme photo
                        principale (dans le stock et les résultats de recherche). Utilisez les flèches pour changer
                        l&apos;ordre.
                    </p>

                    <input ref={newPhotosInputRef} type="file" name="newPhotos" accept="image/*" multiple className="hidden" />
                    <input type="hidden" name="galleryOrder" value={galleryOrder} />

                    {photos.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {photos.map((photo, index) => (
                                <div key={photo.id} className="flex flex-col gap-2 rounded-md border border-border p-3">
                                    <div className="relative aspect-4/3 overflow-hidden rounded-md bg-muted">
                                        <Image src={photo.url} alt="" fill className="object-cover" unoptimized={photo.kind === 'new'} />
                                        {index === 0 && (
                                            <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                                Photo principale
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon-sm"
                                                disabled={index === 0}
                                                onClick={() => movePhoto(index, -1)}
                                                aria-label="Déplacer vers la gauche"
                                            >
                                                <ArrowLeft className="size-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon-sm"
                                                disabled={index === photos.length - 1}
                                                onClick={() => movePhoto(index, 1)}
                                                aria-label="Déplacer vers la droite"
                                            >
                                                <ArrowRight className="size-4" />
                                            </Button>
                                        </div>
                                        <Button type="button" variant="destructive" size="sm" onClick={() => removePhoto(photo.id)}>
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Field label="Ajouter des photos" htmlFor="addPhotos">
                        <Input
                            id="addPhotos"
                            type="file"
                            accept="image/*"
                            multiple
                            className="h-11 text-base"
                            onChange={(e) => {
                                addPhotos(e.target.files)
                                e.target.value = ''
                            }}
                        />
                    </Field>
                </Section>

                <Section number={3} title="Fiche technique">
                    <p className="text-sm text-muted-foreground">
                        Choisissez une caractéristique dans la liste, ou sélectionnez « Autre » pour en écrire une nouvelle.
                    </p>
                    <input type="hidden" name="details" value={JSON.stringify(details)} />
                    <div className="flex flex-col gap-3">
                        {detailRows.map((row) => (
                            <div key={row.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                <div className="flex flex-1 flex-col gap-1.5">
                                    <Label className="text-sm">Libellé</Label>
                                    <select
                                        value={row.choice}
                                        onChange={(e) =>
                                            setDetailRows((rows) =>
                                                rows.map((r) => (r.id === row.id ? { ...r, choice: e.target.value } : r)),
                                            )
                                        }
                                        className={selectClassName}
                                    >
                                        {COMMON_DETAIL_LABELS.map((label) => (
                                            <option key={label} value={label}>
                                                {label}
                                            </option>
                                        ))}
                                        <option value={CUSTOM}>Autre (à préciser)...</option>
                                    </select>
                                    {row.choice === CUSTOM && (
                                        <Input
                                            className="h-11 text-base"
                                            placeholder="Écrivez le libellé"
                                            value={row.custom}
                                            onChange={(e) =>
                                                setDetailRows((rows) =>
                                                    rows.map((r) => (r.id === row.id ? { ...r, custom: e.target.value } : r)),
                                                )
                                            }
                                        />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-1.5">
                                    <Label className="text-sm">Valeur</Label>
                                    <Input
                                        className="h-11 text-base"
                                        placeholder="Exemple : S line"
                                        value={row.value}
                                        onChange={(e) =>
                                            setDetailRows((rows) =>
                                                rows.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r)),
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setDetailRows((rows) => rows.filter((r) => r.id !== row.id))}
                                >
                                    Supprimer cette ligne
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setDetailRows((rows) => [
                                ...rows,
                                { id: crypto.randomUUID(), choice: COMMON_DETAIL_LABELS[0], custom: '', value: '' },
                            ])
                        }
                    >
                        + Ajouter une caractéristique
                    </Button>
                </Section>

                <Section number={4} title="Équipements">
                    <p className="text-sm text-muted-foreground">
                        Choisissez une catégorie et des équipements dans les listes, ou sélectionnez « Autre » pour en écrire
                        de nouveaux.
                    </p>
                    <input type="hidden" name="equipment" value={JSON.stringify(equipment)} />
                    <div className="flex flex-col gap-5">
                        {equipmentGroups.map((group) => {
                            const resolvedCategory = resolveChoice(group.categoryChoice, group.categoryCustom)
                            const itemOptions = equipmentItemsForCategory(resolvedCategory)
                            return (
                                <div key={group.id} className="flex flex-col gap-3 rounded-md border border-border p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                        <div className="flex flex-1 flex-col gap-1.5">
                                            <Label className="text-sm">Catégorie</Label>
                                            <select
                                                value={group.categoryChoice}
                                                onChange={(e) =>
                                                    setEquipmentGroups((groups) =>
                                                        groups.map((g) =>
                                                            g.id === group.id ? { ...g, categoryChoice: e.target.value } : g,
                                                        ),
                                                    )
                                                }
                                                className={selectClassName}
                                            >
                                                {COMMON_EQUIPMENT_CATEGORIES.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                                <option value={CUSTOM}>Autre (à préciser)...</option>
                                            </select>
                                            {group.categoryChoice === CUSTOM && (
                                                <Input
                                                    className="h-11 text-base"
                                                    placeholder="Écrivez la catégorie"
                                                    value={group.categoryCustom}
                                                    onChange={(e) =>
                                                        setEquipmentGroups((groups) =>
                                                            groups.map((g) =>
                                                                g.id === group.id ? { ...g, categoryCustom: e.target.value } : g,
                                                            ),
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => setEquipmentGroups((groups) => groups.filter((g) => g.id !== group.id))}
                                        >
                                            Supprimer cette catégorie
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-2 pl-4">
                                        {group.items.map((item) => (
                                            <div key={item.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                                <div className="flex flex-1 flex-col gap-1.5">
                                                    <select
                                                        value={item.choice}
                                                        onChange={(e) =>
                                                            setEquipmentGroups((groups) =>
                                                                groups.map((g) =>
                                                                    g.id === group.id
                                                                        ? {
                                                                              ...g,
                                                                              items: g.items.map((it) =>
                                                                                  it.id === item.id ? { ...it, choice: e.target.value } : it,
                                                                              ),
                                                                          }
                                                                        : g,
                                                                ),
                                                            )
                                                        }
                                                        className={selectClassName}
                                                    >
                                                        {itemOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                        <option value={CUSTOM}>Autre (à préciser)...</option>
                                                    </select>
                                                    {item.choice === CUSTOM && (
                                                        <Input
                                                            className="mt-2 h-11 text-base"
                                                            placeholder="Écrivez l'équipement"
                                                            value={item.custom}
                                                            onChange={(e) =>
                                                                setEquipmentGroups((groups) =>
                                                                    groups.map((g) =>
                                                                        g.id === group.id
                                                                            ? {
                                                                                  ...g,
                                                                                  items: g.items.map((it) =>
                                                                                      it.id === item.id
                                                                                          ? { ...it, custom: e.target.value }
                                                                                          : it,
                                                                                  ),
                                                                              }
                                                                            : g,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        setEquipmentGroups((groups) =>
                                                            groups.map((g) =>
                                                                g.id === group.id
                                                                    ? { ...g, items: g.items.filter((it) => it.id !== item.id) }
                                                                    : g,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setEquipmentGroups((groups) =>
                                                groups.map((g) =>
                                                    g.id === group.id
                                                        ? {
                                                              ...g,
                                                              items: [
                                                                  ...g.items,
                                                                  { id: crypto.randomUUID(), choice: itemOptions[0], custom: '' },
                                                              ],
                                                          }
                                                        : g,
                                                ),
                                            )
                                        }
                                    >
                                        + Ajouter un équipement dans cette catégorie
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setEquipmentGroups((groups) => [
                                ...groups,
                                { id: crypto.randomUUID(), categoryChoice: COMMON_EQUIPMENT_CATEGORIES[0], categoryCustom: '', items: [] },
                            ])
                        }
                    >
                        + Ajouter une catégorie d&apos;équipements
                    </Button>
                </Section>

                {state && 'error' in state && (
                    <p className="rounded-md bg-destructive/10 px-4 py-3 text-base text-destructive">{state.error}</p>
                )}

                <div className="flex items-center gap-3">
                    <Button type="submit" size="lg" className="h-12 px-6 text-base" disabled={pending}>
                        {pending ? 'Enregistrement...' : 'Enregistrer le véhicule'}
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-6 text-base" nativeButton={false} render={<Link href="/admin/vehicules" />}>
                        Annuler
                    </Button>
                </div>
            </form>
        </div>
    )
}
