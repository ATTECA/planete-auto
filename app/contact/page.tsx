import type { Metadata } from 'next'
import { ContactForm, ContactInfo, PageShell } from '@/components/site-pages'

export const metadata: Metadata = {
	title: 'Contact | Planète Auto',
	description: 'Contactez Planète Auto à Saint-Jean-de-Védas pour toute question sur un véhicule, une reprise ou un financement.',
}

export default function ContactPage() {
	return <PageShell title={<>Une question ?<br /><em>Écrivez-nous.</em></>} intro="Notre équipe vous répond pour toute question sur l'achat, la vente ou la reprise de votre véhicule.">
		<section className="contact-page-grid">
			<ContactForm subject="votre projet" />
			<ContactInfo />
		</section>
	</PageShell>
}
