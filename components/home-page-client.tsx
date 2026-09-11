"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  Phone,
  Menu,
  Search,
  ShieldCheck,
  Tag,
  X,
} from "lucide-react";
import { ServiceCard, SiteFooter } from "@/components/site-pages";
import { useFavorites } from "@/lib/use-favorites";
import { getFeatureIcons } from "@/lib/vehicle-features";
import type { Vehicle } from "@/lib/vehicles";

const getDetail = (vehicle: Vehicle, label: string) => vehicle.details.find(([key]) => key === label)?.[1] ?? "";
const ARRIVALS_PAGE_SIZE = 4;
const ARRIVALS_PAGE_COUNT = 2;

const bodyTypes = [
  ["SUV", "suv"],
  ["Berline", "berline"],
  ["Citadine", "citadine"],
  ["Break", "break"],
  ["Monospace / Van", "monospace"],
  ["Coupé", "coupe"],
  ["Cabriolet", "cabriolet"],
  ["Pickup", "pickup"],
];

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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSending, setFormSending] = useState(false);
  const [heroBrand, setHeroBrand] = useState("");
  const [heroModel, setHeroModel] = useState("");
  const [heroBudget, setHeroBudget] = useState("");

  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const [arrivalsPage, setArrivalsPage] = useState(0);
  const [arrivalsPaused, setArrivalsPaused] = useState(false);
  const arrivalsPauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const arrivals = useMemo(() => [...vehicles].sort((a, b) => b.id - a.id).slice(0, ARRIVALS_PAGE_SIZE * ARRIVALS_PAGE_COUNT), [vehicles]);
  const arrivalsPages = useMemo(() => {
    const pages: Vehicle[][] = [];
    for (let i = 0; i < arrivals.length; i += ARRIVALS_PAGE_SIZE) pages.push(arrivals.slice(i, i + ARRIVALS_PAGE_SIZE));
    return pages;
  }, [arrivals]);

  useEffect(() => {
    if (arrivalsPaused || arrivalsPages.length < 2) return;
    const interval = setInterval(() => setArrivalsPage((page) => (page + 1) % arrivalsPages.length), 5000);
    return () => clearInterval(interval);
  }, [arrivalsPaused, arrivalsPages.length]);

  const goToArrivalsPage = (page: number) => {
    setArrivalsPage(page);
    setArrivalsPaused(true);
    if (arrivalsPauseTimeout.current) clearTimeout(arrivalsPauseTimeout.current);
    arrivalsPauseTimeout.current = setTimeout(() => setArrivalsPaused(false), 8000);
  };

  const heroBrandOptions = useMemo(() => [...new Set(vehicles.map((vehicle) => getDetail(vehicle, "Marque")))].filter(Boolean), [vehicles]);
  const heroModelOptions = useMemo(
    () =>
      [...new Set(vehicles.filter((vehicle) => !heroBrand || getDetail(vehicle, "Marque") === heroBrand).map((vehicle) => getDetail(vehicle, "Modèle")))].filter(
        Boolean
      ),
    [vehicles, heroBrand]
  );

  const selectHeroBrand = (value: string) => {
    setHeroBrand(value);
    setHeroModel("");
  };

  const runHeroSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (heroBrand) params.set("marque", heroBrand);
    if (heroModel) params.set("modele", heroModel);
    if (heroBudget) params.set("prixMax", heroBudget);
    router.push(`/vehicules${params.toString() ? `?${params.toString()}` : ""}`);
  };

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
          Planète <b>Auto</b>
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
        <a className="nav-cta" href="tel:+33467825412">
          <Phone size={16} /> Nous appeler maintenant
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero hero-photo" id="top">
        <div className="hero-bg" style={{ backgroundImage: "url('/hero-pic.jpg')" }} />
        <div className="hero-photo-inner">
        <div className="hero-photo-content">
          <div className="hero-photo-card">
            <h1>
              Une voiture d’occasion,
              <br />
              <em>en toute confiance.</em>
            </h1>
            <form className="hero-search-box" onSubmit={runHeroSearch} aria-label="Recherche rapide de véhicule">
              <div className="hero-search-box-fields">
                <label>
                  <span>Marque</span>
                  <select value={heroBrand} onChange={(event) => selectHeroBrand(event.target.value)}>
                    <option value="">Toutes les marques</option>
                    {heroBrandOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Modèle</span>
                  <select value={heroModel} onChange={(event) => setHeroModel(event.target.value)} disabled={heroModelOptions.length === 0}>
                    <option value="">Tous les modèles</option>
                    {heroModelOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Budget maximum</span>
                  <select value={heroBudget} onChange={(event) => setHeroBudget(event.target.value)}>
                    <option value="">Tous les budgets</option>
                    <option value="10000">Moins de 10 000 €</option>
                    <option value="16000">Moins de 16 000 €</option>
                    <option value="22000">Moins de 22 000 €</option>
                    <option value="30000">Moins de 30 000 €</option>
                  </select>
                </label>
                <button type="submit">
                  <Search size={17} /> Rechercher
                </button>
              </div>
              <a className="hero-search-advanced" href="/vehicules">
                Recherche avancée
              </a>
            </form>
          </div>
          <a className="hero-sell-cta" href="/reprise">
            <Tag size={17} /> Vendre ma voiture <ArrowRight size={15} />
          </a>
        </div>
        <p className="hero-photo-intro">
          Découvrez nos véhicules toutes marques et bénéficiez d’un accompagnement simple pour l’achat, la reprise, le financement et les
          démarches administratives.
        </p>
        </div>
      </section>

      <section className="carrosserie-section" aria-label="Recherchez par type de carrosserie">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> Recherchez Par type de carrosserie
            </div>
          </div>
          <a className="text-link" href="/vehicules">
            Toutes les voitures <ArrowRight size={17} />
          </a>
        </div>
        <div className="carrosserie-grid">
          {bodyTypes.map(([label, slug]) => (
            <button
              className="carrosserie-tile"
              key={slug}
              onClick={() => router.push(`/vehicules?carrosserie=${encodeURIComponent(label)}`)}
            >
              <img src={`/carrosserie/${slug}.png`} alt="" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="arrivals-section" aria-labelledby="arrivals-title">
        <div className="section-heading">
          <div>
            <h2 id="arrivals-title">
              Nouveaux
              <br />
              <em>arrivages</em>
            </h2>
            <p>Découvrez nos nouveaux arrivages de véhicules d’occasion disponibles chez Planète Auto.</p>
          </div>
          <Link className="text-link" href="/vehicules">
            Voir tout le stock <ArrowRight size={17} />
          </Link>
        </div>
        <div className="arrivals-carousel" onMouseEnter={() => setArrivalsPaused(true)} onMouseLeave={() => setArrivalsPaused(false)}>
          <div className="arrivals-viewport">
          <div className="arrivals-track" style={{ transform: `translateX(-${arrivalsPage * 100}%)` }}>
            {arrivalsPages.map((page, pageIndex) => (
              <div className="inventory-grid arrivals-page" key={pageIndex}>
                {page.map((vehicle, index) => {
                  const favorite = isFavorite(vehicle.id);
                  const icons = getFeatureIcons(vehicle);
                  const visibleIcons = icons.slice(0, 6);
                  const extraCount = icons.length - visibleIcons.length;
                  return (
                    <article className="inventory-card" key={vehicle.id}>
                      <Link href={`/vehicules/${vehicle.id}`} className="inventory-card-image">
                        <Image
                          src={vehicle.image}
                          alt={`${vehicle.name} ${vehicle.meta}`}
                          fill
                          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                          priority={pageIndex === 0 && index < 2}
                        />
                        <span className={`inventory-card-tag ${/bon plan|baisse|promo/i.test(vehicle.tag) ? "is-deal" : ""}`}>{vehicle.tag}</span>
                        <button
                          type="button"
                          className={`inventory-favorite ${favorite ? "is-favorite" : ""}`}
                          aria-label={`${favorite ? "Retirer" : "Ajouter"} ${vehicle.name} des favoris`}
                          onClick={(event) => {
                            event.preventDefault();
                            toggleFavorite(vehicle.id);
                          }}
                        >
                          <Heart fill={favorite ? "currentColor" : "none"} aria-hidden="true" />
                        </button>
                      </Link>
                      <div className="inventory-card-body">
                        <p className="inventory-card-year">
                          {vehicle.year} · {vehicle.km}
                        </p>
                        <div className="inventory-card-top">
                          <div>
                            <h3>{vehicle.name}</h3>
                            <p>{vehicle.meta}</p>
                          </div>
                          <strong>{vehicle.price}</strong>
                        </div>
                        {visibleIcons.length > 0 && (
                          <div className="inventory-card-icons">
                            {visibleIcons.map(({ key, label, icon: Icon }) => (
                              <span key={key} title={label} aria-label={label}>
                                <Icon size={16} aria-hidden />
                              </span>
                            ))}
                            {extraCount > 0 && <span className="inventory-card-icons-more">+{extraCount}</span>}
                          </div>
                        )}
                        <div className="inventory-card-bottom">
                          <span>{vehicle.fuel}</span>
                          <span>{vehicle.gearbox}</span>
                        </div>
                      </div>
                      <Link href={`/vehicules/${vehicle.id}`} className="inventory-card-cta">
                        Voir le véhicule <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
          </div>
          {arrivalsPages.length > 1 && (
            <>
              <button
                type="button"
                className="arrivals-arrow arrivals-arrow-prev"
                aria-label="Page précédente"
                disabled={arrivalsPage === 0}
                onClick={() => goToArrivalsPage(Math.max(0, arrivalsPage - 1))}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className="arrivals-arrow arrivals-arrow-next"
                aria-label="Page suivante"
                disabled={arrivalsPage === arrivalsPages.length - 1}
                onClick={() => goToArrivalsPage(Math.min(arrivalsPages.length - 1, arrivalsPage + 1))}
              >
                <ChevronRight />
              </button>
              <div className="arrivals-dots">
                {arrivalsPages.map((_, pageIndex) => (
                  <button
                    type="button"
                    key={pageIndex}
                    className={pageIndex === arrivalsPage ? "is-active" : ""}
                    aria-label={`Page ${pageIndex + 1}`}
                    onClick={() => goToArrivalsPage(pageIndex)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

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
            <button className="brand-tile" key={slug} onClick={() => router.push(`/vehicules?marque=${encodeURIComponent(name)}`)}>
              <img src={`https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`} alt="" />
              <span>{name}</span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
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
