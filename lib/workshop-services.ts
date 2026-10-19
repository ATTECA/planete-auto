import { Cog, Disc, Droplets, SprayCan, Stethoscope, Wrench, type LucideIcon } from 'lucide-react'

/**
 * Workshop services: the tiles under the home hero and the sections of /prestations.
 * Only mecanique.jpg is a real photo of the garage; the others are Unsplash stock photos until the client sends their own.
 */
export type WorkshopService = {
  /** Anchor on /prestations, e.g. /prestations#pneumatique. */
  slug: string
  label: string
  /** Short line on the home tile. */
  detail: string
  image: string
  icon: LucideIcon
  description: string
  items: string[]
  /** Value pre-selected in the devis form (must be one of QUOTE_SERVICES). */
  quoteService: QuoteService
}

/** Choices of the devis form, also checked by /api/devis. */
export const QUOTE_SERVICES = ['Mécanique', 'Carrosserie', 'Pneumatique', 'Pièces de rechange', 'Diagnostic', 'Lavage', 'Autre'] as const
export type QuoteService = (typeof QUOTE_SERVICES)[number]

export const WORKSHOP_SERVICES: WorkshopService[] = [
  {
    slug: 'mecanique',
    label: 'Mécanique',
    detail: 'Entretien et réparation',
    image: '/atelier/mecanique.jpg',
    icon: Wrench,
    description:
      'Entretien courant ou réparation, notre atelier s’occupe de votre véhicule toutes marques pour qu’il reste fiable et sûr au quotidien.',
    items: ['Vidange et révision', 'Freinage (disques, plaquettes)', 'Embrayage et distribution', 'Suspension et direction', 'Échappement'],
    quoteService: 'Mécanique',
  },
  {
    slug: 'carrosserie',
    label: 'Carrosserie',
    detail: 'Réparation et peinture',
    image: '/atelier/carrosserie.jpg',
    icon: SprayCan,
    description:
      'Un choc, une rayure ou un élément abîmé ? Nous redonnons à votre véhicule une carrosserie nette, de la petite retouche à la réparation plus importante.',
    items: ['Réparation après choc', 'Rayures et retouches', 'Peinture', 'Remplacement de pare-chocs et d’éléments'],
    quoteService: 'Carrosserie',
  },
  {
    slug: 'pneumatique',
    label: 'Pneumatique',
    detail: 'Vente et montage',
    image: '/atelier/pneumatique.jpg',
    icon: Disc,
    description:
      'Nous vous conseillons les pneus adaptés à votre véhicule et à votre conduite, et nous nous occupons du montage.',
    items: ['Vente de pneus', 'Montage et équilibrage', 'Réparation de crevaison', 'Contrôle de l’usure et de la pression'],
    quoteService: 'Pneumatique',
  },
  {
    slug: 'pieces-de-rechange',
    label: 'Pièces de rechange',
    detail: 'Batteries, disques, plaquettes…',
    image: '/atelier/pieces.jpg',
    icon: Cog,
    description:
      'Besoin d’une pièce ? Nous vous fournissons les pièces courantes et pouvons les poser directement à l’atelier.',
    items: ['Batteries', 'Disques et plaquettes', 'Filtres', 'Ampoules et essuie-glaces', 'Pièces sur commande'],
    quoteService: 'Pièces de rechange',
  },
  {
    slug: 'diagnostic',
    label: 'Diagnostic',
    detail: 'Recherche de pannes',
    image: '/atelier/diagnostic.jpg',
    icon: Stethoscope,
    description:
      'Un voyant allumé, un bruit inhabituel, une perte de puissance ? Nous recherchons l’origine de la panne avant toute intervention.',
    items: ['Lecture des codes défaut à la valise', 'Voyants allumés au tableau de bord', 'Pannes électriques', 'Bruits et comportements anormaux'],
    quoteService: 'Diagnostic',
  },
  {
    slug: 'lavage',
    label: 'Lavage',
    detail: 'Nettoyage du véhicule',
    image: '/atelier/lavage.jpg',
    icon: Droplets,
    description: 'Pour rouler dans un véhicule propre, ou le préparer avant une vente, nous prenons en charge son nettoyage.',
    items: ['Lavage extérieur', 'Nettoyage intérieur', 'Aspiration'],
    quoteService: 'Lavage',
  },
]
