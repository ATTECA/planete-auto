"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  Mail,
  Phone,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";
import { ServiceCard, SiteFooter } from "@/components/site-pages";
import type { Vehicle } from "@/lib/vehicles";

const logo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Variation%20logo%20principale%20%283%29-KVWe2Eco22lDkGQ3c9VtJwIsvDy7vp.png";

const filters = ["Dernières arrivées", "Notre sélection"];
const brands = [
  ["Peugeot", "peugeot"],
  ["Renault", "renault"],
  ["Citroën", "citroen"],
  ["Volkswagen", "volkswagen"],
  ["Audi", "audi"],
  ["BMW", "bmw"],
  ["Mercedes-Benz", "mercedes-benz"],
  ["Nissan", "nissan"],
  ["Opel", "opel"],
  ["Ford", "ford"],
  ["Toyota", "toyota"],
  ["Fiat", "fiat"],
];

export default function HomePageClient({ vehicles }: { vehicles: Vehicle[] }) {
  const heroVehicle = useMemo(() => [...vehicles].sort((a, b) => b.id - a.id)[0], [vehicles]);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSending, setFormSending] = useState(false);
  const [search, setSearch] = useState({ model: "", budget: "", fuel: "" });
  const [submittedSearch, setSubmittedSearch] = useState({ model: "", budget: "", fuel: "" });

  const visibleVehicles = useMemo(() => {
    let result: Vehicle[] =
      activeFilter === filters[1]
        ? [...vehicles]
            .filter((vehicle) => vehicle.featured)
            .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
            .slice(0, 3)
        : [...vehicles].sort((a, b) => b.id - a.id).slice(0, 3);
    if (submittedSearch.model)
      result = result.filter((v) => `${v.name} ${v.meta}`.toLowerCase().includes(submittedSearch.model.toLowerCase()));
    if (submittedSearch.budget) result = result.filter((v) => Number(v.price.replace(/\D/g, "")) <= Number(submittedSearch.budget));
    if (submittedSearch.fuel) result = result.filter((v) => v.fuel === submittedSearch.fuel);
    return result;
  }, [vehicles, activeFilter, submittedSearch]);

  const runSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(search);
    document.querySelector("#stock")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFavorite = (id: number) =>
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFormSending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), message: form.get("message") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setFormSent(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "L’envoi a échoué. Veuillez réessayer.");
    } finally {
      setFormSending(false);
    }
  };

  return (
    <main className="site-shell">
      <div className="topline">
        <span>Planète Auto</span>
        <span>Achat · vente · reprise toutes marques</span>
        <span>Saint-Jean-de-Védas · Occitanie</span>
      </div>
      <header className="navbar">
        <a href="#top" className="brand">
          <img src="/planete-auto-logo.png" alt="" />
          <span>
            Planète <b>Auto</b>
          </span>
        </a>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Navigation principale">
          <a href="/" onClick={() => setMenuOpen(false)}>
            Accueil
          </a>
          <a href="/vehicules" onClick={() => setMenuOpen(false)}>
            Stock
          </a>
          <a href="/reprise" onClick={() => setMenuOpen(false)}>
            Vente & reprise
          </a>
          <a href="/a-propos" onClick={() => setMenuOpen(false)}>
            À propos
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
        <div className="nav-actions">
          <a className="nav-cta" href="tel:+33467825412">
            <Phone size={16} /> Nous appeler maintenant
          </a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" /> Achat · vente · reprise
          </div>
          <h1>
            Une voiture d’occasion,
            <br />
            <em>en toute confiance.</em>
          </h1>
          <p>
            Découvrez nos véhicules toutes marques et bénéficiez d’un accompagnement simple pour l’achat, la reprise, le financement et les
            démarches administratives.
          </p>
          <div className="hero-buttons">
            <a className="button button-red" href="#stock">
              Voir nos véhicules <ArrowRight size={18} />
            </a>
            <a className="button button-ghost" href="/reprise">
              Faire reprendre ma voiture <Tag size={17} />
            </a>
          </div>
          <div className="trust-row">
            <div>
              <strong>Toutes marques</strong>
              <span>achat & vente</span>
            </div>
            <div>
              <strong>Reprise</strong>
              <span>de votre véhicule</span>
            </div>
            <div>
              <strong>Garantie</strong>
              <span>et financement</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-backdrop" />
          <img
            className="hero-car"
            src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1800&q=90"
            alt="Véhicule d’occasion exposé"
          />
          {heroVehicle && (
            <div className="hero-card">
              <span className="card-kicker">Nouveauté</span>
              <strong>{heroVehicle.name}</strong>
              <span className="card-price">{heroVehicle.price}</span>
              <a href={`/vehicules/${heroVehicle.id}`}>
                Voir le véhicule <ArrowRight size={15} />
              </a>
            </div>
          )}
        </div>
      </section>

      <form className="vehicle-search-panel" aria-label="Recherche de véhicule" onSubmit={runSearch}>
        <div className="search-panel-heading">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-line" /> Recherche véhicule
            </span>
            <h2>
              Trouvez le véhicule
              <br />
              <em>qui vous correspond.</em>
            </h2>
          </div>
          <Search size={28} />
        </div>
        <div className="search-fields">
          <label>
            <span>Marque ou modèle</span>
            <input
              value={search.model}
              onChange={(event) => setSearch({ ...search, model: event.target.value })}
              placeholder="Ex. Peugeot 3008"
            />
          </label>
          <label>
            <span>Budget maximum</span>
            <select value={search.budget} onChange={(event) => setSearch({ ...search, budget: event.target.value })}>
              <option value="">Tous les budgets</option>
              <option value="16000">Moins de 16 000 €</option>
              <option value="22000">Moins de 22 000 €</option>
              <option value="30000">Moins de 30 000 €</option>
            </select>
          </label>
          <label>
            <span>Carburant</span>
            <select value={search.fuel} onChange={(event) => setSearch({ ...search, fuel: event.target.value })}>
              <option value="">Tous les carburants</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
            </select>
          </label>
        </div>
        <button className="search-submit" type="submit">
          <Search size={18} /> Rechercher dans le stock
        </button>
      </form>

      <section className="brands-section" aria-labelledby="brands-title">
        <div className="section-heading centered">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> Toutes marques <span className="eyebrow-line" />
            </div>
            <h2 id="brands-title">
              Choisissez votre
              <br />
              <em>prochaine voiture</em>
            </h2>
          </div>
        </div>
        <div className="brands-grid">
          {brands.map(([name, slug]) => (
            <button
              className="brand-tile"
              key={slug}
              onClick={() => {
                const nextSearch = { ...search, model: name };
                setSearch(nextSearch);
                setSubmittedSearch(nextSearch);
                document.querySelector("#stock")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <img src={`https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`} alt="" />
              <span>{name}</span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </section>

      <section className="section stock-section" id="stock">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> Sélection Planète Auto
            </div>
            <h2>
              Des véhicules qui
              <br />
              <em>vous ressemblent</em>
            </h2>
          </div>
        </div>
        <div className="filter-bar">
          <div className="filter-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "filter-tab active" : "filter-tab"}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <a className="text-link" href="#stock">
            Voir tout le stock <ArrowRight size={17} />
          </a>
        </div>
        <div className="catalogue-result">
          {visibleVehicles.length} véhicule{visibleVehicles.length > 1 ? "s" : ""} correspondant{visibleVehicles.length > 1 ? "s" : ""}
        </div>
        {visibleVehicles.length === 0 ? (
          <div className="empty-state">
            <Search size={24} />
            <h3>Aucun véhicule ne correspond</h3>
            <p>Essayez une autre marque, un budget différent ou réinitialisez votre recherche.</p>
            <button
              className="button button-ghost"
              onClick={() => {
                setSearch({ model: "", budget: "", fuel: "" });
                setSubmittedSearch({ model: "", budget: "", fuel: "" });
                setActiveFilter(filters[0]);
              }}
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="vehicle-grid">
            {visibleVehicles.map((vehicle) => (
              <article className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-image">
                  <img src={vehicle.image} alt={`${vehicle.name} ${vehicle.meta}`} />
                  <span className="vehicle-tag">{vehicle.tag}</span>
                  <button
                    className={favorites.includes(vehicle.id) ? "favorite is-favorite" : "favorite"}
                    onClick={() => toggleFavorite(vehicle.id)}
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart size={18} fill={favorites.includes(vehicle.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="vehicle-body">
                  <div className="vehicle-title">
                    <div>
                      <h3>{vehicle.name}</h3>
                      <p>{vehicle.meta}</p>
                    </div>
                    <strong>{vehicle.price}</strong>
                  </div>
                  <div className="vehicle-specs">
                    <span>{vehicle.year}</span>
                    <span>{vehicle.km}</span>
                    <span>{vehicle.fuel}</span>
                    <span>{vehicle.gearbox}</span>
                  </div>
                  <span className="vehicle-status">
                    <span className="status-dot" />
                    {vehicle.status}
                  </span>
                  <a
                    className="vehicle-link"
                    onClick={(event) => {
                      event.preventDefault();
                      window.location.assign(`/vehicules/${vehicle.id}`);
                      requestAnimationFrame(() => document.querySelector("#vehicle-detail")?.scrollIntoView({ behavior: "smooth" }));
                    }}
                    href="#contact"
                  >
                    Voir le véhicule <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="services">
        <section className="page-hero homepage-services-hero">
          <div className="eyebrow">
            <span className="eyebrow-line" /> Nos services
          </div>
          <h1>
            Tout pour acheter
            <br />
            <em>plus simplement.</em>
          </h1>
          <p>Achat, reprise, financement, garantie et démarches administratives : nous vous accompagnons à chaque étape.</p>
        </section>
        <section className="page-section service-grid">
          <ServiceCard
            number="01"
            icon={<CarFront />}
            title="Achat & vente"
            text="Des véhicules d’occasion toutes marques, disponibles à Saint-Jean-de-Védas."
          />
          <ServiceCard
            number="02"
            icon={<ShieldCheck />}
            title="Garantie 3 mois"
            text="Garantie 3 mois ou 5 000 km sur la boîte et le moteur."
          />
          <ServiceCard
            number="03"
            icon={<CarFront />}
            title="Reprise"
            text="Nous étudions votre ancien véhicule pour vous aider à financer le suivant."
          />
          <ServiceCard
            number="04"
            icon={<ShieldCheck />}
            title="Financement"
            text="Des solutions de paiement et de financement adaptées à votre situation."
          />
        </section>
        <section className="dark-callout">
          <div>
            <div className="eyebrow light">
              <span className="eyebrow-line" /> Un accompagnement concret
            </div>
            <h2>
              Une voiture d’occasion
              <br />
              <em>sans complication.</em>
            </h2>
          </div>
          <p>Nous pouvons aussi vous aider pour les démarches administratives, la carte grise et la déclaration d’achat.</p>
        </section>
      </section>

      <section className="section journey-section" id="reprise">
        <div className="section-heading centered">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> Un achat plus simple <span className="eyebrow-line" />
            </div>
            <h2>
              De la recherche
              <br />
              <em>à la remise des clés.</em>
            </h2>
          </div>
        </div>
        <div className="journey-grid">
          <div className="journey-step">
            <span className="step-number">01</span>
            <CalendarDays size={25} />
            <h3>Vous cherchez</h3>
            <p>Parcourez nos véhicules d’occasion et trouvez celui qui correspond à votre budget.</p>
          </div>
          <div className="journey-step">
            <span className="step-number">02</span>
            <Search size={25} />
            <h3>Vous échangez</h3>
            <p>Posez vos questions, demandez une reprise ou étudiez une solution de financement.</p>
          </div>
          <div className="journey-step">
            <span className="step-number">03</span>
            <Check size={25} />
            <h3>Vous prenez la route</h3>
            <p>Votre véhicule est préparé et les démarches sont accompagnées jusqu’à la livraison.</p>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <div className="eyebrow light">
            <span className="eyebrow-line" /> Contactez-nous
          </div>
          <h2>
            Vous cherchez
            <br />
            <em>une voiture ?</em>
          </h2>
          <p>Une question sur un véhicule, une reprise ou un financement ? Écrivez-nous directement.</p>
          <div className="contact-details">
            <div>
              <Phone size={18} />
              <strong>+33 4 67 82 54 12</strong>
            </div>
            <div>
              <Mail size={18} />
              <span>planeteauto34@gmail.com</span>
            </div>
          </div>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          {formSent ? (
            <div className="form-success">
              <Check size={30} />
              <h3>Message bien reçu.</h3>
              <p>Nous reviendrons vers vous rapidement.</p>
            </div>
          ) : (
            <>
              <div className="form-heading">
                <span>01 / 01</span>
                <h3>Parlez-nous de votre projet</h3>
              </div>
              <label>
                Votre nom
                <input name="name" required placeholder="Prénom Nom" />
              </label>
              <label>
                Votre adresse e-mail
                <input name="email" required type="email" placeholder="vous@exemple.fr" />
              </label>
              <label>
                Votre message
                <textarea name="message" required placeholder="Je recherche..." rows={3} />
              </label>
              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}
              <button className="button button-red" type="submit" disabled={formSending}>
                {formSending ? "Envoi en cours..." : "Envoyer ma demande"} <ArrowRight size={17} />
              </button>
            </>
          )}
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}
