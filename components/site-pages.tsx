"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Calendar,
  CarFront,
  Check,
  Clock3,
  Fuel,
  Gauge,
  ImagePlus,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Palette,
  Phone,
  Repeat,
  Settings2,
  ShieldCheck,
  Share2,
  Sparkles,
  Tag,
  User,
  X,
} from "lucide-react";

const iconLogo = "/planete-auto-logo.png";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="topline">
        <span>Planète Auto</span>
        <span>Achat · vente · reprise toutes marques</span>
        <span>Saint-Jean-de-Védas · Occitanie</span>
      </div>
      <header className="navbar">
        <a href="/" className="brand">
          <img src={iconLogo} alt="" />
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
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <img className="footer-tracks" src="/car-tracks.png" alt="" aria-hidden="true" />
      <div className="footer-grid">
        <div className="footer-identity">
          <a href="/" className="footer-brand">
            <img src={iconLogo} alt="Planète Auto logo" />
            Planète <b>Auto</b>
          </a>
          <p>Véhicules d’occasion toutes marques, achat, vente et reprise.</p>
          <span>
            SIREN : 799 787 262
            <br />
            SIRET : 799 787 262 00010
          </span>
          <nav className="socials" aria-label="Réseaux sociaux">
            <a href="#" aria-label="Instagram" className="social-link social-instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.35" cy="6.65" r="1" className="social-dot" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="social-link social-facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.7 20v-7h2.35l.35-2.75h-2.7V8.5c0-.8.23-1.35 1.4-1.35h1.45V4.7c-.25-.04-1.08-.1-2.08-.1-2.07 0-3.47 1.26-3.47 3.58v2.07H8.65V13H11v7h2.7Z" />
              </svg>
            </a>
          </nav>
        </div>
        <div className="footer-column">
          <h3>Navigation</h3>
          <a href="/">Accueil</a>
          <a href="/vehicules">Nos véhicules</a>
          <a href="/reprise">Vente & reprise</a>
          <a href="/contact">Nous contacter</a>
        </div>
        <div className="footer-column footer-find">
          <h3>Nous trouver</h3>
          <span>
            <MapPin size={15} />
            2371 Route de Lavérune
            <br />
            34430 Saint-Jean-de-Védas
          </span>
          <a href="tel:+33467825412">
            <Phone size={15} />
            +33 4 67 82 54 12
          </a>
          <a href="mailto:planeteauto34@gmail.com">
            <Mail size={15} />
            planeteauto34@gmail.com
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
        <div className="footer-column footer-hours">
          <h3>Horaires</h3>
          <span>
            <strong>Lundi–vendredi</strong>
            <br />
            09h00–12h30 · 14h00–18h00
          </span>
          <span>
            <strong>Samedi</strong>
            <br />
            10h00–17h00
          </span>
          <span>Dimanche : fermé</span>
          <div className="footer-map-frame">
            <iframe
              title="Planète Auto sur Google Maps"
              src="https://www.google.com/maps?q=43.5931637,3.8320012&z=16&output=embed"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <img src="/footer-bottom-icon.png" alt="Planète Auto logo" />
        <span>Planète Auto © 2026 · SIRET 799 787 262 00010</span>
        <a href="/mentions-legales">Mentions légales</a>
      </div>
    </footer>
  );
}

export function PageShell({ eyebrow, title, intro, children }: { eyebrow?: string; title: ReactNode; intro: string; children: ReactNode }) {
  return (
    <main className="inner-shell">
      <SiteHeader />
      <section className="page-hero">
        {eyebrow && (
          <div className="eyebrow">
            <span className="eyebrow-line" /> {eyebrow}
          </div>
        )}
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      {children}
      <SiteFooter />
    </main>
  );
}

