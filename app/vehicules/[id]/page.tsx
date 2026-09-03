import { notFound } from 'next/navigation'
import { CalendarDays, ArrowRight, ShieldCheck } from 'lucide-react'
import { PageShell } from '@/components/site-pages'
import { getVehicle } from '@/lib/vehicles'

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const vehicle = getVehicle((await params).id)
  if (!vehicle) notFound()
  return <PageShell eyebrow={vehicle.status} title={<>{vehicle.name}<br /><em>{vehicle.meta}</em></>} intro="Un véhicule contrôlé et préparé avec soin par Planète Auto."><section className="page-section vehicle-detail-page"><img className="detail-main-image" src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} /><div className="detail-panel"><strong className="detail-price">{vehicle.price} <small>TTC</small></strong><div className="detail-specs"><span><b>Année</b>{vehicle.year}</span><span><b>Kilométrage</b>{vehicle.km}</span><span><b>Carburant</b>{vehicle.fuel}</span><span><b>Boîte</b>{vehicle.gearbox}</span></div><p className="detail-warranty"><ShieldCheck size={19} /> Véhicule contrôlé et préparé avant livraison.</p><a className="button button-red" href="/contact">Demander un essai <CalendarDays size={17} /></a></div></section></PageShell>
}
