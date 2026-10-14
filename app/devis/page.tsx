import type { Metadata } from 'next'
import { PageShell, QuoteForm } from '@/components/site-pages'

export const metadata: Metadata = {
  title: 'Demander un devis atelier | Planète Auto',
  description: 'Demandez un devis pour une prestation de mécanique, carrosserie ou pneumatique chez Planète Auto à Saint-Jean-de-Védas.',
}

export default function QuotePage() {
  return (
    <PageShell
      title={<>Un devis pour<br /><em>votre véhicule.</em></>}
      intro="Décrivez-nous le problème rencontré et les travaux souhaités. Notre équipe vous recontactera pour étudier votre demande."
    >
      <section className="contact-page-grid quote-page-grid">
        <QuoteForm />
      </section>
    </PageShell>
  )
}
