'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, CarFront, Check, Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

const iconLogo = '/planete-auto-logo.png'

export function SiteHeader() {
  return <><div className="topline"><span>Planète Auto</span><span>Votre mobilité, notre exigence.</span><span>Saint-Jean-de-Védas · Occitanie</span></div><header className="navbar"><a href="/" className="brand"><img src={iconLogo} alt="" /><span>Planète <b>Auto</b></span></a><nav className="nav-links" aria-label="Navigation principale"><a href="/vehicules">Véhicules</a><a href="/reprise">Reprise</a><a href="/a-propos">À propos</a><a href="/contact">Contact</a></nav><a className="nav-cta" href="/contact">Parlons de votre projet <ArrowRight size={16} /></a></header></>
}

export function SiteFooter() {
  return <footer><a href="/" className="footer-brand"><img src={iconLogo} alt="" /><span>Planète <b>Auto</b></span></a><span>© 2026 Planète Auto · SIRET 799 787 262 00010</span><a href="/mentions-legales">Mentions légales <ArrowRight size={15} /></a></footer>
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
  return <><PageShell eyebrow="À propos de Planète Auto" title={<>L'automobile,<br /><em>autrement.</em></>} intro="Une sélection exigeante, un conseil transparent et une relation de confiance pour chaque projet automobile."><section className="page-section split-page"><div className="copy-block"><div className="eyebrow"><span className="eyebrow-line" /> Notre histoire</div><h2>Une autre idée<br /><em>de l'occasion.</em></h2></div><div className="copy-block"><p>Planète Auto est un professionnel indépendant spécialisé dans la sélection et la vente de véhicules d'occasion à Saint-Jean-de-Védas.</p><p>Chaque véhicule est choisi avec soin, contrôlé et préparé avant sa mise en vente. Notre priorité : vous accompagner avec des informations claires et un conseil réellement personnalisé.</p><ul><li>Véhicules sélectionnés avec exigence</li><li>Accompagnement du premier échange à la remise des clés</li><li>Garantie et transparence à chaque étape</li></ul></div></section><section className="dark-callout"><div><div className="eyebrow light"><span className="eyebrow-line" /> Notre engagement</div><h2>Le conseil avant<br /><em>la transaction.</em></h2></div><p>Parce qu'un achat automobile mérite du temps, de l'écoute et de la confiance.</p></section></PageShell></>
}

export { CarFront, ShieldCheck }
