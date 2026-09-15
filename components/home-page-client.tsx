"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Euro,
  FileText,
  Heart,
  Layers,
  Leaf,
  Phone,
  Menu,
  Search,
  ShieldCheck,
  Star,
  Tag,
  TrendingDown,
  Wrench,
  X,
} from "lucide-react";
import { SiteFooter } from "@/components/site-pages";
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

const brandLogoSize: Record<string, number> = {
  ford: 68,
  opel: 68,
  nissan: 55,
  audi: 68,
  toyota: 60,
};

const googleReviews = [
  {
    name: "David Samblanet",
    text: "Quand on est satisfait, il faut savoir le dire. Nous avons acheté un véhicule d’occasion, conforme au descriptif, garantie 3 mois. Très bon accueil, un service professionnel au top. Je recommande.",
  },
  {
    name: "Ismail Hemani",
    text: "J’ai acheté ma voiture chez Planète Autos, et j’en suis ravi. Le service est excellent et le prix très raisonnable par rapport aux autres concessionnaires. Je recommande à tous ceux qui envisagent d’acheter un véhicule.",
  },
  {
    name: "Amina Hemani",
    text: "Concession fiable, personnel à l’écoute et pas de mauvaise surprise sur le véhicule. Transaction fluide du début à la fin. Je recommande.",
  },
  {
    name: "Craig Mamilo",
    text: "Un garage que je fréquente depuis 10 ans et que j’ai recommandé à tous mes proches. La fiabilité est au rendez-vous à chaque fois, que ce soit pour les réparations ou l’entretien. C’est rare de nos jours de trouver un garage aussi sérieux et de confiance.",
  },
  {
    name: "sarah_sbr 17",
    text: "Nous avons récemment acheté notre voiture dans ce garage et nous sommes très satisfaits de notre expérience. L’équipe a été réactive et professionnelle tout au long du processus. Le patron est une personne intègre et honnête, ce qui nous a tout de suite mis en confiance.",
  },
  {
    name: "Kevin Coulm",
    text: "J’ai acheté un véhicule avec une garantie de 6 mois. J’ai rencontré un problème pendant cette période, le vendeur a immédiatement fait le nécessaire.",
  },
];

export default function HomePageClient({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
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
          <a href="/contact" onClick={() => setMenuOpen(false)}>
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
        <div className="hero-bg" />
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
        <div className="brands-section-inner">
          <h2 id="brands-title" className="brands-heading">
            Les marques
            <br />
            <em>que nous proposons</em>
          </h2>
          <div className="brands-card">
            <div className="brands-grid">
              {brands.map(([name, slug]) => (
                <button className="brand-tile" key={slug} onClick={() => router.push(`/vehicules?marque=${encodeURIComponent(name)}`)}>
                  <span className="brand-tile-icon">
                    <img
                      src={`/brands/${slug}.webp`}
                      alt=""
                      style={brandLogoSize[slug] ? { width: brandLogoSize[slug], height: brandLogoSize[slug] } : undefined}
                    />
                  </span>
                  <span className="brand-tile-name">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="why-section" id="services" aria-labelledby="why-title">
        <div className="why-banner">
          <div className="why-banner-photo">
            <Image src="/why-cover.png" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div className="why-banner-panel">
            <h2 id="why-title">Pourquoi choisir Planète Auto</h2>
            <ul className="why-list">
              <li>
                <CarFront size={18} /> Achat, vente et reprise de véhicules toutes marques
              </li>
              <li>
                <ShieldCheck size={18} /> Garantie 3 mois ou 5 000 km sur la boîte et le moteur
              </li>
              <li>
                <CreditCard size={18} /> Paiement échelonné ou jusqu’à 3 fois par carte bleue
              </li>
              <li>
                <Tag size={18} /> Dossiers de financement étudiés, sans plafond
              </li>
              <li>
                <Wrench size={18} /> Grosse et légère mécanique effectuées à notre garage
              </li>
              <li>
                <FileText size={18} /> Démarches administratives prises en charge (carte grise, déclaration d’achat)
              </li>
            </ul>
            <Link href="/vehicules" className="why-cta">
              Voir nos véhicules
            </Link>
          </div>
        </div>
      </section>

      <section className="occasion-section" aria-labelledby="occasion-title">
        <div className="occasion-inner">
          <h2 id="occasion-title">
            Pourquoi acheter
            <br />
            <em>une voiture d’occasion</em>
          </h2>
          <div className="occasion-grid">
            <div className="occasion-item">
              <Euro size={22} />
              <h3>Un prix plus accessible</h3>
              <p>La plus forte dépréciation a déjà eu lieu : vous payez le véhicule à sa juste valeur.</p>
            </div>
            <div className="occasion-item">
              <Tag size={22} />
              <h3>Plus d’équipements pour le budget</h3>
              <p>Accédez à des finitions et options qui seraient hors de portée sur un modèle neuf équivalent.</p>
            </div>
            <div className="occasion-item">
              <CalendarDays size={22} />
              <h3>Disponibilité immédiate</h3>
              <p>Repartez avec votre véhicule tout de suite, sans les délais de commande du neuf.</p>
            </div>
            <div className="occasion-item">
              <Layers size={22} />
              <h3>Un choix plus large</h3>
              <p>Comparez librement les années, motorisations et kilométrages pour trouver le bon compromis.</p>
            </div>
            <div className="occasion-item">
              <TrendingDown size={22} />
              <h3>Une revente plus sereine</h3>
              <p>Le véhicule a déjà connu sa plus grosse perte de valeur, la revente future est plus prévisible.</p>
            </div>
            <div className="occasion-item">
              <Leaf size={22} />
              <h3>Un geste pour l’environnement</h3>
              <p>Prolonger la vie d’un véhicule existant plutôt que d’en produire un nouveau limite son impact.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-section" aria-labelledby="reviews-title">
        <div className="reviews-inner">
          <div className="reviews-header">
            <h2 id="reviews-title">
              Ce que disent
              <br />
              <em>nos clients</em>
            </h2>
            <div className="reviews-score">
              <span className="reviews-score-number">4,3</span>
              <div>
                <div className="reviews-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} fill={index < 4 ? "currentColor" : "none"} />
                  ))}
                </div>
                <p>169 avis Google</p>
              </div>
            </div>
          </div>
          <div className="reviews-grid">
            {googleReviews.map((review) => (
              <div className="review-card" key={review.name}>
                <div className="reviews-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" />
                  ))}
                </div>
                <p>{review.text}</p>
                <span className="review-name">{review.name}</span>
              </div>
            ))}
          </div>
          <a
            className="reviews-cta"
            href="https://www.google.com/search?q=planete+auto+saint+jean+de+v%C3%A9das"
            target="_blank"
            rel="noreferrer"
          >
            Voir tous les avis Google <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <SiteFooter />

      <a href="#top" className="back-to-top" aria-label="Retour en haut de la page">
        <ArrowUp size={20} />
      </a>
    </main>
  );
}
