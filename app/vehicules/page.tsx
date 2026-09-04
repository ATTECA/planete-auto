'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronDown, Heart, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { SiteFooter, SiteHeader } from '@/components/site-pages'
import { vehicles } from '@/lib/vehicles'

const filters = ['Tous les véhicules', 'Moins de 10 000 €', 'Moins de 50 000 km']

export default function VehiclesPage() {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [sort, setSort] = useState('Recommandés')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const filteredVehicles = useMemo(() => {
    const result = vehicles.filter((vehicle) => `${vehicle.name} ${vehicle.meta}`.toLowerCase().includes(query.toLowerCase())).filter((vehicle) => activeFilter === filters[1] ? Number(vehicle.price.replace(/\D/g, '')) < 10000 : activeFilter === filters[2] ? Number(vehicle.km.replace(/\D/g, '')) < 50000 : true)
    return [...result].sort((a, b) => sort === 'Prix croissant' ? Number(a.price.replace(/\D/g, '')) - Number(b.price.replace(/\D/g, '')) : sort === 'Prix décroissant' ? Number(b.price.replace(/\D/g, '')) - Number(a.price.replace(/\D/g, '')) : 0)
  }, [activeFilter, query, sort])
  return <div className="inventory-page-shell"><SiteHeader /><main>
    <section className="inventory-hero"><div className="inventory-shell inventory-hero-inner"><div><p className="inventory-kicker"><Sparkles aria-hidden="true" /> Le stock Planète Auto</p><h1>Des véhicules choisis<br /><em>pour durer.</em></h1><p>Une sélection contrôlée, transparente et prête à prendre la route.</p></div><div className="inventory-hero-stat"><strong>{vehicles.length}</strong><span>véhicules<br />disponibles</span></div></div></section>
    <section className="inventory-shell inventory-content" aria-labelledby="inventory-title"><div className="inventory-heading-row"><div><p className="inventory-kicker inventory-kicker-dark">Collection actuelle</p><h2 id="inventory-title">Trouvez votre prochaine voiture</h2></div><p className="inventory-count"><strong>{filteredVehicles.length}</strong> résultat{filteredVehicles.length > 1 ? 's' : ''}</p></div>
      <div className="inventory-toolbar"><label className="inventory-search"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une marque ou un modèle" aria-label="Rechercher un véhicule" /></label><label className="inventory-sort"><SlidersHorizontal aria-hidden="true" /><span>Trier par</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Trier les véhicules"><option>Recommandés</option><option>Prix croissant</option><option>Prix décroissant</option></select><ChevronDown aria-hidden="true" /></label></div>
      <div className="inventory-filter-row" role="group" aria-label="Filtres de véhicules">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'is-active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
      {filteredVehicles.length ? <div className="inventory-grid">{filteredVehicles.map((vehicle, index) => { const favorite = favorites.includes(vehicle.id); return <article className="inventory-card" key={vehicle.id}><Link href={`/vehicules/${vehicle.id}`} className="inventory-card-image"><Image src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={index < 2} /><span className="inventory-card-tag">{vehicle.tag}</span><button type="button" className={`inventory-favorite ${favorite ? 'is-favorite' : ''}`} aria-label={`${favorite ? 'Retirer' : 'Ajouter'} ${vehicle.name} des favoris`} onClick={(event) => { event.preventDefault(); setFavorites((current) => favorite ? current.filter((id) => id !== vehicle.id) : [...current, vehicle.id]) }}><Heart fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" /></button></Link><div className="inventory-card-body"><p className="inventory-card-year">{vehicle.year} · {vehicle.km}</p><div className="inventory-card-top"><div><h3>{vehicle.name}</h3><p>{vehicle.meta}</p></div><strong>{vehicle.price}</strong></div><div className="inventory-card-bottom"><span>{vehicle.fuel}</span><span>{vehicle.gearbox}</span><Link href={`/vehicules/${vehicle.id}`}>Voir le véhicule <ArrowUpRight aria-hidden="true" /></Link></div></div></article> })}</div> : <div className="inventory-empty"><h3>Aucun véhicule ne correspond à votre recherche.</h3><button onClick={() => { setQuery(''); setActiveFilter(filters[0]) }}>Réinitialiser les filtres</button></div>}
    </section></main><SiteFooter /></div>
}
