import { getVehicles, getVehiclesAdmin, vehicleStatusCategory } from '@/lib/vehicles'
import { getLeads } from '@/lib/leads'
import StatCard from '@/components/admin/stat-card'
import AlertsPanel, { type AlertItem } from '@/components/admin/alerts-panel'
import LatestMessages, { type LatestMessageItem } from '@/components/admin/latest-messages'
import RecentActivity from '@/components/admin/recent-activity'
import StatusDonut, { type StatusSlice } from '@/components/admin/charts/status-donut'
import LeadsAreaChart, { type DayPoint } from '@/components/admin/charts/leads-area-chart'
import VehiclesBarChart, { type WeekPoint } from '@/components/admin/charts/vehicles-bar-chart'
import { Archive, Car, Clock, ImageOff, MessageSquare, RefreshCcw, Tag } from 'lucide-react'

const STALE_LEAD_DAYS = 2
const STOCK_TOO_LONG_DAYS = 60

const DAY_MS = 24 * 60 * 60 * 1000

/** How many entries fall within the last `days`, counting from now. */
function countWithinDays(dates: string[], days: number) {
    const cutoff = Date.now() - days * DAY_MS
    return dates.filter((d) => new Date(d).getTime() >= cutoff).length
}

/** Entries between `days` and `2*days` ago, i.e. the comparison window just before "this week". */
function countPriorDays(dates: string[], days: number) {
    const now = Date.now()
    const start = now - 2 * days * DAY_MS
    const end = now - days * DAY_MS
    return dates.filter((d) => {
        const t = new Date(d).getTime()
        return t >= start && t < end
    }).length
}

/** One point per day for the last `days` days (oldest first), counting how many `dates` fall on each day. */
function dailyBuckets(dates: string[], days: number): DayPoint[] {
    const points: DayPoint[] = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
        const day = new Date(now)
        day.setDate(day.getDate() - i)
        const key = day.toDateString()
        const count = dates.filter((d) => new Date(d).toDateString() === key).length
        points.push({
            date: key,
            count,
            label: day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        })
    }
    return points
}

/** One point per week for the last `weeks` weeks (oldest first), counting how many `dates` fall in each 7-day bucket. */
function weeklyBuckets(dates: string[], weeks: number): WeekPoint[] {
    const points: WeekPoint[] = []
    const now = Date.now()
    for (let i = weeks - 1; i >= 0; i--) {
        const end = now - i * 7 * DAY_MS
        const start = end - 7 * DAY_MS
        const count = dates.filter((d) => {
            const t = new Date(d).getTime()
            return t >= start && t < end
        }).length
        const endDate = new Date(end)
        points.push({
            label: endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            count,
        })
    }
    return points
}