export function ContactForm({ subject = "votre projet" }: { subject?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: [form.get("phone") && `Téléphone : ${form.get("phone")}`, form.get("message")].filter(Boolean).join("\n\n"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L’envoi a échoué. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };
  if (sent)
    return (
      <div className="form-success">
        <Check size={30} />
        <h3>Demande bien reçue.</h3>
        <p>Nous reviendrons vers vous rapidement.</p>
      </div>
    );
  return (
    <form className="standalone-form" onSubmit={submit}>
      <div className="form-heading">
        <span>CONTACT</span>
        <h3>Parlez-nous de {subject}</h3>
      </div>
      <label>
        Votre nom
        <input name="name" required placeholder="Prénom Nom" />
      </label>
      <label>
        Votre téléphone
        <input name="phone" placeholder="04 00 00 00 00" />
      </label>
      <label>
        Votre adresse e-mail
        <input name="email" required type="email" placeholder="vous@exemple.fr" />
      </label>
      <label>
        Votre message
        <textarea name="message" required rows={4} placeholder="Écrivez votre demande..." />
      </label>
      <label className="consent">
        <input type="checkbox" required /> J'accepte d'être recontacté au sujet de ma demande.
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-red" type="submit" disabled={sending}>
        {sending ? "Envoi en cours..." : "Envoyer ma demande"} <ArrowRight size={17} />
      </button>
    </form>
  );
}

const TRADEIN_BRANDS = [
  "Peugeot",
  "Renault",
  "Citroën",
  "Volkswagen",
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Nissan",
  "Opel",
  "Ford",
  "Toyota",
  "Fiat",
  "Alfa Romeo",
];
const TRADEIN_YEARS = Array.from({ length: 50 }, (_, i) => String(2026 - i));
const TRADEIN_CONDITIONS = ["Excellent état", "Bon état", "État correct", "À réviser"];
const MAX_TRADEIN_PHOTOS = 8;

const initialTradeInVehicle = { brand: "", model: "", year: "", mileage: "", gearbox: "", fuel: "", color: "", condition: "" };
const initialTradeInContact = { name: "", email: "", phone: "", message: "" };

export function TradeInForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [intent, setIntent] = useState<"reprise" | "vente">("reprise");
  const [vehicle, setVehicle] = useState(initialTradeInVehicle);
  const [contact, setContact] = useState(initialTradeInContact);
  const [photos, setPhotos] = useState<File[]>([]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setPhotos((current) => [...current, ...files].slice(0, MAX_TRADEIN_PHOTOS));
    event.target.value = "";
  };

  const removePhoto = (index: number) => setPhotos((current) => current.filter((_, i) => i !== index));

  const goToStep2 = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(2);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSending(true);
    const form = new FormData();
    form.set("intent", intent);
    Object.entries(vehicle).forEach(([key, value]) => form.set(key, value));
    Object.entries(contact).forEach(([key, value]) => form.set(key, value));
    photos.forEach((photo) => form.append("photos", photo));
    try {
      const response = await fetch("/api/reprise", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L’envoi a échoué. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  if (sent)
    return (
      <div className="tradein-form tradein-success">
        <Check size={34} />
        <h3>Demande bien reçue.</h3>
        <p>Nous reviendrons vers vous rapidement pour étudier votre véhicule.</p>
      </div>
    );

  return (
    <div className="tradein-wrap">
      <div className="tradein-form">
        <div className="tradein-tabs">
          <div className={step === 1 ? "active" : "is-done"}>1. Votre véhicule</div>
          <div className={step === 2 ? "active" : ""}>2. Vos coordonnées</div>
        </div>

        {step === 1 ? (
          <form className="tradein-step" onSubmit={goToStep2}>
            <div className="tradein-grid">
              <label className="tradein-field-group">
                <CarFront size={18} />
                <input
                  required
                  list="tradein-brands"
                  value={vehicle.brand}
                  onChange={(event) => setVehicle({ ...vehicle, brand: event.target.value })}
                  placeholder="Marque (ex. Peugeot, BMW...)"
                />
                <datalist id="tradein-brands">
                  {TRADEIN_BRANDS.map((brand) => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
              </label>
              <label className="tradein-field-group">
                <Tag size={18} />
                <input
                  required
                  value={vehicle.model}
                  onChange={(event) => setVehicle({ ...vehicle, model: event.target.value })}
                  placeholder="Modèle (ex. 308, Clio, A3...)"
                />
              </label>
              <label className="tradein-field-group">
                <Calendar size={18} />
                <select value={vehicle.year} onChange={(event) => setVehicle({ ...vehicle, year: event.target.value })}>
                  <option value="" disabled>
                    Année
                  </option>
                  {TRADEIN_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                  <option value="Avant 1977">Avant 1977</option>
                </select>
              </label>
              <label className="tradein-field-group">
                <Gauge size={18} />
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={vehicle.mileage}
                  onChange={(event) => setVehicle({ ...vehicle, mileage: event.target.value })}
                  placeholder="Kilométrage (ex. 85000)"
                />
              </label>
              <label className="tradein-field-group">
                <Settings2 size={18} />
                <select value={vehicle.gearbox} onChange={(event) => setVehicle({ ...vehicle, gearbox: event.target.value })}>
                  <option value="" disabled>
                    Type de boîte
                  </option>
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
              </label>
              <label className="tradein-field-group">
                <Fuel size={18} />
                <select value={vehicle.fuel} onChange={(event) => setVehicle({ ...vehicle, fuel: event.target.value })}>
                  <option value="" disabled>
                    Type de carburant
                  </option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </label>
              <label className="tradein-field-group">
                <Palette size={18} />
                <input
                  value={vehicle.color}
                  onChange={(event) => setVehicle({ ...vehicle, color: event.target.value })}
                  placeholder="Couleur (ex. Gris, Noir...)"
                />
              </label>
              <label className="tradein-field-group">
                <Sparkles size={18} />
                <select value={vehicle.condition} onChange={(event) => setVehicle({ ...vehicle, condition: event.target.value })}>
                  <option value="" disabled>
                    Décrivez l'état du véhicule
                  </option>
                  {TRADEIN_CONDITIONS.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="tradein-photos">
              <span className="tradein-photos-label">
                Photos du véhicule{" "}
                <span>
                  ({photos.length}/{MAX_TRADEIN_PHOTOS})
                </span>
              </span>
              <div className="tradein-photos-grid">
                {Array.from({ length: MAX_TRADEIN_PHOTOS }, (_, index) => {
                  const photo = photos[index];
                  if (photo)
                    return (
                      <div className="tradein-photo" key={`${photo.name}-${index}`}>
                        <img src={URL.createObjectURL(photo)} alt="" />
                        <button type="button" onClick={() => removePhoto(index)} aria-label="Retirer la photo">
                          <X size={14} />
                        </button>
                      </div>
                    );
                  if (index === photos.length)
                    return (
                      <button type="button" className="tradein-photo-add" key="add" onClick={() => fileInputRef.current?.click()}>
                        <ImagePlus size={20} />
                        <span>Ajouter</span>
                      </button>
                    );
                  return <div className="tradein-photo-empty" key={`empty-${index}`} />;
                })}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={addPhotos} />
            </div>

            <button className="button button-red tradein-submit" type="submit">
              Continuer <ArrowRight size={17} />
            </button>
          </form>
        ) : (
          <form className="tradein-step" onSubmit={submit}>
            <div className="tradein-grid">
              <label className="tradein-field-group">
                <User size={18} />
                <input
                  required
                  value={contact.name}
                  onChange={(event) => setContact({ ...contact, name: event.target.value })}
                  placeholder="Prénom Nom"
                />
              </label>
              <label className="tradein-field-group">
                <Phone size={18} />
                <input
                  value={contact.phone}
                  onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                  placeholder="Téléphone (ex. 04 00 00 00 00)"
                />
              </label>
              <label className="tradein-field-group">
                <Mail size={18} />
                <input
                  required
                  type="email"
                  value={contact.email}
                  onChange={(event) => setContact({ ...contact, email: event.target.value })}
                  placeholder="vous@exemple.fr"
                />
              </label>
              <label className="tradein-field-group">
                <MessageSquare size={18} />
                <textarea
                  rows={4}
                  value={contact.message}
                  onChange={(event) => setContact({ ...contact, message: event.target.value })}
                  placeholder="Précisions utiles sur votre véhicule..."
                />
              </label>
              <label className="tradein-field-group">
                <Repeat size={18} />
                <select value={intent} onChange={(event) => setIntent(event.target.value as "reprise" | "vente")}>
                  <option value="reprise">Reprise (j'achète un véhicule chez vous)</option>
                  <option value="vente">Vente directe (je vends sans en racheter un)</option>
                </select>
              </label>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="tradein-actions">
              <button type="button" className="button button-ghost" onClick={() => setStep(1)}>
                Retour
              </button>
              <button className="button button-red" type="submit" disabled={sending}>
                {sending ? "Envoi en cours..." : "Envoyer ma demande"} <ArrowRight size={17} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function VehicleOfferForm({ vehicleName, vehiclePrice }: { vehicleName: string; vehiclePrice: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [offer, setOffer] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, offer, vehicleName, vehiclePrice }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L’envoi a échoué. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  if (sent)
    return (
      <div className="vehicle-offer vehicle-offer-success">
        <Check size={26} />
        <h3>Offre envoyée.</h3>
        <p>Nous revenons vers vous rapidement au sujet de {vehicleName}.</p>
      </div>
    );

  return (
    <form className="vehicle-offer" onSubmit={submit}>
      <h3>Faire une offre</h3>
      <label>
        Nom complet
        <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Prénom Nom" />
      </label>
      <label>
        Téléphone
        <input required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="04 00 00 00 00" />
      </label>
      <label>
        Prix proposé
        <input
          required
          type="number"
          min={0}
          inputMode="numeric"
          value={offer}
          onChange={(event) => setOffer(event.target.value)}
          placeholder={`Prix affiché : ${vehiclePrice}`}
        />
      </label>
      <label>
        E-mail (facultatif)
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-red" type="submit" disabled={sending}>
        {sending ? "Envoi en cours..." : "Envoyer une offre"} <ArrowRight size={17} />
      </button>
    </form>
  );
}

export function VehicleShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button type="button" className="vehicle-share" onClick={share}>
      <Share2 size={15} />
      {copied ? "Lien copié" : "Partager"}
    </button>
  );
}

export function ContactInfo() {
  return (
    <div className="info-panel">
      <div className="eyebrow light">
        <span className="eyebrow-line" /> Planète Auto
      </div>
      <h2>
        Une équipe
        <br />
        <em>à votre écoute.</em>
      </h2>
      <div className="info-list">
        <div>
          <MapPin size={18} />
          <span>
            <strong>2371 Route de Lavérune</strong>
            <br />
            34430 Saint-Jean-de-Védas
          </span>
        </div>
        <div>
          <Phone size={18} />
          <span>
            <strong>+33 4 67 82 54 12</strong>
          </span>
        </div>
        <div>
          <Mail size={18} />
          <span>
            <strong>planeteauto34@gmail.com</strong>
          </span>
        </div>
        <div>
          <Clock3 size={18} />
          <span>
            <strong>Lundi–vendredi</strong>
            <br />
            09h00–12h30 · 14h00–18h00
            <br />
            <strong>Samedi</strong>
            <br />
            10h00–17h00
          </span>
        </div>
      </div>
    </div>
  );
}

export function ServiceCard({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) {
  return (
    <article className="service-card">
      <span className="service-number">{number}</span>
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function AboutPageContent() {
  return (
    <>
      <PageShell
        eyebrow="À propos de Planète Auto"
        title={
          <>
            L’occasion,
            <br />
            <em>en toute simplicité.</em>
          </>
        }
        intro="Planète Auto vous accompagne pour l’achat, la vente et la reprise de véhicules d’occasion toutes marques à Saint-Jean-de-Védas."
      >
        <section className="page-section split-page">
          <div className="copy-block">
            <div className="eyebrow">
              <span className="eyebrow-line" /> Notre activité
            </div>
            <h2>
              Une voiture d’occasion
              <br />
              <em>sans complication</em>
            </h2>
          </div>
          <div className="copy-block">
            <p>
              Planète Auto est un professionnel indépendant de l’achat, de la vente et de la reprise de véhicules d’occasion toutes marques.
            </p>
            <p>
              Nous vous accompagnons également pour le financement, les garanties et les démarches administratives, de la première visite à
              la remise des clés.
            </p>
            <ul>
              <li>Véhicules toutes marques</li>
              <li>Reprise de votre ancien véhicule</li>
              <li>Financement et garanties</li>
              <li>Démarches administratives prises en charge</li>
            </ul>
          </div>
        </section>
        <section className="dark-callout">
          <div>
            <div className="eyebrow light">
              <span className="eyebrow-line" /> Notre engagement
            </div>
            <h2>
              Acheter une voiture
              <br />
              <em>sans mauvaise surprise.</em>
            </h2>
          </div>
          <p>Des informations claires, un accompagnement direct et des solutions adaptées à votre projet.</p>
        </section>
      </PageShell>
    </>
  );
}

export { CarFront, ShieldCheck };
