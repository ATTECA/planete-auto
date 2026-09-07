'use client'

import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  Phone,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react'
import { ServiceCard, SiteFooter } from '@/components/site-pages'
import { vehicles } from '@/lib/vehicles'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Variation%20logo%20principale%20%283%29-KVWe2Eco22lDkGQ3c9VtJwIsvDy7vp.png'

const filters = ['Tous les véhicules', 'Moins de 10 000 €', 'Moins de 50 000 km']
const brands = [
  ['Peugeot', 'peugeot'], ['Renault', 'renault'], ['Citroën', 'citroen'], ['Volkswagen', 'volkswagen'],
  ['Audi', 'audi'], ['BMW', 'bmw'], ['Mercedes-Benz', 'mercedes-benz'], ['Nissan', 'nissan'],
  ['Opel', 'opel'], ['Ford', 'ford'], ['Toyota', 'toyota'], ['Fiat', 'fiat'],
]

export default function Page() {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [formSent, setFormSent] = useState(false)
  const [search, setSearch] = useState({ model: '', budget: '', fuel: '' })
  const [submittedSearch, setSubmittedSearch] = useState({ model: '', budget: '', fuel: '' })
  const [sortOrder, setSortOrder] = useState('recent')

  const visibleVehicles = useMemo(() => {
    let result = vehicles
    if (activeFilter === filters[1]) result = result.filter((v) => Number(v.price.replace(/\D/g, '')) < 10000)
    if (activeFilter === filters[2]) result = result.filter((v) => Number(v.km.replace(/\D/g, '')) < 50000)
    if (submittedSearch.model) result = result.filter((v) => `${v.name} ${v.meta}`.toLowerCase().includes(submittedSearch.model.toLowerCase()))
    if (submittedSearch.budget) result = result.filter((v) => Number(v.price.replace(/\D/g, '')) <= Number(submittedSearch.budget))
    if (submittedSearch.fuel) result = result.filter((v) => v.fuel === submittedSearch.fuel)
    return [...result].sort((a, b) => sortOrder === 'price-asc' ? Number(a.price.replace(/\D/g, '')) - Number(b.price.replace(/\D/g, '')) : sortOrder === 'price-desc' ? Number(b.price.replace(/\D/g, '')) - Number(a.price.replace(/\D/g, '')) : Number(b.year) - Number(a.year))
  }, [activeFilter, submittedSearch, sortOrder])

  const runSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedSearch(search)
    document.querySelector('#stock')?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleFavorite = (id: number) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <main className="site-shell">
      <div className="topline"><span>Planète Auto</span><span>Votre mobilité, notre exigence.</span><span>Saint-Jean-de-Védas · Occitanie</span></div>
      <header className="navbar">
        <a href="#top" className="brand"><img src="/planete-auto-logo.png" alt="" /><span>Planète <b>Auto</b></span></a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Navigation principale">
          <a href="/vehicules" onClick={() => setMenuOpen(false)}>Véhicules</a>
          <a href="/reprise" onClick={() => setMenuOpen(false)}>Reprise</a>
          <a href="/a-propos" onClick={() => setMenuOpen(false)}>À propos</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="nav-actions"><a className="nav-cta" href="/reprise">Parlons de votre projet <ArrowRight size={16} /></a></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> L'automobile autrement</div><h1>Le bon véhicule,<br /><em>au bon moment.</em></h1><p>Une sélection de véhicules d'occasion soigneusement choisis, contrôlés et prêts à prendre la route avec vous.</p><div className="hero-buttons"><a className="button button-red" href="#stock">Explorer le stock <ArrowRight size={18} /></a><a className="button button-ghost" href="/reprise">Estimer ma reprise <Tag size={17} /></a></div><div className="trust-row"><div><strong>+10 ans</strong><span>d'expertise</span></div><div><strong>100%</strong><span>transparence</span></div><div><strong>4.9/5</strong><span>satisfaction</span></div></div></div>
        <div className="hero-visual"><div className="hero-backdrop" /><img className="hero-car" src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1800&q=90" alt="Véhicule premium gris stationné" /><div className="hero-card"><span className="card-kicker">À la une</span><strong>Mercedes-Benz<br />Classe A</strong><span className="card-price">à partir de 28 990 €</span><a href="#stock">Découvrir <ArrowRight size={15} /></a></div><div className="hero-index">01 <span>/</span> 03</div></div>
      </section>

      <form className="vehicle-search-panel" aria-label="Recherche de véhicule" onSubmit={runSearch}><div className="search-panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> Recherche véhicule</span><h2>Trouvez le véhicule<br /><em>qui vous correspond.</em></h2></div><Search size={28} /></div><div className="search-fields"><label><span>Marque ou modèle</span><input value={search.model} onChange={(event) => setSearch({ ...search, model: event.target.value })} placeholder="Ex. Peugeot 3008" /></label><label><span>Budget maximum</span><select value={search.budget} onChange={(event) => setSearch({ ...search, budget: event.target.value })}><option value="">Tous les budgets</option><option value="16000">Moins de 16 000 €</option><option value="22000">Moins de 22 000 €</option><option value="30000">Moins de 30 000 €</option></select></label><label><span>Carburant</span><select value={search.fuel} onChange={(event) => setSearch({ ...search, fuel: event.target.value })}><option value="">Tous les carburants</option><option value="Essence">Essence</option><option value="Diesel">Diesel</option></select></label></div><button className="search-submit" type="submit"><Search size={18} /> Rechercher dans le stock</button></form>

      <section className="brands-section" aria-labelledby="brands-title"><div className="section-heading centered"><div><div className="eyebrow"><span className="eyebrow-line" /> Les marques que nous suivons <span className="eyebrow-line" /></div><h2 id="brands-title">Trouvez votre<br /><em>prochaine marque</em></h2></div></div><div className="brands-grid">{brands.map(([name, slug]) => <button className="brand-tile" key={slug} onClick={() => { const nextSearch = { ...search, model: name }; setSearch(nextSearch); setSubmittedSearch(nextSearch); document.querySelector('#stock')?.scrollIntoView({ behavior: 'smooth' }) }}><img src={`https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`} alt="" /><span>{name}</span><ArrowRight size={15} /></button>)}</div></section>

      <section className="section stock-section" id="stock"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> Sélection Planète Auto</div><h2>Des véhicules qui<br /><em>vous ressemblent</em></h2></div><a className="text-link" href="#stock">Voir tout le stock <ArrowRight size={17} /></a></div><div className="filter-bar"><div className="filter-tabs">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'filter-tab active' : 'filter-tab'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><label className="sort-control"><span>Trier par</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="recent">Plus récents</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option></select></label></div><div className="catalogue-result">{visibleVehicles.length} véhicule{visibleVehicles.length > 1 ? 's' : ''} correspondant{visibleVehicles.length > 1 ? 's' : ''}</div>{visibleVehicles.length === 0 ? <div className="empty-state"><Search size={24} /><h3>Aucun véhicule ne correspond</h3><p>Essayez une autre marque, un budget différent ou réinitialisez votre recherche.</p><button className="button button-ghost" onClick={() => { setSearch({ model: '', budget: '', fuel: '' }); setSubmittedSearch({ model: '', budget: '', fuel: '' }); setActiveFilter(filters[0]) }}>Réinitialiser la recherche</button></div> : <div className="vehicle-grid">{visibleVehicles.map((vehicle) => <article className="vehicle-card" key={vehicle.id}><div className="vehicle-image"><img src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} /><span className="vehicle-tag">{vehicle.tag}</span><button className={favorites.includes(vehicle.id) ? 'favorite is-favorite' : 'favorite'} onClick={() => toggleFavorite(vehicle.id)} aria-label="Ajouter aux favoris"><Heart size={18} fill={favorites.includes(vehicle.id) ? 'currentColor' : 'none'} /></button></div><div className="vehicle-body"><div className="vehicle-title"><div><h3>{vehicle.name}</h3><p>{vehicle.meta}</p></div><strong>{vehicle.price}</strong></div><div className="vehicle-specs"><span>{vehicle.year}</span><span>{vehicle.km}</span><span>{vehicle.fuel}</span><span>{vehicle.gearbox}</span></div><span className="vehicle-status"><span className="status-dot" />{vehicle.status}</span><a className="vehicle-link" onClick={(event) => { event.preventDefault(); window.location.assign(`/vehicules/${vehicle.id}`); requestAnimationFrame(() => document.querySelector('#vehicle-detail')?.scrollIntoView({ behavior: 'smooth' })) }} href="#contact">Voir le véhicule <ArrowRight size={16} /></a></div></article>)}</div>}</section>


      <section id="services"><section className="page-hero homepage-services-hero"><div className="eyebrow"><span className="eyebrow-line" /> L'expérience Planète Auto</div><h1>Bien plus qu'une<br /><em>voiture</em></h1><p>De la première rencontre jusqu'à la remise des clés, nous faisons de chaque étape un moment simple et serein.</p></section><section className="page-section service-grid"><ServiceCard number="01" icon={<CarFront />} title="Achat & vente" text="Des véhicules sélectionnés avec soin, contrôlés et préparés pour prendre la route." /><ServiceCard number="02" icon={<ShieldCheck />} title="Garantie 3 mois" text="Une garantie boîte et moteur, jusqu'à 5 000 km, pour démarrer en confiance." /><ServiceCard number="03" icon={<CarFront />} title="Reprise" text="Nous étudions votre véhicule et vous accompagnons vers votre prochain projet." /><ServiceCard number="04" icon={<ShieldCheck />} title="Financement" text="Des solutions claires et adaptées à votre budget, sans parcours compliqué." /></section><section className="dark-callout"><div><div className="eyebrow light"><span className="eyebrow-line" /> Une approche locale</div><h2>Le conseil avant<br /><em>la transaction</em></h2></div><p>Planète Auto vous accompagne avec transparence, de la sélection du véhicule à la remise des clés.</p></section></section>

      <section className="section journey-section" id="reprise"><div className="section-heading centered"><div><div className="eyebrow"><span className="eyebrow-line" /> Votre projet, simplement <span className="eyebrow-line" /></div><h2>Trois étapes vers<br /><em>votre prochaine route</em></h2></div></div><div className="journey-grid"><div className="journey-step"><span className="step-number">01</span><CalendarDays size={25} /><h3>On échange</h3><p>Parlez-nous de vos envies, de votre budget ou de votre véhicule à reprendre.</p></div><div className="journey-step"><span className="step-number">02</span><Search size={25} /><h3>On vous conseille</h3><p>Notre équipe vous accompagne avec une sélection qui vous correspond vraiment.</p></div><div className="journey-step"><span className="step-number">03</span><Check size={25} /><h3>Vous prenez la route</h3><p>Un véhicule contrôlé, préparé et livré dans les meilleures conditions.</p></div></div></section>

      <section className="contact-section" id="contact"><div className="contact-copy"><div className="eyebrow light"><span className="eyebrow-line" /> Parlons automobile</div><h2>Une question ?<br /><em>Un projet ?</em></h2><p>Notre équipe est à votre écoute pour vous aider à trouver le véhicule qui vous ressemble.</p><div className="contact-details"><div><Phone size={18} /><strong>04 67 82 54 12</strong></div><div><Mail size={18} /><span>planeteauto34@gmail.com</span></div></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setFormSent(true) }}>{formSent ? <div className="form-success"><Check size={30} /><h3>Message bien reçu.</h3><p>Nous reviendrons vers vous rapidement.</p></div> : <><div className="form-heading"><span>01 / 01</span><h3>Parlez-nous de votre projet</h3></div><label>Votre nom<input required placeholder="Prénom Nom" /></label><label>Votre adresse e-mail<input required type="email" placeholder="vous@exemple.fr" /></label><label>Votre message<textarea required placeholder="Je recherche..." rows={3} /></label><button className="button button-red" type="submit">Envoyer ma demande <ArrowRight size={17} /></button></>}</form></section>





<SiteFooter />
    </main>
  )
}