export default async function AdminDashboardPage() {
    const [vehicles, allVehicles, messageLeads, repriseLeads] = await Promise.all([
        getVehicles(),
        getVehiclesAdmin(),
        getLeads(['contact', 'offer', 'essai']),
        getLeads(['reprise']),
    ])

    const soldVehicles = vehicles.filter((v) => v.status?.toLowerCase().includes('vendu'))
    const newMessagesCount = messageLeads.filter((lead) => lead.status === 'Nouveau').length
    const newReprisesCount = repriseLeads.filter((lead) => lead.status === 'Nouveau').length

    const vehicleDates = vehicles.map((v) => v.createdAt)
    const messageDates = messageLeads.map((l) => l.createdAt)
    const repriseDates = repriseLeads.map((l) => l.createdAt)
    const allLeadDates = [...messageDates, ...repriseDates]

    const stats = [
        {
            label: 'Véhicules en stock',
            value: vehicles.length,
            icon: Car,
            href: '/admin/vehicules',
            accent: 'text-foreground bg-foreground/5',
            trend: { delta: countWithinDays(vehicleDates, 7) - countPriorDays(vehicleDates, 7), label: 'cette semaine' },
        },
        {
            label: 'Nouveaux messages',
            value: newMessagesCount,
            icon: MessageSquare,
            href: '/admin/messages',
            accent: 'text-orange-700 bg-orange-100',
            trend: { delta: countWithinDays(messageDates, 7) - countPriorDays(messageDates, 7), label: 'cette semaine' },
        },
        {
            label: 'Nouvelles reprises',
            value: newReprisesCount,
            icon: RefreshCcw,
            href: '/admin/reprises',
            accent: 'text-purple-700 bg-purple-100',
            trend: { delta: countWithinDays(repriseDates, 7) - countPriorDays(repriseDates, 7), label: 'cette semaine' },
        },
        {
            label: 'Véhicules vendus',
            value: soldVehicles.length,
            icon: Tag,
            href: '/admin/vehicules',
            accent: 'text-blue-700 bg-blue-100',
        },
    ]

    const statusCounts = { disponible: 0, reserve: 0, vendu: 0, archive: 0, autre: 0 }
    for (const vehicle of allVehicles) statusCounts[vehicleStatusCategory(vehicle.status)]++

    const statusSlices: StatusSlice[] = [
        { key: 'disponible', label: 'Disponible', value: statusCounts.disponible, colorClass: 'bg-green-600', hex: '#16a34a' },
        { key: 'reserve', label: 'Réservé', value: statusCounts.reserve, colorClass: 'bg-orange-400', hex: '#fb923c' },
        { key: 'vendu', label: 'Vendu', value: statusCounts.vendu, colorClass: 'bg-blue-600', hex: '#2563eb' },
        { key: 'archive', label: 'Archivé', value: statusCounts.archive, colorClass: 'bg-purple-600', hex: '#9333ea' },
    ]

    const leadsDaily = dailyBuckets(allLeadDates, 30)
    const vehiclesWeekly = weeklyBuckets(allVehicles.map((v) => v.createdAt), 8)

    const staleCutoff = Date.now() - STALE_LEAD_DAYS * DAY_MS
    const staleLeadsCount = [...messageLeads, ...repriseLeads].filter(
        (lead) => lead.status !== 'Traité' && new Date(lead.createdAt).getTime() < staleCutoff,
    ).length

    const noPhotoCount = vehicles.filter((v) => !v.image && v.gallery.length === 0).length

    const stockCutoff = Date.now() - STOCK_TOO_LONG_DAYS * DAY_MS
    const stockTooLongCount = vehicles.filter(
        (v) => !v.status?.toLowerCase().includes('vendu') && new Date(v.createdAt).getTime() < stockCutoff,
    ).length

    const alerts: AlertItem[] = [
        {
            key: 'stale-leads',
            label: 'demande(s) sans réponse',
            detail: `En attente depuis plus de ${STALE_LEAD_DAYS} jours`,
            count: staleLeadsCount,
            href: '/admin/messages',
            icon: Clock,
        },
        {
            key: 'sold-not-archived',
            label: 'véhicule(s) vendu(s) à archiver',
            detail: 'Toujours visibles sur le site public',
            count: soldVehicles.length,
            href: '/admin/vehicules',
            icon: Archive,
        },
        {
            key: 'no-photo',
            label: 'véhicule(s) sans photo',
            detail: 'Aucune image ajoutée',
            count: noPhotoCount,
            href: '/admin/vehicules',
            icon: ImageOff,
        },
        {
            key: 'stock-too-long',
            label: 'véhicule(s) en stock depuis longtemps',
            detail: `Plus de ${STOCK_TOO_LONG_DAYS} jours sans être vendus`,
            count: stockTooLongCount,
            href: '/admin/vehicules',
            icon: Tag,
        },
    ]

    const typeLabels: Record<string, string> = { contact: 'Contact', offer: 'Offre', essai: 'Essai', reprise: 'Reprise' }
    const latestMessages: LatestMessageItem[] = [...messageLeads, ...repriseLeads]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((lead) => ({
            id: lead.id,
            name: lead.name,
            typeLabel: typeLabels[lead.type] ?? lead.type,
            status: lead.status,
            date: new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            href: lead.type === 'reprise' ? '/admin/reprises' : '/admin/messages',
        }))

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-foreground">Tableau de bord</h1>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Répartition du stock</h2>
                        <p className="text-sm text-muted-foreground">Par statut</p>
                    </div>
                    <StatusDonut slices={statusSlices} />
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Demandes reçues</h2>
                        <p className="text-sm text-muted-foreground">30 derniers jours</p>
                    </div>
                    <LeadsAreaChart points={leadsDaily} />
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Véhicules ajoutés</h2>
                        <p className="text-sm text-muted-foreground">8 dernières semaines</p>
                    </div>
                    <VehiclesBarChart points={vehiclesWeekly} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <AlertsPanel items={alerts} />
                <LatestMessages items={latestMessages} />
            </div>

            <RecentActivity vehicles={allVehicles} />
        </div>
    )
}
