import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: "Véhicules d'occasion toutes marques",
    // Re-declared so vehicle pages below this layout keep the brand suffix.
    template: "%s | Planète Auto",
  },
  description: 'Découvrez les véhicules d’occasion disponibles chez Planète Auto à Saint-Jean-de-Védas : toutes marques, reprise, financement et garanties.',
}

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return children
}
