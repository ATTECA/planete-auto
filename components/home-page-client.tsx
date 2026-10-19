"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  CalendarDays,
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
  X,
} from "lucide-react";
import { SiteFooter } from "@/components/site-pages";
import { useFavorites } from "@/lib/use-favorites";
import { getFeatureIcons } from "@/lib/vehicle-features";
import { googleReviews, GOOGLE_REVIEWS_COUNT, GOOGLE_REVIEWS_SCORE, GOOGLE_REVIEWS_URL } from "@/lib/reviews";
import { vehicleSlug, type Vehicle } from "@/lib/vehicles";
import { WORKSHOP_SERVICES } from "@/lib/workshop-services";

const getDetail = (vehicle: Vehicle, label: string) => vehicle.details.find(([key]) => key === label)?.[1] ?? "";
const ARRIVALS_MAX = 16;
// Up to this many cars, one row is enough (it fills a large screen without needing to move).
const ARRIVALS_SINGLE_ROW_MAX = 4;
const ARRIVALS_INTERVAL_MS = 5000;
const ARRIVALS_RESUME_AFTER_CLICK_MS = 8000;


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

export default function HomePageClient({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroBrand, setHeroBrand] = useState("");
  const [heroModel, setHeroModel] = useState("");
  const [heroBudget, setHeroBudget] = useState("");

  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  // Newest cars split over two rows: row 1 gets the first half (rounded up), row 2 the rest.
  const arrivalRows = useMemo(() => {
    const newest = [...vehicles].sort((a, b) => b.id - a.id).slice(0, ARRIVALS_MAX);
    if (newest.length <= ARRIVALS_SINGLE_ROW_MAX) return [newest];
    const half = Math.ceil(newest.length / 2);
    return [newest.slice(0, half), newest.slice(half)];
  }, [vehicles]);

  const heroBrandOptions = useMemo(() => [...new Set(vehicles.map((vehicle) => getDetail(vehicle, "Marque")))].filter(Boolean), [vehicles]);
  const heroModelOptions = useMemo(
    () =>
      [...new Set(vehicles.filter((vehicle) => !heroBrand || getDetail(vehicle, "Marque") === heroBrand).map((vehicle) => getDetail(vehicle, "Modèle")))].filter(
        Boolean
      ),
    [vehicles, heroBrand]
  );

  const heroMatchCount = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          (!heroBrand || getDetail(vehicle, "Marque") === heroBrand) &&
          (!heroModel || getDetail(vehicle, "Modèle") === heroModel) &&
          (!heroBudget || Number(vehicle.price.replace(/\D/g, "")) <= Number(heroBudget))
      ).length,
    [vehicles, heroBrand, heroModel, heroBudget]
  );

  const bodyTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const vehicle of vehicles) if (vehicle.carrosserie) counts[vehicle.carrosserie] = (counts[vehicle.carrosserie] ?? 0) + 1;
    return counts;
  }, [vehicles]);

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
          <a href="/prestations" onClick={() => setMenuOpen(false)}>
            Nos prestations
          </a>
          <a href="/devis" onClick={() => setMenuOpen(false)}>
            Devis atelier
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
            <div className="hero-photo-heading">
              <span className="hero-experience-badge">
                <Award size={14} /> 15 ans d’expérience
              </span>
              <h1>
                Une voiture d’occasion,
                <br />
                <em>en toute confiance.</em>
              </h1>
            </div>
            <form className="hero-search-box" onSubmit={runHeroSearch} aria-label="Recherche rapide de véhicule">
              <div className="hero-mobile-tabs">
                <span className="is-active" aria-current="true">
                  Acheter
                </span>
                <a href="/reprise">Vendre ma voiture</a>
              </div>
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
                    <option value="5000">Moins de 5 000 €</option>
                    <option value="8000">Moins de 8 000 €</option>
                    <option value="10000">Moins de 10 000 €</option>
                    <option value="15000">Moins de 15 000 €</option>
                  </select>
                </label>
                <button type="submit">
                  <Search size={17} /> <span className="hero-search-label">Rechercher</span>
                  <span className="hero-search-count" aria-live="polite">
                    {heroMatchCount === 0 ? "Aucun véhicule trouvé" : `Voir ${heroMatchCount} véhicule${heroMatchCount > 1 ? "s" : ""}`}
                  </span>
                </button>
              </div>
              <a className="hero-search-advanced" href="/vehicules">
                Recherche avancée
              </a>
            </form>
          </div>
          <div className="hero-actions">
            <a className="hero-sell-cta" href="/reprise">
              <Tag size={17} /> Vendre ma voiture <ArrowRight size={15} />
            </a>
            <Link className="hero-sell-cta" href="/contact">
              Nous contacter <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <p className="hero-photo-intro">
          Découvrez nos véhicules toutes marques et bénéficiez d’un accompagnement simple pour l’achat, la reprise, le financement et les
          démarches administratives.
        </p>
        </div>
      </section>

      <section className="workshop-strip" aria-label="Notre atelier">
        <div className="workshop-strip-items">
          {WORKSHOP_SERVICES.map(({ slug, label, detail, image, icon: Icon }) => (
            <Link className="workshop-tile" key={slug} href={`/prestations#${slug}`}>
              <Image src={image} alt="" fill sizes="(max-width: 850px) 50vw, (max-width: 1100px) 33vw, 16vw" />
              <div className="workshop-tile-caption">
                <Icon size={16} aria-hidden="true" />
                <div>
                  <h3>{label}</h3>
                  <p>{detail}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="carrosserie-section" aria-labelledby="carrosserie-title">
        <div className="section-heading">
          <div>
            <h2 id="carrosserie-title">
              Quel type de{" "}
              <br />
              <em>véhicule&nbsp;?</em>
            </h2>
            <p>SUV, berline, citadine… parcourez notre stock par type de carrosserie.</p>
          </div>
          <a className="text-link" href="/vehicules">
            Toutes les voitures <ArrowRight size={17} />
          </a>
        </div>
        <div className="carrosserie-grid">
          {bodyTypes.map(([label, slug]) => {
            const count = bodyTypeCounts[label] ?? 0;
            return (
              <button
                className={count === 0 ? "carrosserie-tile is-empty" : "carrosserie-tile"}
                key={slug}
                onClick={() => router.push(`/vehicules?carrosserie=${encodeURIComponent(label)}`)}
              >
                <img src={`/carrosserie/${slug}.png`} alt="" />
                <span>{label}</span>
                <small className="carrosserie-count">
                  {count} véhicule{count > 1 ? "s" : ""}
                </small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="arrivals-section" aria-labelledby="arrivals-title">
        <div className="section-heading">
          <div>
            <h2 id="arrivals-title">
              Nouveaux{" "}
              <br />
              <em>arrivages</em>
            </h2>
            <p>Découvrez nos nouveaux arrivages de véhicules d’occasion disponibles chez Planète Auto.</p>
          </div>
          <Link className="text-link" href="/vehicules">
            Voir tout le stock <ArrowRight size={17} />
          </Link>
        </div>
        {arrivalRows.map((rowVehicles, rowIndex) => (
          <ArrivalsRow
            key={rowIndex}
            vehicles={rowVehicles}
            label={rowIndex === 0 ? "Derniers arrivages" : "Arrivages précédents"}
            startDelayMs={rowIndex * (ARRIVALS_INTERVAL_MS / 2)}
            priorityImages={rowIndex === 0}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </section>

      <section className="brands-section" aria-labelledby="brands-title">
        <div className="brands-section-inner">
          <h2 id="brands-title" className="brands-heading">
            <span className="brands-heading-full">
              Les marques
              <br />
              <em>que nous proposons</em>
            </span>
            <span className="brands-heading-short">
              Nos <em>marques</em>
            </span>
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
            <Image src="/why-cover.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div className="why-banner-panel">
            <h2 id="why-title">Pourquoi choisir Planète Auto</h2>
            <ul className="why-list">
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
              <span className="reviews-title-full">
                Ce que disent
                <br />
                <em>nos clients</em>
              </span>
              <span className="reviews-title-short">
                Avis <em>clients</em>
              </span>
            </h2>
            <div className="reviews-score">
              <span className="reviews-score-number">{GOOGLE_REVIEWS_SCORE}</span>
              <div>
                <div className="reviews-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} fill={index < 4 ? "currentColor" : "none"} />
                  ))}
                </div>
                <p>{GOOGLE_REVIEWS_COUNT} avis Google</p>
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
            href={GOOGLE_REVIEWS_URL}
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

/**
 * How many arrival cards fit side by side. Must match the .arrivals-track breakpoints in globals.css.
 * 0 means phone: the row is a native swipe list and doesn't move on its own.
 */
function useArrivalsVisibleCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 850px)");
    const medium = window.matchMedia("(max-width: 1300px)");
    const update = () => setCount(phone.matches ? 0 : medium.matches ? 2 : 4);
    update();
    phone.addEventListener("change", update);
    medium.addEventListener("change", update);
    return () => {
      phone.removeEventListener("change", update);
      medium.removeEventListener("change", update);
    };
  }, []);
  return count;
}

/** One row of the "Nouveaux arrivages" section: slides one car at a time and loops back to the start. */
function ArrivalsRow({
  vehicles,
  label,
  startDelayMs,
  priorityImages,
  isFavorite,
  toggleFavorite,
}: {
  vehicles: Vehicle[];
  label: string;
  /** Offsets this row's timing so stacked rows never slide at the same moment. */
  startDelayMs: number;
  priorityImages: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}) {
  const visibleCount = useArrivalsVisibleCount();
  const lastPosition = visibleCount > 0 ? Math.max(0, vehicles.length - visibleCount) : 0;
  const canMove = lastPosition > 0;
  const [position, setPosition] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [clickPaused, setClickPaused] = useState(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = Math.min(position, lastPosition);

  useEffect(() => {
    if (!canMove || hovered || clickPaused) return;
    let timer: ReturnType<typeof setTimeout>;
    // Moves on a fixed clock (every 5 s, shifted by startDelayMs) rather than "5 s after the last move",
    // so the two rows stay out of step even after one of them was paused.
    const scheduleNext = () => {
      let wait = ARRIVALS_INTERVAL_MS - ((Date.now() - startDelayMs) % ARRIVALS_INTERVAL_MS);
      if (wait < 1500) wait += ARRIVALS_INTERVAL_MS;
      timer = setTimeout(() => {
        setPosition((value) => (value >= lastPosition ? 0 : value + 1));
        scheduleNext();
      }, wait);
    };
    scheduleNext();
    return () => clearTimeout(timer);
  }, [canMove, hovered, clickPaused, lastPosition, startDelayMs]);

  useEffect(() => () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  }, []);

  const goTo = (target: number) => {
    setPosition(target < 0 ? lastPosition : target > lastPosition ? 0 : target);
    setClickPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => setClickPaused(false), ARRIVALS_RESUME_AFTER_CLICK_MS);
  };

  return (
    <div
      className="arrivals-carousel"
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="arrivals-viewport">
        <div className="arrivals-track" style={{ "--arrivals-position": current } as CSSProperties}>
          {vehicles.map((vehicle, index) => {
            const favorite = isFavorite(vehicle.id);
            const icons = getFeatureIcons(vehicle);
            const visibleIcons = icons.slice(0, 6);
            const extraCount = icons.length - visibleIcons.length;
            return (
              <article className="inventory-card" key={vehicle.id}>
                <Link href={`/vehicules/${vehicleSlug(vehicle)}`} className="inventory-card-image">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} ${vehicle.meta}`}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1300px) 50vw, 25vw"
                    priority={priorityImages && index < 2}
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
                      {visibleIcons.map(({ key, label: iconLabel, icon: Icon }) => (
                        <span key={key} title={iconLabel} aria-label={iconLabel}>
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
                <Link href={`/vehicules/${vehicleSlug(vehicle)}`} className="inventory-card-cta">
                  Voir le véhicule <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      {canMove && (
        <>
          <button type="button" className="arrivals-arrow arrivals-arrow-prev" aria-label="Véhicule précédent" onClick={() => goTo(current - 1)}>
            <ChevronLeft />
          </button>
          <button type="button" className="arrivals-arrow arrivals-arrow-next" aria-label="Véhicule suivant" onClick={() => goTo(current + 1)}>
            <ChevronRight />
          </button>
          <div className="arrivals-dots">
            {Array.from({ length: lastPosition + 1 }, (_, dotIndex) => (
              <button
                type="button"
                key={dotIndex}
                className={dotIndex === current ? "is-active" : ""}
                aria-label={`Position ${dotIndex + 1}`}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
