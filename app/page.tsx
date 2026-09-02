'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Variation%20logo%20principale%20%283%29-KVWe2Eco22lDkGQ3c9VtJwIsvDy7vp.png'

const vehicles = [
  { id: 1, name: 'Peugeot 3008', meta: '1.5 BlueHDi 130 GT Line', year: '2020', km: '64 800 km', fuel: 'Diesel', price: '21 490 €', tag: 'Coup de cœur', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=85' },
  { id: 2, name: 'Audi A3 Sportback', meta: '35 TFSI 150 S line', year: '2021', km: '42 300 km', fuel: 'Essence', price: '24 990 €', tag: 'Nouveauté', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85' },
  { id: 3, name: 'Renault Clio V', meta: 'TCe 90 Intens', year: '2022', km: '28 150 km', fuel: 'Essence', price: '15 490 €', tag: 'Bon plan', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=85' },
]

const filters = ['Tous les véhicules', 'Moins de 20 000 €', 'Moins de 50 000 km']

export default function Page() {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [formSent, setFormSent] = useState(false)

  const visibleVehicles = useMemo(() => {
    if (activeFilter === filters[1]) return vehicles.filter((v) => Number(v.price.replace(/\D/g, '')) < 20000)
    if (activeFilter === filters[2]) return vehicles.filter((v) => Number(v.km.replace(/\D/g, '')) < 50000)
    return vehicles
  }, [activeFilter])

  const toggleFavorite = (id: number) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <main className="site-shell">
      <div className="topline"><span>Planète Auto</span><span>Votre mobilité, notre exigence.</span><span>Saint-Jean-de-Védas · Occitanie</span></div>
      <header className="navbar">
        <a href="#top" className="brand"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Variation%20logo%20principale%20%283%29-KVWe2Eco22lDkGQ3c9VtJwIsvDy7vp.png" alt="Planète Auto" /></a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Navigation principale">
          <a href="#stock" onClick={() => setMenuOpen(false)}>Nos véhicules</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Nos services</a>
          <a href="#reprise" onClick={() => setMenuOpen(false)}>Reprise</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="nav-actions"><span className="stock-count"><span className="status-dot" /> Stock disponible</span><a className="nav-cta" href="#contact">Parlons de votre projet <ArrowRight size={16} /></a></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> L'automobile autrement</div><h1>Le bon véhicule,<br /><em>au bon moment.</em></h1><p>Une sélection de véhicules d'occasion soigneusement choisis, contrôlés et prêts à prendre la route avec vous.</p><div className="hero-buttons"><a className="button button-red" href="#stock">Explorer le stock <ArrowRight size={18} /></a><a className="button button-ghost" href="#reprise">Estimer ma reprise <Tag size={17} /></a></div><div className="trust-row"><div><strong>+10 ans</strong><span>d'expertise</span></div><div><strong>100%</strong><span>transparence</span></div><div><strong>4.9/5</strong><span>satisfaction</span></div></div></div>
        <div className="hero-visual"><div className="hero-backdrop" /><img className="hero-car" src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1800&q=90" alt="Véhicule premium gris stationné" /><div className="hero-card"><span className="card-kicker">À la une</span><strong>Mercedes-Benz<br />Classe A</strong><span className="card-price">à partir de 28 990 €</span><a href="#stock">Découvrir <ArrowRight size={15} /></a></div><div className="hero-index">01 <span>/</span> 03</div></div>
      </section>

      <section className="quick-search" aria-label="Recherche de véhicule"><div className="search-label"><Search size={20} /><span>Je recherche</span></div><div className="search-select">Une marque ou un modèle <ChevronDown size={16} /></div><div className="search-select">Budget maximum <ChevronDown size={16} /></div><div className="search-select">Type de carburant <ChevronDown size={16} /></div><button className="search-submit"><Search size={18} /> Rechercher</button></section>

      <section className="section stock-section" id="stock"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> Sélection Planète Auto</div><h2>Des véhicules qui<br /><em>vous ressemblent.</em></h2></div><a className="text-link" href="#stock">Voir tout le stock <ArrowRight size={17} /></a></div><div className="filter-bar"><div className="filter-tabs">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'filter-tab active' : 'filter-tab'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><button className="filter-more"><SlidersHorizontal size={16} /> Plus de filtres</button></div><div className="vehicle-grid">{visibleVehicles.map((vehicle) => <article className="vehicle-card" key={vehicle.id}><div className="vehicle-image"><img src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} /><span className="vehicle-tag">{vehicle.tag}</span><button className={favorites.includes(vehicle.id) ? 'favorite is-favorite' : 'favorite'} onClick={() => toggleFavorite(vehicle.id)} aria-label="Ajouter aux favoris"><Heart size={18} fill={favorites.includes(vehicle.id) ? 'currentColor' : 'none'} /></button></div><div className="vehicle-body"><div className="vehicle-title"><div><h3>{vehicle.name}</h3><p>{vehicle.meta}</p></div><strong>{vehicle.price}</strong></div><div className="vehicle-specs"><span>{vehicle.year}</span><span>{vehicle.km}</span><span>{vehicle.fuel}</span></div><a className="vehicle-link" href="#contact">Voir le véhicule <ArrowRight size={16} /></a></div></article>)}</div></section>

      <section className="dark-band" id="services"><div className="section dark-inner"><div className="dark-intro"><div className="eyebrow light"><span className="eyebrow-line" /> L'expérience Planète Auto</div><h2>Bien plus qu'une<br /><em>voiture.</em></h2><p>De la première rencontre jusqu'à la remise des clés, nous faisons de chaque étape un moment simple et serein.</p><a className="button button-light" href="#contact">Découvrir notre approche <ArrowRight size={17} /></a></div><div className="service-list"><div className="service-item"><span>01</span><div><CarFront size={24} /><h3>Achat & vente</h3><p>Des véhicules sélectionnés avec soin, pour rouler l'esprit léger.</p></div></div><div className="service-item"><span>02</span><div><Sparkles size={24} /><h3>Financement sur mesure</h3><p>Un accompagnement clair pour trouver la solution adaptée.</p></div></div><div className="service-item"><span>03</span><div><ShieldCheck size={24} /><h3>Garantie & sérénité</h3><p>Des contrôles rigoureux et une garantie pour chaque départ.</p></div></div></div></div></section>

      <section className="section journey-section" id="reprise"><div className="section-heading centered"><div><div className="eyebrow"><span className="eyebrow-line" /> Votre projet, simplement</div><h2>Trois étapes vers<br /><em>votre prochaine route.</em></h2></div></div><div className="journey-grid"><div className="journey-step"><span className="step-number">01</span><CalendarDays size={25} /><h3>On échange</h3><p>Parlez-nous de vos envies, de votre budget ou de votre véhicule à reprendre.</p></div><div className="journey-step"><span className="step-number">02</span><Search size={25} /><h3>On vous conseille</h3><p>Notre équipe vous accompagne avec une sélection qui vous correspond vraiment.</p></div><div className="journey-step"><span className="step-number">03</span><Check size={25} /><h3>Vous prenez la route</h3><p>Un véhicule contrôlé, préparé et livré dans les meilleures conditions.</p></div></div></section>

      <section className="contact-section" id="contact"><div className="contact-copy"><div className="eyebrow light"><span className="eyebrow-line" /> Parlons automobile</div><h2>Une question ?<br /><em>Un projet ?</em></h2><p>Notre équipe est à votre écoute pour vous aider à trouver le véhicule qui vous ressemble.</p><div className="contact-details"><div><Clock3 size={18} /><span><strong>Lundi–vendredi</strong><br />09h00–12h30 · 14h00–18h00<br /><strong>Samedi</strong><br />10h00–17h00</span></div><div><CarFront size={18} /><span>Venez nous rencontrer<br /><strong>2371 Rte de Lavérune</strong><br /><strong>34430 Saint-Jean-de-Védas</strong></span></div></div><div className="map-frame"><iframe title="Localisation de Planète Auto à Saint-Jean-de-Védas" src="https://www.openstreetmap.org/export/embed.html?bbox=3.828%2C43.588%2C3.836%2C43.598&layer=mapnik&marker=43.5931637%2C3.8320012" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setFormSent(true) }}>{formSent ? <div className="form-success"><Check size={30} /><h3>Message bien reçu.</h3><p>Nous reviendrons vers vous rapidement.</p></div> : <><div className="form-heading"><span>01 / 01</span><h3>Parlez-nous de votre projet</h3></div><label>Votre nom<input required placeholder="Prénom Nom" /></label><label>Votre adresse e-mail<input required type="email" placeholder="vous@exemple.fr" /></label><label>Votre message<textarea required placeholder="Je recherche..." rows={3} /></label><button className="button button-red" type="submit">Envoyer ma demande <ArrowRight size={17} /></button></>}</form></section>
      <footer><a href="#top" className="footer-brand"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Variation%20logo%20principale%20%283%29-KVWe2Eco22lDkGQ3c9VtJwIsvDy7vp.png" alt="" /><span>Planète <b>Auto</b></span></a><span>© 2024 Planète Auto. L'automobile autrement.</span><a href="#contact">Nous contacter <ArrowRight size={15} /></a></footer>
    </main>
  )
}
