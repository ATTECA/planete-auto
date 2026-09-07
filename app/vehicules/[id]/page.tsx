import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowUpRight, Check, Clock3, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { getVehicle } from '@/lib/vehicles'
import { SiteFooter, SiteHeader } from '@/components/site-pages'
import { VehicleGallery } from '@/components/vehicle-gallery'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const vehicle = getVehicle((await params).id)
  if (!vehicle) return { title: 'Véhicule introuvable' }
  return {
    title: `${vehicle.name} ${vehicle.meta}`,
    description: `${vehicle.name} ${vehicle.meta}, ${vehicle.year}, ${vehicle.km}, ${vehicle.fuel} et ${vehicle.gearbox}. Consultez la fiche et contactez Planète Auto à Saint-Jean-de-Védas.`,
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const vehicle = getVehicle((await params).id)
  if (!vehicle) notFound()
  const gallery = vehicle.gallery.length ? vehicle.gallery : [vehicle.image]
  return <main className="vehicle-detail-page"><SiteHeader /><div className="vehicle-detail-shell">
    <div className="vehicle-breadcrumb"><Link href="/vehicules"><ArrowLeft /> Retour au stock</Link><span>Planète Auto <b>/</b> {vehicle.name} <b>/</b> Réf. {vehicle.details?.find(([label]) => label === 'Référence')?.[1] ?? vehicle.id}</span></div>
    <div className="vehicle-detail-layout"><VehicleGallery name={vehicle.name} meta={vehicle.meta} images={gallery} /><aside className="vehicle-purchase"><div className="vehicle-purchase-top"><span className="vehicle-status">{vehicle.status}</span><span className="vehicle-ref">Réf. {vehicle.details?.find(([label]) => label === 'Référence')?.[1] ?? vehicle.id}</span></div><p className="vehicle-detail-eyebrow">{vehicle.year} · {vehicle.fuel} · {vehicle.gearbox}</p><h1>{vehicle.name}</h1><p className="vehicle-version">{vehicle.meta}</p><div className="purchase-rule" /><strong className="showroom-price">{vehicle.price}</strong><div className="vehicle-summary"><span>{vehicle.km}</span><span>{vehicle.fuel}</span><span>{vehicle.gearbox}</span></div><Link className="button button-red showroom-cta" href="/contact">Parler de ce véhicule <ArrowUpRight /></Link><div className="showroom-trust"><ShieldCheck /><span>Véhicule contrôlé et préparé par Planète Auto</span></div><div className="vehicle-finance"><Clock3 /><span>Une question ? Notre équipe vous répond au <a href="tel:+33467825412">04 67 82 54 12</a></span></div></aside></div>
    <section className="vehicle-facts"><div className="vehicle-facts-heading"><span className="eyebrow"><span className="eyebrow-line" /> Fiche technique</span></div><div className="facts-grid">{vehicle.details?.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
    <section className="vehicle-description"><div><span className="eyebrow"><span className="eyebrow-line" /> Description du véhicule</span></div><div><p className="vehicle-description-copy">{vehicle.description ?? `${vehicle.name} ${vehicle.meta}, disponible chez Planète Auto à Saint-Jean-de-Védas. Contactez-nous pour connaître les détails du véhicule, organiser une visite ou étudier une reprise.`}</p><Link className="text-link" href="/contact">Poser une question sur ce véhicule <ArrowUpRight /></Link></div></section>
  </div><SiteFooter /></main>
}
