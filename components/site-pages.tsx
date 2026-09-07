'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, CarFront, Check, Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

const iconLogo = '/planete-auto-logo.png'

export function SiteHeader() {
  return <><div className="topline"><span>Planète Auto</span><span>Achat · vente · reprise toutes marques</span><span>Saint-Jean-de-Védas · Occitanie</span></div><header className="navbar"><a href="/" className="brand"><img src={iconLogo} alt="" /><span>Planète <b>Auto</b></span></a><nav className="nav-links" aria-label="Navigation principale"><a href="/vehicules">Véhicules</a><a href="/reprise">Reprise</a><a href="/a-propos">À propos</a><a href="/contact">Contact</a></nav><a className="nav-cta" href="/contact">Nous contacter <ArrowRight size={16} /></a></header></>
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-grid">
      <div className="footer-identity">
        <a href="/" className="footer-brand"><img src={iconLogo} alt="Planète Auto logo" /><span>Planète <b>Auto</b></span></a>
        <p>Véhicules d’occasion toutes marques, achat, vente et reprise.</p>
        <span>SIREN : 799 787 262<br />SIRET : 799 787 262 00010</span>
        <nav className="socials" aria-label="Réseaux sociaux">
          <a href="#" aria-label="Instagram" className="social-link social-instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.35" cy="6.65" r="1" className="social-dot" /></svg></a>
          <a href="#" aria-label="Facebook" className="social-link social-facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 20v-7h2.35l.35-2.75h-2.7V8.5c0-.8.23-1.35 1.4-1.35h1.45V4.7c-.25-.04-1.08-.1-2.08-.1-2.07 0-3.47 1.26-3.47 3.58v2.07H8.65V13H11v7h2.7Z" /></svg></a>
        </nav>
      </div>
      <div className="footer-column"><h3>Navigation</h3><a href="/">Accueil</a><a href="/vehicules">Nos véhicules</a><a href="/reprise">Reprise</a><a href="/contact">Nous contacter</a></div>
      <div className="footer-column footer-find"><h3>Nous trouver</h3><span><MapPin size={15} />2371 Route de Lavérune<br />34430 Saint-Jean-de-Védas</span><a href="tel:+33467825412"><Phone size={15} />04 67 82 54 12</a><a href="mailto:planeteauto34@gmail.com"><Mail size={15} />planeteauto34@gmail.com</a><a className="footer-map-link" href="https://www.google.com/maps/place/Plan%C3%A8te+autos/@43.5926281,3.8321068,18z" target="_blank" rel="noreferrer">Ouvrir dans Google Maps <ArrowRight size={14} /></a></div>
      <div className="footer-column footer-hours"><h3>Horaires</h3><span><strong>Lundi–vendredi</strong><br />09h00–12h30 · 14h00–18h00</span><span><strong>Samedi</strong><br />10h00–17h00</span><span>Dimanche : fermé</span><div className="footer-map-frame"><iframe title="Planète Auto sur Google Maps" src="https://www.google.com/maps?q=43.5931637,3.8320012&z=16&output=embed" loading="lazy" /></div></div>
    </div>
    <div className="footer-bottom"><img src={iconLogo} alt="Planète Auto logo" /><span>Planète Auto © 2026 · SIRET 799 787 262 00010</span><a href="/mentions-legales">Mentions légales</a></div>
  </footer>
}

export function PageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro: string; children: ReactNode }) {
  return <main className="inner-shell"><SiteHeader /><section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</div><h1>{title}</h1><p>{intro}</p></section>{children}<SiteFooter /></main>
}

export function ContactForm({ subject = 'votre projet' }: { subject?: string }) {
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true) }
  if (sent) return <div className="form-success"><Check size={30} /><h3>Demande bien reçue.</h3><p>Nous reviendrons vers vous rapidement.</p></div>
  return <form className="standalone-form" onSubmit={submit}><div className="form-heading"><span>CONTACT</span><h3>Parlez-nous de {subject}</h3></div><label>Votre nom<input required placeholder="Prénom Nom" /></label><label>Votre adresse e-mail<input required type="email" placeholder="vous@exemple.fr" /></label><label>Votre téléphone<input placeholder="04 00 00 00 00" /></label><label>Votre message<textarea required rows={4} placeholder="Écrivez votre demande..." /></label><label className="consent"><input type="checkbox" required /> J'accepte d'être recontacté au sujet de ma demande.</label><button className="button button-red" type="submit">Envoyer ma demande <ArrowRight size={17} /></button></form>
}

export function ContactInfo() {
  return <div className="info-panel"><div className="eyebrow light"><span className="eyebrow-line" /> Planète Auto</div><h2>Une équipe<br /><em>à votre écoute.</em></h2><div className="info-list"><div><MapPin size={18} /><span><strong>2371 Route de Lavérune</strong><br />34430 Saint-Jean-de-Védas</span></div><div><Phone size={18} /><span><strong>04 67 82 54 12</strong></span></div><div><Mail size={18} /><span><strong>planeteauto34@gmail.com</strong></span></div><div><Clock3 size={18} /><span><strong>Lundi–vendredi</strong><br />09h00–12h30 · 14h00–18h00<br /><strong>Samedi</strong><br />10h00–17h00</span></div></div><div className="map-frame"><iframe title="Localisation Planète Auto" src="https://www.openstreetmap.org/export/embed.html?bbox=3.828%2C43.588%2C3.836%2C43.598&layer=mapnik&marker=43.5931637%2C3.8320012" loading="lazy" /></div></div>
}

export function ServiceCard({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) { return <article className="service-card"><span className="service-number">{number}</span>{icon}<h3>{title}</h3><p>{text}</p></article> }

export function AboutPageContent() {
  return <><PageShell eyebrow="À propos de Planète Auto" title={<>L’occasion,<br /><em>en toute simplicité.</em></>} intro="Planète Auto vous accompagne pour l’achat, la vente et la reprise de véhicules d’occasion toutes marques à Saint-Jean-de-Védas."><section className="page-section split-page"><div className="copy-block"><div className="eyebrow"><span className="eyebrow-line" /> Notre activité</div><h2>Une voiture d’occasion<br /><em>sans complication.</em></h2></div><div className="copy-block"><p>Planète Auto est un professionnel indépendant de l’achat, de la vente et de la reprise de véhicules d’occasion toutes marques.</p><p>Nous vous accompagnons également pour le financement, les garanties et les démarches administratives, de la première visite à la remise des clés.</p><ul><li>Véhicules toutes marques</li><li>Reprise de votre ancien véhicule</li><li>Financement et garanties</li><li>Démarches administratives prises en charge</li></ul></div></section><section className="dark-callout"><div><div className="eyebrow light"><span className="eyebrow-line" /> Notre engagement</div><h2>Acheter une voiture<br /><em>sans mauvaise surprise.</em></h2></div><p>Des informations claires, un accompagnement direct et des solutions adaptées à votre projet.</p></section></PageShell></>
}

export { CarFront, ShieldCheck }
