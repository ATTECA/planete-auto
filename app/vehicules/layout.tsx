import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Véhicules d'occasion à vendre",
  description: 'Découvrez les véhicules d’occasion sélectionnés et contrôlés par Planète Auto à Saint-Jean-de-Védas, près de Montpellier.',
}

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return children
}
