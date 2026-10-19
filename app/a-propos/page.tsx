import type { Metadata } from 'next'
import { AboutPageContent } from '@/components/site-pages'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez Planète Auto, professionnel indépendant de la voiture d’occasion à Saint-Jean-de-Védas, près de Montpellier.',
}

export default function AboutPage() {
  return <AboutPageContent />
}
