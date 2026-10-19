import type { Metadata } from 'next'
import { ContactForm, ContactInfo, PageShell } from '@/components/site-pages'

export const metadata: Metadata = {
	title: 'Contact',
	description: 'Contactez Planète Auto à Saint-Jean-de-Védas pour toute question sur nos véhicules et nos services.',
}

export default function ContactPage() {
	return <PageShell title={<>Une question ?<br /><em>Écrivez-nous.</em></>} intro="Notre équipe vous répond pour toute question sur nos véhicules et nos services.">
		<section className="contact-page-grid">
			<ContactForm subject="votre question" />
			<ContactInfo />
		</section>
	</PageShell>
}
