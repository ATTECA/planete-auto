'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { LEAD_STATUSES, type Lead, type LeadStatus } from '@/lib/leads'
import { useToast } from '@/components/admin/toast-provider'
import LeadCard, { typeLabel, typeStyle } from './lead-card'

/** Lowercase, accent-free and space-free, so "Héléne" matches "helene" and "06 12" matches "0612". */
function normalize(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '')
}

function searchableText(lead: Lead): string {
    return normalize([lead.name, lead.phone, lead.email, lead.vehicleName, lead.message, ...Object.values(lead.details)].filter(Boolean).join(' '))
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-border bg-card text-foreground hover:bg-muted'
            }`}
        >
            {children}
        </button>
    )
}

export default function LeadList({ leads: allLeads, emptyText }: { leads: Lead[]; emptyText: string }) {
    const { isPendingDelete } = useToast()
    // Requests waiting out their "Annuler" delay are already hidden, counts included.
    const leads = useMemo(() => allLeads.filter((lead) => !isPendingDelete(`lead-${lead.id}`)), [allLeads, isPendingDelete])
    const [query, setQuery] = useState('')
    const [type, setType] = useState<string | null>(null)
    const [status, setStatus] = useState<LeadStatus | null>(null)

    const types = useMemo(() => {
        const counts = new Map<string, number>()
        for (const lead of leads) counts.set(typeLabel(lead), (counts.get(typeLabel(lead)) ?? 0) + 1)
        return [...counts.entries()]
    }, [leads])

    const filtered = useMemo(() => {
        const q = normalize(query)
        return leads.filter(
            (lead) =>
                (!type || typeLabel(lead) === type) &&
                (!status || lead.status === status) &&
                (!q || searchableText(lead).includes(q)),
        )
    }, [leads, query, type, status])

    if (leads.length === 0) {
        return (
            <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">{emptyText}</CardContent>
            </Card>
        )
    }

    const hasFilters = query !== '' || type !== null || status !== null

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Rechercher un nom, un téléphone, un véhicule…"
                        className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                </div>

                {types.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        <FilterChip active={type === null} onClick={() => setType(null)}>
                            Tous les types <span className="opacity-60">{leads.length}</span>
                        </FilterChip>
                        {types.map(([label, count]) => {
                            const Icon = typeStyle(label).icon
                            return (
                                <FilterChip key={label} active={type === label} onClick={() => setType(type === label ? null : label)}>
                                    <Icon className="size-3.5" aria-hidden /> {label} <span className="opacity-60">{count}</span>
                                </FilterChip>
                            )
                        })}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    <FilterChip active={status === null} onClick={() => setStatus(null)}>
                        Tous les statuts
                    </FilterChip>
                    {LEAD_STATUSES.map((value) => (
                        <FilterChip key={value} active={status === value} onClick={() => setStatus(status === value ? null : value)}>
                            {value} <span className="opacity-60">{leads.filter((lead) => lead.status === value).length}</span>
                        </FilterChip>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
                        Aucun résultat pour cette recherche.
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('')
                                setType(null)
                                setStatus(null)
                            }}
                            className="inline-flex items-center gap-1 font-semibold text-foreground underline"
                        >
                            <X className="size-3.5" /> Effacer les filtres
                        </button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {hasFilters && (
                        <p className="text-sm text-muted-foreground">
                            {filtered.length} résultat{filtered.length > 1 ? 's' : ''} sur {leads.length}
                        </p>
                    )}
                    <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
                        {filtered.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
