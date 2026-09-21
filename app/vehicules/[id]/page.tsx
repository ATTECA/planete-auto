import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight, Armchair, Calendar, CarFront, ClipboardList, Clock3, Fuel, Gauge, Mail, Phone, Radio, Settings2, ShieldCheck, Sparkles, SunMedium } from 'lucide-react'
import Link from 'next/link'
import { getVehicle, groupVehicleFacts, parseVehicleIdParam, vehicleSlug } from '@/lib/vehicles'
import { DEFAULT_EQUIPMENT_ITEM_ICON, EQUIPMENT_ITEM_ICONS } from '@/lib/equipment-icons'
import { SiteFooter, SiteHeader, VehicleRequestPanel, VehicleShareButton } from '@/components/site-pages'
import { VehicleGallery } from '@/components/vehicle-gallery'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const id = parseVehicleIdParam((await params).id)
  const vehicle = id ? await getVehicle(id) : undefined
  if (!vehicle) return { title: 'Véhicule introuvable' }
  return {
    title: `${vehicle.name} ${vehicle.meta}`,
    description: `${vehicle.name} ${vehicle.meta}, ${vehicle.year}, ${vehicle.km}, ${vehicle.fuel} et ${vehicle.gearbox}. Consultez la fiche et contactez Planète Auto à Saint-Jean-de-Védas.`,
  }
}

const FACT_GROUP_ICONS: Record<string, ReactNode> = {
  'Identité': <CarFront size={18} />,
  'Année & kilométrage': <Calendar size={18} />,
  'Moteur & performances': <Settings2 size={18} />,
  'Confort & dimensions': <Sparkles size={18} />,
  'Autres informations': <ClipboardList size={18} />,
}

const EQUIPMENT_ICONS: Record<string, ReactNode> = {
  'Audio - Télécommunications': <Radio size={17} />,
  'Conduite': <Gauge size={17} />,
  'Extérieur': <SunMedium size={17} />,
  'Intérieur': <Armchair size={17} />,
  'Sécurité': <ShieldCheck size={17} />,
  'Autres équipements et informations': <ClipboardList size={17} />,
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const rawParam = (await params).id
  const id = parseVehicleIdParam(rawParam)
  if (!id) notFound()
  const vehicle = await getVehicle(id)
  if (!vehicle) notFound()

  const canonicalSlug = vehicleSlug(vehicle)
  if (rawParam !== canonicalSlug) {
    permanentRedirect(`/vehicules/${canonicalSlug}`)
  }

  const gallery = vehicle.gallery.length ? vehicle.gallery : [vehicle.image]
  const reference = vehicle.id
  const factGroups = groupVehicleFacts(vehicle.details ?? [])

  return <main className="vehicle-detail-page"><SiteHeader />
    <div className="vehicle-detail-shell">
      <div className="vehicle-breadcrumb"><Link href="/vehicules"><ArrowLeft /> Retour au stock</Link><span>Planète Auto <b>/</b> {vehicle.name} <b>/</b> Réf. {reference}</span></div>

      <div className="vehicle-detail-layout">
        <VehicleGallery name={vehicle.name} meta={vehicle.meta} images={gallery} showWarranty />
        <aside className="vehicle-aside">
          <div className="vehicle-purchase">
            <div className="vehicle-purchase-top"><span className="vehicle-status">{vehicle.status}</span><div className="vehicle-purchase-top-right"><span className="vehicle-ref">Réf. {reference}</span><VehicleShareButton title={`${vehicle.name} — ${vehicle.price}`} /></div></div>
            <h1>{vehicle.name}</h1>
            <p className="vehicle-version">{vehicle.meta}</p>
            <div className="purchase-rule" />
            <strong className="showroom-price">{vehicle.price}</strong>
            <div className="vehicle-summary"><span><Calendar size={19} /> {vehicle.year}</span><span><Gauge size={19} /> {vehicle.km}</span><span><Fuel size={19} /> {vehicle.fuel}</span><span><Settings2 size={19} /> {vehicle.gearbox}</span></div>
            <div className="showroom-actions">
              <a className="button button-red showroom-cta" href="tel:+33467825412">Réserver ce véhicule <ArrowUpRight /></a>
              <a className="button button-black showroom-cta" href="#offre">Faire une offre <ArrowUpRight /></a>
            </div>
            <div className="showroom-trust"><ShieldCheck /><span>Véhicule contrôlé et préparé par Planète Auto</span></div>
            <div className="vehicle-finance"><Clock3 /><span>Une question ? Notre équipe vous répond au <a href="tel:+33467825412">+33 4 67 82 54 12</a></span></div>
          </div>
        </aside>
      </div>

      <section className="vehicle-facts">
        <div className="vehicle-section-heading"><span className="eyebrow"><span className="eyebrow-line" /> Fiche technique</span></div>
        <div className="facts-groups">
          {factGroups.map((group) => (
            <div className="facts-group" key={group.title}>
              <h3>{FACT_GROUP_ICONS[group.title]}{group.title}</h3>
              <div className="facts-grid">{group.facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="vehicle-description">
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> Description</span>
        </div>
        <div>
          <p className="vehicle-description-copy">
            {(vehicle.description ?? `${vehicle.name} ${vehicle.meta}, disponible chez Planète Auto à Saint-Jean-de-Védas.`).trim().replace(/\n{3,}/g, '\n\n')}
          </p>
        </div>
      </section>

      {vehicle.equipment && vehicle.equipment.length > 0 && (
        <section className="vehicle-equipment">
          <div className="vehicle-section-heading"><span className="eyebrow"><span className="eyebrow-line" /> Équipements</span></div>
          <div className="equipment-groups">
            {vehicle.equipment.map((group) => (
              <div className="equipment-group" key={group.category}>
                <h3>{EQUIPMENT_ICONS[group.category] ?? <ClipboardList size={17} />}{group.category}</h3>
                <ul>{group.items.map((item) => {
                  const ItemIcon = EQUIPMENT_ITEM_ICONS[item] ?? DEFAULT_EQUIPMENT_ITEM_ICON
                  return <li key={item}><ItemIcon size={14} />{item}</li>
                })}</ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="vehicle-closing">
        <div><h2>Intéressé par ce véhicule ?</h2><p>Contactez-nous pour organiser une visite, poser vos questions ou étudier une reprise.</p><div className="vehicle-closing-contacts"><a href="tel:+33467825412"><Phone size={16} /> +33 4 67 82 54 12</a><a href="mailto:planeteauto34@gmail.com"><Mail size={16} /> planeteauto34@gmail.com</a></div></div>
        <div id="offre"><VehicleRequestPanel vehicleId={vehicle.id} vehicleName={vehicle.name} vehiclePrice={vehicle.price} /></div>
      </section>
    </div>
    <SiteFooter />
  </main>
}
