'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    ArrowRight,
    ClipboardList,
    GripVertical,
    ImagePlus,
    Info,
    Loader2,
    Save,
    Sparkles,
    Trash2,
    UploadCloud,
    X,
} from 'lucide-react'
import BackToTopButton from '@/components/admin/back-to-top-button'
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

function Section({
    number,
    title,
    subtitle,
    icon: Icon,
    children,
}: {
    number: number
    title: string
    subtitle?: string
    icon: typeof Info
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7">
            <div className="flex items-center gap-4">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-sm shadow-primary/30">
                    <Icon className="size-5" />
                    <span className="absolute -bottom-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border-2 border-card bg-foreground text-[10px] font-bold text-background">
                        {number}
                    </span>
                </span>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
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
    const [toast, setToast] = useState<string | null>(null)

    useEffect(() => {
        if (state && 'error' in state) setToast(state.error)
    }, [state])

    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => setToast(null), 5000)
        return () => clearTimeout(timer)
    }, [toast])

    const [detailRows, setDetailRows] = useState<DetailRow[]>((vehicle?.details ?? []).map(toDetailRow))
    const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroupRow[]>(
        (vehicle?.equipment ?? []).map(toEquipmentGroupRow),
    )

    const [photos, setPhotos] = useState<Photo[]>(
        (vehicle?.gallery ?? []).map((url) => ({ id: url, url, kind: 'existing' })),
    )
    const newPhotosInputRef = useRef<HTMLInputElement>(null)
    const filePickerRef = useRef<HTMLInputElement>(null)
    const [isDropzoneActive, setIsDropzoneActive] = useState(false)

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

    function reorderPhoto(from: number, to: number) {
        setPhotos((current) => {
            if (from === to || from < 0 || to < 0 || from >= current.length || to >= current.length) return current
            const next = [...current]
            const [moved] = next.splice(from, 1)
            next.splice(to, 0, moved)
            return next
        })
    }

    function removePhoto(id: string) {
        setPhotos((current) => current.filter((photo) => photo.id !== id))
    }

    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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
            <BackToTopButton />

            {toast && (
                <div
                    role="alert"
                    className="fixed top-5 left-1/2 z-50 flex max-w-lg -translate-x-1/2 items-center gap-3 rounded-xl border border-destructive/30 bg-card px-4 py-3 text-sm font-medium text-destructive shadow-lg"
                >
                    {toast}
                    <button type="button" onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="size-4" />
                    </button>
                </div>
            )}

            <form
                action={formAction}
                onSubmit={(event) => {
                    if (photos.length === 0) {
                        event.preventDefault()
                        setToast('Au moins une photo est obligatoire.')
                    }
                }}
                className="flex flex-col gap-6"
            >
                {mode === 'edit' && vehicle && <input type="hidden" name="id" value={vehicle.id} />}

                <div className="sticky top-0 z-20 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 px-6 py-4 shadow-md backdrop-blur-sm">
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {mode === 'create' ? 'Nouveau véhicule' : `Réf. ${vehicle?.id}`}
                        </p>
                        <h1 className="truncate text-xl font-semibold text-foreground">
                            {mode === 'create' ? 'Ajouter un véhicule' : vehicle?.name}
                        </h1>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <Button variant="outline" nativeButton={false} render={<Link href="/admin/vehicules" />}>
                            <X className="size-4" />
                            Annuler
                        </Button>
                        <Button type="submit" className="gap-2 shadow-sm shadow-primary/30" disabled={pending}>
                            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            {pending ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </div>

                <Section number={1} title="Informations générales" subtitle="Les informations principales de l'annonce" icon={Info}>
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

                <Section number={2} title="Photos" subtitle="La première photo est utilisée comme photo principale" icon={ImagePlus}>
                    <p className="text-sm text-muted-foreground">
                        Ajoutez une ou plusieurs photos, puis glissez-déposez-les pour changer l&apos;ordre. La première
                        photo de la liste est celle utilisée comme photo principale (dans le stock et les résultats de
                        recherche).
                    </p>

                    <input ref={newPhotosInputRef} type="file" name="newPhotos" accept="image/*" multiple className="hidden" />
                    <input type="hidden" name="galleryOrder" value={galleryOrder} />

                    {photos.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    draggable
                                    onDragStart={() => setDragIndex(index)}
                                    onDragOver={(event) => {
                                        event.preventDefault()
                                        if (dragOverIndex !== index) setDragOverIndex(index)
                                    }}
                                    onDragLeave={() => setDragOverIndex((current) => (current === index ? null : current))}
                                    onDrop={(event) => {
                                        event.preventDefault()
                                        if (dragIndex !== null) reorderPhoto(dragIndex, index)
                                        setDragIndex(null)
                                        setDragOverIndex(null)
                                    }}
                                    onDragEnd={() => {
                                        setDragIndex(null)
                                        setDragOverIndex(null)
                                    }}
                                    className={`group relative flex cursor-grab flex-col gap-2 overflow-hidden rounded-xl border bg-muted/30 shadow-sm transition-all active:cursor-grabbing ${
                                        dragIndex === index
                                            ? 'opacity-40'
                                            : dragOverIndex === index
                                              ? 'border-primary ring-2 ring-primary/40'
                                              : 'border-border hover:shadow-md'
                                    }`}
                                >
                                    <div className="relative aspect-4/3 overflow-hidden bg-muted">
                                        <Image src={photo.url} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized={photo.kind === 'new'} />
                                        {index === 0 && (
                                            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                                                <Sparkles className="size-3" />
                                                Principale
                                            </span>
                                        )}
                                        <span className="absolute bottom-2 left-2 flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                            <GripVertical className="size-3.5" />
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(photo.id)}
                                            aria-label="Supprimer cette photo"
                                            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/80 text-destructive opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 px-2 pb-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            disabled={index === 0}
                                            onClick={() => movePhoto(index, -1)}
                                            aria-label="Déplacer vers la gauche"
                                        >
                                            <ArrowLeft className="size-4" />
                                        </Button>
                                        <span className="text-xs font-medium text-muted-foreground">{index + 1}/{photos.length}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            disabled={index === photos.length - 1}
                                            onClick={() => movePhoto(index, 1)}
                                            aria-label="Déplacer vers la droite"
                                        >
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-base">Ajouter des photos</Label>
                        <div
                            onDragOver={(event) => {
                                event.preventDefault()
                                setIsDropzoneActive(true)
                            }}
                            onDragLeave={() => setIsDropzoneActive(false)}
                            onDrop={(event) => {
                                event.preventDefault()
                                setIsDropzoneActive(false)
                                addPhotos(event.dataTransfer.files)
                            }}
                            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                                isDropzoneActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
                            }`}
                        >
                            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UploadCloud className="size-5" />
                            </span>
                            <p className="text-sm font-medium text-foreground">Glissez vos photos ici</p>
                            <p className="text-xs text-muted-foreground">ou</p>
                            <Button type="button" variant="outline" onClick={() => filePickerRef.current?.click()}>
                                Parcourir mes fichiers
                            </Button>
                            <input
                                ref={filePickerRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    addPhotos(e.target.files)
                                    e.target.value = ''
                                }}
                            />
                        </div>
                    </div>
                </Section>

                <Section number={3} title="Fiche technique" subtitle="Les caractéristiques affichées sur l'annonce" icon={ClipboardList}>
                    <p className="text-sm text-muted-foreground">
                        Choisissez une caractéristique dans la liste, ou sélectionnez « Autre » pour en écrire une nouvelle.
                    </p>
                    <input type="hidden" name="details" value={JSON.stringify(details)} />
                    <div className="flex flex-col gap-2">
                        {detailRows.length > 0 && (
                            <div className="hidden gap-3 px-1 sm:grid sm:grid-cols-[1fr_1fr_auto]">
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Libellé</Label>
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Valeur</Label>
                                <span />
                            </div>
                        )}
                        {detailRows.map((row) => (
                            <div key={row.id} className="grid grid-cols-1 items-start gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                                <div className="flex flex-col gap-1.5">
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
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="justify-self-end text-muted-foreground hover:text-destructive"
                                    onClick={() => setDetailRows((rows) => rows.filter((r) => r.id !== row.id))}
                                    aria-label="Supprimer cette ligne"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-fit"
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

                <Section number={4} title="Équipements" subtitle="Les équipements regroupés par catégorie" icon={Sparkles}>
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
                                <div key={group.id} className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <div className="flex flex-1 flex-col gap-1.5">
                                            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Catégorie</Label>
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
                                            variant="ghost"
                                            size="icon-sm"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => setEquipmentGroups((groups) => groups.filter((g) => g.id !== group.id))}
                                            aria-label="Supprimer cette catégorie"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-2 border-l-2 border-border pl-4">
                                        {group.items.map((item) => (
                                            <div key={item.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="shrink-0 self-start text-muted-foreground hover:text-destructive sm:self-center"
                                                    onClick={() =>
                                                        setEquipmentGroups((groups) =>
                                                            groups.map((g) =>
                                                                g.id === group.id
                                                                    ? { ...g, items: g.items.filter((it) => it.id !== item.id) }
                                                                    : g,
                                                            ),
                                                        )
                                                    }
                                                    aria-label="Supprimer cet équipement"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-fit"
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
                        className="w-fit"
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

                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" nativeButton={false} render={<Link href="/admin/vehicules" />}>
                        <X className="size-4" />
                        Annuler
                    </Button>
                    <Button type="submit" size="lg" className="h-12 gap-2 px-6 text-base shadow-sm shadow-primary/30" disabled={pending}>
                        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        {pending ? 'Enregistrement...' : 'Enregistrer le véhicule'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
