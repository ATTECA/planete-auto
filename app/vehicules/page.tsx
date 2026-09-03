import Link from 'next/link'
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react'
import { PageShell } from '@/components/site-pages'
import { vehicles } from '@/lib/vehicles'

export default function VehiclesPage() {
  return <PageShell eyebrow="Le stock Planète Auto" title={<>La sélection<br /><em>du moment.</em></>} intro="Des véhicules d'occasion choisis pour leur histoire, leur état et le plaisir qu'ils promettent sur la route."><section className="inventory-page"><div className="inventory-toolbar"><div><span className="inventory-count">{vehicles.length} véhicules disponibles</span><h2>Nos occasions</h2></div><button className="inventory-filter"><SlidersHorizontal size={16} /> Filtrer et trier</button></div><div className="inventory-grid">{vehicles.map((vehicle, index) => <Link className={`inventory-card ${index === 0 ? 'inventory-card-featured' : ''}`} key={vehicle.id} href={`/vehicules/${vehicle.id}`}><div className="inventory-image"><img src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} /><span>{vehicle.tag}</span><ArrowUpRight className="inventory-arrow" size={22} /></div><div className="inventory-card-copy"><div><span className="card-kicker">{vehicle.status}</span><h3>{vehicle.name}</h3><p>{vehicle.meta}</p></div><div className="inventory-bottom"><span>{vehicle.year} · {vehicle.km} · {vehicle.fuel}</span><strong>{vehicle.price}</strong></div></div></Link>)}</div></section></PageShell>
}
