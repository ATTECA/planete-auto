'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Heart, Search, Sparkles } from 'lucide-react'
import { SiteFooter, SiteHeader } from '@/components/site-pages'
import type { Vehicle } from '@/lib/vehicles'

const getDetail = (vehicle: Vehicle, label: string) => vehicle.details.find(([key]) => key === label)?.[1] ?? ''

export default function VehiclesPageClient({ vehicles }: { vehicles: Vehicle[] }) {
  const prices = useMemo(() => vehicles.map((vehicle) => Number(vehicle.price.replace(/\D/g, ''))), [vehicles])
  const years = useMemo(() => vehicles.map((vehicle) => Number(vehicle.year)), [vehicles])
  const mileages = useMemo(() => vehicles.map((vehicle) => Number(vehicle.km.replace(/\D/g, ''))), [vehicles])
  const filterOptions = useMemo(() => ({
    brands: [...new Set(vehicles.map((vehicle) => getDetail(vehicle, 'Marque')))],
    models: [...new Set(vehicles.map((vehicle) => getDetail(vehicle, 'Modèle')))],
    fuels: [...new Set(vehicles.map((vehicle) => vehicle.fuel))],
    gearboxes: [...new Set(vehicles.map((vehicle) => vehicle.gearbox))],
    colors: [...new Set(vehicles.map((vehicle) => getDetail(vehicle, 'Couleur')))],
  }), [vehicles])

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [fuel, setFuel] = useState('')
  const [gearbox, setGearbox] = useState('')
  const [color, setColor] = useState('')
  const [maxPrice, setMaxPrice] = useState(() => Math.max(...prices))
  const [yearFrom, setYearFrom] = useState(() => Math.min(...years))
  const [yearTo, setYearTo] = useState(() => Math.max(...years))
  const [maxMileage, setMaxMileage] = useState(() => Math.max(...mileages))
  const [sort, setSort] = useState('Recommandés')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredVehicles = useMemo(() => {
    const result = vehicles.filter((vehicle) => {
      const price = Number(vehicle.price.replace(/\D/g, ''))
      const year = Number(vehicle.year)
      const mileage = Number(vehicle.km.replace(/\D/g, ''))
      return `${vehicle.name} ${vehicle.meta}`.toLowerCase().includes(query.toLowerCase())
        && (!brand || getDetail(vehicle, 'Marque') === brand)
        && (!model || getDetail(vehicle, 'Modèle') === model)
        && (!fuel || vehicle.fuel === fuel)
        && (!gearbox || vehicle.gearbox === gearbox)
        && (!color || getDetail(vehicle, 'Couleur') === color)
        && price <= maxPrice
        && year >= yearFrom && year <= yearTo
        && mileage <= maxMileage
    })
    return [...result].sort((a, b) => sort === 'Prix croissant'
      ? Number(a.price.replace(/\D/g, '')) - Number(b.price.replace(/\D/g, ''))
      : sort === 'Prix décroissant'
        ? Number(b.price.replace(/\D/g, '')) - Number(a.price.replace(/\D/g, ''))
        : 0)
  }, [vehicles, brand, color, fuel, gearbox, maxMileage, maxPrice, model, query, sort, yearFrom, yearTo])

  const resetFilters = () => {
    setBrand('')
    setModel('')
    setFuel('')
    setGearbox('')
    setColor('')
    setMaxPrice(Math.max(...prices))
    setYearFrom(Math.min(...years))
    setYearTo(Math.max(...years))
    setMaxMileage(Math.max(...mileages))
    setQuery('')
  }

  return <div className="inventory-page-shell">
    <SiteHeader />
    <main>
      <section className="inventory-hero"><div className="inventory-shell inventory-hero-inner"><div><p className="inventory-kicker"><Sparkles aria-hidden="true" /> Le stock Planète Auto</p><h1>Des véhicules d’occasion<br /><em>toutes marques.</em></h1><p>Découvrez les véhicules disponibles à Saint-Jean-de-Védas et trouvez celui qui correspond à votre budget.</p></div><div className="inventory-hero-stat"><strong>{vehicles.length}</strong><span>véhicules<br />disponibles</span></div></div></section>
      <section className="inventory-shell inventory-content" aria-labelledby="inventory-title">
        <div className="inventory-heading-row"><div><p className="inventory-kicker inventory-kicker-dark">Collection actuelle</p><h2 id="inventory-title">Trouvez votre prochaine voiture</h2></div><p className="inventory-count"><strong>{filteredVehicles.length}</strong> résultat{filteredVehicles.length > 1 ? 's' : ''}</p></div>
        <div className="inventory-layout">
          <aside className="inventory-filters" aria-label="Filtres de véhicules">
            <div className="inventory-filters-header"><h3>Filtrer les véhicules</h3><button type="button" onClick={resetFilters}>Réinitialiser</button></div>
            <label className="inventory-filter-field">Marque<select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">Toutes les marques</option>{filterOptions.brands.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="inventory-filter-field">Modèle<select value={model} onChange={(event) => setModel(event.target.value)}><option value="">Tous les modèles</option>{filterOptions.models.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="inventory-filter-field">Carburant<select value={fuel} onChange={(event) => setFuel(event.target.value)}><option value="">Tous les carburants</option>{filterOptions.fuels.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="inventory-filter-field">Boîte de vitesses<select value={gearbox} onChange={(event) => setGearbox(event.target.value)}><option value="">Toutes les boîtes</option>{filterOptions.gearboxes.map((option) => <option key={option}>{option}</option>)}</select></label>
            <div className="inventory-range-field"><div><span>Prix maximum</span><strong>{maxPrice.toLocaleString('fr-FR')} €</strong></div><input type="range" min={Math.min(...prices)} max={Math.max(...prices)} step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Prix maximum" /></div>
            <div className="inventory-range-field"><div><span>Année</span><strong>{yearFrom} - {yearTo}</strong></div><input type="range" min={Math.min(...years)} max={Math.max(...years)} value={yearFrom} onChange={(event) => setYearFrom(Math.min(Number(event.target.value), yearTo))} aria-label="Année depuis" /><input type="range" min={Math.min(...years)} max={Math.max(...years)} value={yearTo} onChange={(event) => setYearTo(Math.max(Number(event.target.value), yearFrom))} aria-label="Année jusqu'à" /></div>
            <div className="inventory-range-field"><div><span>Kilométrage maximum</span><strong>{maxMileage.toLocaleString('fr-FR')} km</strong></div><input type="range" min={Math.min(...mileages)} max={Math.max(...mileages)} step="1000" value={maxMileage} onChange={(event) => setMaxMileage(Number(event.target.value))} aria-label="Kilométrage maximum" /></div>
            <label className="inventory-filter-field">Couleur<select value={color} onChange={(event) => setColor(event.target.value)}><option value="">Toutes les couleurs</option>{filterOptions.colors.map((option) => <option key={option}>{option}</option>)}</select></label>
          </aside>
          <div className="inventory-results">
            <div className="inventory-toolbar"><label className="inventory-search"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une marque ou un modèle" aria-label="Rechercher un véhicule" /></label><label className="inventory-sort"><span>Trier par</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Trier les véhicules"><option>Recommandés</option><option>Prix croissant</option><option>Prix décroissant</option></select></label></div>
            {filteredVehicles.length ? <div className="inventory-grid">{filteredVehicles.map((vehicle, index) => { const favorite = favorites.includes(vehicle.id); return <article className="inventory-card" key={vehicle.id}><Link href={`/vehicules/${vehicle.id}`} className="inventory-card-image"><Image src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={index < 2} /><span className="inventory-card-tag">{vehicle.tag}</span><button type="button" className={`inventory-favorite ${favorite ? 'is-favorite' : ''}`} aria-label={`${favorite ? 'Retirer' : 'Ajouter'} ${vehicle.name} des favoris`} onClick={(event) => { event.preventDefault(); setFavorites((current) => favorite ? current.filter((id) => id !== vehicle.id) : [...current, vehicle.id]) }}><Heart fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" /></button></Link><div className="inventory-card-body"><p className="inventory-card-year">{vehicle.year} · {vehicle.km}</p><div className="inventory-card-top"><div><h3>{vehicle.name}</h3><p>{vehicle.meta}</p></div><strong>{vehicle.price}</strong></div><div className="inventory-card-bottom"><span>{vehicle.fuel}</span><span>{vehicle.gearbox}</span><Link href={`/vehicules/${vehicle.id}`}>Voir le véhicule <ArrowUpRight aria-hidden="true" /></Link></div></div></article> })}</div> : <div className="inventory-empty"><h3>Aucun véhicule ne correspond à votre recherche.</h3><button type="button" onClick={resetFilters}>Réinitialiser les filtres</button></div>}
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
}
