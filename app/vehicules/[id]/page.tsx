import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, Clock3, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { getVehicle } from '@/lib/vehicles'
import { SiteFooter, SiteHeader } from '@/components/site-pages'
import { VehicleGallery } from '@/components/vehicle-gallery'

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const vehicle = getVehicle((await params).id)
  if (!vehicle) notFound()
  const gallery = vehicle.gallery.length ? vehicle.gallery : [vehicle.image]
  return <main className="vehicle-detail-page"><SiteHeader /><div className="vehicle-detail-shell">
    <div className="vehicle-breadcrumb"><Link href="/vehicules"><ArrowLeft /> Retour au stock</Link><span>Planète Auto <b>/</b> {vehicle.name} <b>/</b> Réf. {vehicle.details?.find(([label]) => label === 'Référence')?.[1] ?? vehicle.id}</span></div>
    <div className="vehicle-detail-layout"><VehicleGallery name={vehicle.name} meta={vehicle.meta} images={gallery} /><aside className="vehicle-purchase"><div className="vehicle-purchase-top"><span className="vehicle-status">{vehicle.status}</span><span className="vehicle-ref">Réf. {vehicle.details?.find(([label]) => label === 'Référence')?.[1] ?? vehicle.id}</span></div><p className="vehicle-detail-eyebrow">{vehicle.year} · {vehicle.fuel} · {vehicle.gearbox}</p><h1>{vehicle.name}</h1><p className="vehicle-version">{vehicle.meta}</p><div className="purchase-rule" /><strong className="showroom-price">{vehicle.price}</strong><div className="vehicle-summary"><span>{vehicle.km}</span><span>{vehicle.fuel}</span><span>{vehicle.gearbox}</span></div><Link className="button button-red showroom-cta" href="/contact">Parler de ce véhicule <ArrowUpRight /></Link><div className="showroom-trust"><ShieldCheck /><span>Véhicule contrôlé et préparé par Planète Auto</span></div><div className="vehicle-finance"><Clock3 /><span>Une question ? Notre équipe vous répond au <a href="tel:+33467825412">04 67 82 54 12</a></span></div></aside></div>
    <section className="vehicle-facts"><div className="vehicle-facts-heading"><span className="eyebrow"><span className="eyebrow-line" /> Fiche technique</span><h2>Tout savoir<br /><em>avant de décider.</em></h2><p>Une information claire et complète pour avancer dans votre projet automobile en toute confiance.</p></div><div className="facts-grid">{vehicle.details?.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
    <section className="vehicle-description"><div><span className="eyebrow"><span className="eyebrow-line" /> L'histoire du véhicule</span><h2>Une occasion qui mérite<br /><em>votre attention.</em></h2></div><div><p>Ce {vehicle.name} {vehicle.meta} a été sélectionné avec soin par Planète Auto. Il vous est présenté dans un état soigné, avec une préparation attentive avant sa remise des clés.</p><p>Notre équipe est disponible pour vous présenter le véhicule, répondre à vos questions et organiser un rendez-vous à Saint-Jean-de-Védas.</p><Link className="text-link" href="/contact">Échanger avec notre équipe <ArrowUpRight /></Link></div></section>
  </div><SiteFooter /></main>
}
