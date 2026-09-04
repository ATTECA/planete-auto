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
  MapPin,
  Mail,
  Phone,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react'
import { ServiceCard } from '@/components/site-pages'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Variation%20logo%20principale%20%283%29-KVWe2Eco22lDkGQ3c9VtJwIsvDy7vp.png'

const vehicles = [
  { id: 1, name: 'Peugeot 3008', meta: '1.5 BlueHDi 130 GT Line', year: '2020', km: '64 800 km', fuel: 'Diesel', gearbox: 'Automatique', price: '21 490 €', tag: 'Coup de cœur', status: 'Disponible', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=85' },
  { id: 2, name: 'Audi A3 Sportback', meta: '35 TFSI 150 S line', year: '2021', km: '42 300 km', fuel: 'Essence', gearbox: 'Automatique', price: '24 990 €', tag: 'Nouveauté', status: 'Disponible', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85' },
  { id: 3, name: 'Renault Clio V', meta: 'TCe 90 Intens', year: '2022', km: '28 150 km', fuel: 'Essence', gearbox: 'Manuelle', price: '15 490 €', tag: 'Bon plan', status: 'Disponible', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=85' },
]

const filters = ['Tous les véhicules', 'Moins de 20 000 €', 'Moins de 50 000 km']
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
  const [selectedVehicle, setSelectedVehicle] = useState<(typeof vehicles)[number] | null>(null)

  const visibleVehicles = useMemo(() => {
    let result = vehicles
    if (activeFilter === filters[1]) result = result.filter((v) => Number(v.price.replace(/\D/g, '')) < 20000)
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
          <a href="#stock" onClick={() => setMenuOpen(false)}>Nos véhicules</a>
          <a href="/financement" onClick={() => setMenuOpen(false)}>Financement</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="nav-actions"><a className="nav-cta" href="/reprise">Vendre mon véhicule <ArrowRight size={16} /></a></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> L'automobile autrement</div><h1>Le bon véhicule,<br /><em>au bon moment.</em></h1><p>Une sélection de véhicules d'occasion soigneusement choisis, contrôlés et prêts à prendre la route avec vous.</p><div className="hero-buttons"><a className="button button-red" href="#stock">Explorer le stock <ArrowRight size={18} /></a><a className="button button-ghost" href="/reprise">Estimer ma reprise <Tag size={17} /></a></div><div className="trust-row"><div><strong>+10 ans</strong><span>d'expertise</span></div><div><strong>100%</strong><span>transparence</span></div><div><strong>4.9/5</strong><span>satisfaction</span></div></div></div>
        <div className="hero-visual"><div className="hero-backdrop" /><img className="hero-car" src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1800&q=90" alt="Véhicule premium gris stationné" /><div className="hero-card"><span className="card-kicker">À la une</span><strong>Mercedes-Benz<br />Classe A</strong><span className="card-price">à partir de 28 990 €</span><a href="#stock">Découvrir <ArrowRight size={15} /></a></div><div className="hero-index">01 <span>/</span> 03</div></div>
      </section>

      <form className="vehicle-search-panel" aria-label="Recherche de véhicule" onSubmit={runSearch}><div className="search-panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> Recherche véhicule</span><h2>Trouvez le véhicule<br /><em>qui vous correspond.</em></h2></div><Search size={28} /></div><div className="search-fields"><label><span>Marque ou modèle</span><input value={search.model} onChange={(event) => setSearch({ ...search, model: event.target.value })} placeholder="Ex. Peugeot 3008" /></label><label><span>Budget maximum</span><select value={search.budget} onChange={(event) => setSearch({ ...search, budget: event.target.value })}><option value="">Tous les budgets</option><option value="16000">Moins de 16 000 €</option><option value="22000">Moins de 22 000 €</option><option value="30000">Moins de 30 000 €</option></select></label><label><span>Carburant</span><select value={search.fuel} onChange={(event) => setSearch({ ...search, fuel: event.target.value })}><option value="">Tous les carburants</option><option value="Essence">Essence</option><option value="Diesel">Diesel</option></select></label></div><button className="search-submit" type="submit"><Search size={18} /> Rechercher dans le stock</button></form>

      <section className="brands-section" aria-labelledby="brands-title"><div className="section-heading centered"><div><div className="eyebrow"><span className="eyebrow-line" /> Les marques que nous suivons <span className="eyebrow-line" /></div><h2 id="brands-title">Trouvez votre<br /><em>prochaine marque.</em></h2></div></div><div className="brands-grid">{brands.map(([name, slug]) => <button className="brand-tile" key={slug} onClick={() => { const nextSearch = { ...search, model: name }; setSearch(nextSearch); setSubmittedSearch(nextSearch); document.querySelector('#stock')?.scrollIntoView({ behavior: 'smooth' }) }}><img src={`https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`} alt="" /><span>{name}</span><ArrowRight size={15} /></button>)}</div></section>

      <section className="section stock-section" id="stock"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> Sélection Planète Auto</div><h2>Des véhicules qui<br /><em>vous ressemblent.</em></h2></div><a className="text-link" href="#stock">Voir tout le stock <ArrowRight size={17} /></a></div><div className="filter-bar"><div className="filter-tabs">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'filter-tab active' : 'filter-tab'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><label className="sort-control"><span>Trier par</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="recent">Plus récents</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option></select></label></div><div className="catalogue-result">{visibleVehicles.length} véhicule{visibleVehicles.length > 1 ? 's' : ''} correspondant{visibleVehicles.length > 1 ? 's' : ''}</div>{visibleVehicles.length === 0 ? <div className="empty-state"><Search size={24} /><h3>Aucun véhicule ne correspond</h3><p>Essayez une autre marque, un budget différent ou réinitialisez votre recherche.</p><button className="button button-ghost" onClick={() => { setSearch({ model: '', budget: '', fuel: '' }); setSubmittedSearch({ model: '', budget: '', fuel: '' }); setActiveFilter(filters[0]) }}>Réinitialiser la recherche</button></div> : <div className="vehicle-grid">{visibleVehicles.map((vehicle) => <article className="vehicle-card" key={vehicle.id}><div className="vehicle-image"><img src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} /><span className="vehicle-tag">{vehicle.tag}</span><button className={favorites.includes(vehicle.id) ? 'favorite is-favorite' : 'favorite'} onClick={() => toggleFavorite(vehicle.id)} aria-label="Ajouter aux favoris"><Heart size={18} fill={favorites.includes(vehicle.id) ? 'currentColor' : 'none'} /></button></div><div className="vehicle-body"><div className="vehicle-title"><div><h3>{vehicle.name}</h3><p>{vehicle.meta}</p></div><strong>{vehicle.price}</strong></div><div className="vehicle-specs"><span>{vehicle.year}</span><span>{vehicle.km}</span><span>{vehicle.fuel}</span><span>{vehicle.gearbox}</span></div><span className="vehicle-status"><span className="status-dot" />{vehicle.status}</span><a className="vehicle-link" onClick={(event) => { event.preventDefault(); setSelectedVehicle(vehicle); requestAnimationFrame(() => document.querySelector('#vehicle-detail')?.scrollIntoView({ behavior: 'smooth' })) }} href="#contact">Voir le véhicule <ArrowRight size={16} /></a></div></article>)}</div>}</section>

      {selectedVehicle && <section className="vehicle-detail" id="vehicle-detail"><div className="detail-gallery"><img src={selectedVehicle.image} alt={`${selectedVehicle.name} ${selectedVehicle.meta}`} /><div className="detail-gallery-strip"><img src={selectedVehicle.image} alt="" /><img src={selectedVehicle.image} alt="" /></div></div><div className="detail-copy"><button className="detail-close" onClick={() => setSelectedVehicle(null)}><X size={17} /> Fermer</button><span className="card-kicker">{selectedVehicle.status}</span><h2>{selectedVehicle.name}</h2><p className="detail-meta">{selectedVehicle.meta}</p><strong className="detail-price">{selectedVehicle.price} <small>TTC</small></strong><p className="detail-tax">Prix professionnel HT sur demande · TVA récupérable selon véhicule</p><div className="detail-specs"><span><b>Année</b>{selectedVehicle.year}</span><span><b>Kilométrage</b>{selectedVehicle.km}</span><span><b>Carburant</b>{selectedVehicle.fuel}</span><span><b>Boîte</b>{selectedVehicle.gearbox}</span></div><div className="detail-warranty"><ShieldCheck size={19} /><span><b>Garantie Planète Auto</b><br />Véhicule contrôlé et préparé avant livraison.</span></div><div className="detail-actions"><a className="button button-red" href="#contact">Demander un essai <CalendarDays size={17} /></a><a className="button button-ghost" href="#contact">Financer ce véhicule <ArrowRight size={17} /></a></div></div></section>}

      <section id="services"><section className="page-hero homepage-services-hero"><div className="eyebrow"><span className="eyebrow-line" /> L'expérience Planète Auto</div><h1>Bien plus qu'une<br /><em>voiture.</em></h1><p>De la première rencontre jusqu'à la remise des clés, nous faisons de chaque étape un moment simple et serein.</p></section><section className="page-section service-grid"><ServiceCard number="01" icon={<CarFront />} title="Achat & vente" text="Des véhicules sélectionnés avec soin, contrôlés et préparés pour prendre la route." /><ServiceCard number="02" icon={<ShieldCheck />} title="Garantie 3 mois" text="Une garantie boîte et moteur, jusqu'à 5 000 km, pour démarrer en confiance." /><ServiceCard number="03" icon={<CarFront />} title="Reprise" text="Nous étudions votre véhicule et vous accompagnons vers votre prochain projet." /><ServiceCard number="04" icon={<ShieldCheck />} title="Financement" text="Des solutions claires et adaptées à votre budget, sans parcours compliqué." /></section><section className="dark-callout"><div><div className="eyebrow light"><span className="eyebrow-line" /> Une approche locale</div><h2>Le conseil avant<br /><em>la transaction.</em></h2></div><p>Planète Auto vous accompagne avec transparence, de la sélection du véhicule à la remise des clés.</p></section></section>

      <section className="section journey-section" id="reprise"><div className="section-heading centered"><div><div className="eyebrow"><span className="eyebrow-line" /> Votre projet, simplement <span className="eyebrow-line" /></div><h2>Trois étapes vers<br /><em>votre prochaine route.</em></h2></div></div><div className="journey-grid"><div className="journey-step"><span className="step-number">01</span><CalendarDays size={25} /><h3>On échange</h3><p>Parlez-nous de vos envies, de votre budget ou de votre véhicule à reprendre.</p></div><div className="journey-step"><span className="step-number">02</span><Search size={25} /><h3>On vous conseille</h3><p>Notre équipe vous accompagne avec une sélection qui vous correspond vraiment.</p></div><div className="journey-step"><span className="step-number">03</span><Check size={25} /><h3>Vous prenez la route</h3><p>Un véhicule contrôlé, préparé et livré dans les meilleures conditions.</p></div></div></section>

      <section className="contact-section" id="contact"><div className="contact-copy"><div className="eyebrow light"><span className="eyebrow-line" /> Parlons automobile</div><h2>Une question ?<br /><em>Un projet ?</em></h2><p>Notre équipe est à votre écoute pour vous aider à trouver le véhicule qui vous ressemble.</p><div className="contact-details"><div><Phone size={18} /><span><strong>04 67 82 54 12</strong><br />planeteauto34@gmail.com</span></div><p className="contact-prompt">Une équipe à votre écoute pour vous aider à trouver le véhicule qui vous ressemble.</p></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setFormSent(true) }}>{formSent ? <div className="form-success"><Check size={30} /><h3>Message bien reçu.</h3><p>Nous reviendrons vers vous rapidement.</p></div> : <><div className="form-heading"><span>01 / 01</span><h3>Parlez-nous de votre projet</h3></div><label>Votre nom<input required placeholder="Prénom Nom" /></label><label>Votre adresse e-mail<input required type="email" placeholder="vous@exemple.fr" /></label><label>Votre message<textarea required placeholder="Je recherche..." rows={3} /></label><button className="button button-red" type="submit">Envoyer ma demande <ArrowRight size={17} /></button></>}</form></section>




      
      <footer className="site-footer">
        <div className="footer-grid">
          {/* Identity Section */}
          <div className="footer-identity">
            <a href="#top" className="footer-brand">
              <img 
                src="/planete-auto-logo.png" 
                alt="Planète Auto logo" 
              />
              <span>Planète <b>Auto</b></span>
            </a>
            <p>Véhicules d'occasion sélectionnés avec exigence.</p>
            <span>
              SIREN : 799 787 262<br />
              SIRET : 799 787 262 00010
            </span>
            
            {/* Social Links */}
            <div className="socials" aria-label="Réseaux sociaux">
              <a href="#" aria-label="Instagram" className="social-link social-instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" /><circle cx="12" cy="12" r="4.1" /><circle cx="17.45" cy="6.55" r="1" className="social-dot" /></svg>
              </a>
              <a href="#" aria-label="Facebook" className="social-link social-facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.65 20v-7h2.35l.35-2.75h-2.7V8.5c0-.8.22-1.35 1.38-1.35h1.47V4.7c-.25-.04-1.1-.1-2.08-.1-2.06 0-3.47 1.26-3.47 3.58v2.07H8.62V13h2.33v7h2.7Z" /></svg>
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="footer-column">
            <h3>Navigation</h3>
            <a href="#top">Accueil</a>
            <a href="#stock">Nos véhicules</a>
            <a href="/services">Services</a>
            <a href="/reprise">Vendre mon véhicule</a>
          </div>

          {/* Find Us Section */}
          <div className="footer-column footer-find">
            <h3>Nous trouver</h3>
            <span>
              <MapPin size={15} />
              2371 Route de Lavérune<br />
              34430 Saint-Jean-de-Védas
            </span>
            <a href="tel:+33467825412">
              <Phone size={15} />04 67 82 54 12
            </a>
            <a href="mailto:planeteauto34@gmail.com">
              <Mail size={15} />planeteauto34@gmail.com
            </a>
            <a 
              className="footer-map-link" 
              href="https://www.google.com/maps/place/Plan%C3%A8te+autos/@43.5926281,3.8321068,18z" 
              target="_blank" 
              rel="noreferrer"
            >
              Ouvrir dans Google Maps <ArrowRight size={14} />
            </a>
          </div>

          {/* Hours Section */}
          <div className="footer-column footer-hours">
            <h3>Horaires</h3>
            <span>
              <strong>Lundi–vendredi</strong><br />
              09h00–12h30 · 14h00–18h00
            </span>
            <span>
              <strong>Samedi</strong><br />
              10h00–17h00
            </span>
            <span>Dimanche : fermé</span>
            
            {/* Map Frame */}
            <div className="footer-map-frame">
              <iframe 
                title="Planète Auto sur Google Maps" 
                src="https://www.google.com/maps?q=43.5931637,3.8320012&z=16&output=embed" 
                loading="lazy" 
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <img 
            src="/planete-auto-logo.png" 
            alt="Planète Auto logo" 
          />
          <span>Planète Auto © 2026 · SIRET 799 787 262 00010</span>
          <a href="/mentions-legales">Mentions légales</a>
        </div>
      </footer>               
    </main>
  )
}
