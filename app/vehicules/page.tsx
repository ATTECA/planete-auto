import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageShell } from '@/components/site-pages'
import { vehicles } from '@/lib/vehicles'

export default function VehiclesPage() {
  return <PageShell eyebrow="Le stock Planète Auto" title={<>Nos véhicules<br /><em>disponibles.</em></>} intro="Découvrez notre sélection de véhicules d'occasion contrôlés, préparés et prêts à prendre la route."><section className="page-section vehicle-list-page"><div className="vehicle-grid">{vehicles.map((vehicle) => <article className="vehicle-card" key={vehicle.id}><div className="vehicle-image"><img src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} /><span className="vehicle-tag">{vehicle.tag}</span></div><div className="vehicle-info"><span className="card-kicker">{vehicle.status}</span><h3>{vehicle.name}</h3><p>{vehicle.meta}</p><div className="vehicle-meta"><span>{vehicle.year}</span><span>{vehicle.km}</span><span>{vehicle.fuel}</span></div><strong>{vehicle.price}</strong><Link className="vehicle-link" href={`/vehicules/${vehicle.id}`}>Voir le véhicule <ArrowRight size={16} /></Link></div></article>)}</div></section></PageShell>
}
