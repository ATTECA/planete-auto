import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { PageShell } from '@/components/site-pages'
import { WORKSHOP_SERVICES } from '@/lib/workshop-services'

export const metadata: Metadata = {
  title: 'Nos prestations',
  description:
    'Mécanique, carrosserie, pneumatique, pièces de rechange, diagnostic et lavage : l’atelier Planète Auto à Saint-Jean-de-Védas s’occupe de votre véhicule.',
}

export default function ServicesPage() {
  return (
    <PageShell
      title={<>Nos<br /><em>prestations.</em></>}
      intro="Entretien, réparation, pneus, pièces, diagnostic ou lavage : notre atelier s’occupe de votre véhicule, toutes marques."
    >
      <nav className="services-jump" aria-label="Aller à une prestation">
        {WORKSHOP_SERVICES.map(({ slug, label, icon: Icon }) => (
          <a key={slug} href={`#${slug}`}>
            <Icon size={16} aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <div className="services-list">
        {WORKSHOP_SERVICES.map(({ slug, label, image, icon: Icon, description, items, quoteService }, index) => (
          <section className="service-block" id={slug} key={slug} aria-labelledby={`${slug}-title`}>
            <div className="service-block-photo">
              <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" priority={index === 0} />
            </div>
            <div className="service-block-text">
              <span className="service-block-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h2 id={`${slug}-title`}>{label}</h2>
              <p>{description}</p>
              <ul>
                {items.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="service-block-actions">
                <a className="service-button service-button-dark" href={`/devis?prestation=${encodeURIComponent(quoteService)}`}>
                  Demander un devis <ArrowRight size={16} />
                </a>
                <a className="service-button service-button-soft" href="tel:+33467825412">
                  <Phone size={16} /> 04 67 82 54 12
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
