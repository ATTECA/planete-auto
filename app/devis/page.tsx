import type { Metadata } from 'next'
import { PageShell, QuoteForm } from '@/components/site-pages'
import { QUOTE_SERVICES } from '@/lib/workshop-services'

export const metadata: Metadata = {
  title: 'Demander un devis atelier',
  description: 'Demandez un devis pour une prestation de mécanique, carrosserie ou pneumatique chez Planète Auto à Saint-Jean-de-Védas.',
}

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ prestation?: string | string[] }> }) {
  // Links from /prestations pre-select the service, e.g. /devis?prestation=Pneumatique
  const { prestation } = await searchParams
  const defaultService = QUOTE_SERVICES.find((service) => service === prestation)

  return (
    <PageShell
      title={<>Un devis pour<br /><em>votre véhicule.</em></>}
      intro="Décrivez-nous le problème rencontré et les travaux souhaités. Notre équipe vous recontactera pour étudier votre demande."
    >
      <section className="contact-page-grid quote-page-grid">
        <QuoteForm defaultService={defaultService} />
      </section>
    </PageShell>
  )
}
