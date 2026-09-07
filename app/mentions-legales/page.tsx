import type { Metadata } from 'next'
import { PageShell } from '@/components/site-pages'

export const metadata: Metadata = {
	title: 'Mentions légales',
	description: 'Mentions légales et informations sur Planète Auto, concessionnaire de véhicules d’occasion à Saint-Jean-de-Védas.',
}

export default function LegalPage() { return <PageShell eyebrow="Informations légales" title={<>Planète<br /><em>Auto.</em></>} intro="Les informations légales de la société Planète Auto."><section className="page-section legal-content"><h2>Éditeur du site</h2><p><strong>Planète Auto</strong><br />SARL au capital de 30 000 €<br />2371 Route de Lavérune, 34430 Saint-Jean-de-Védas<br />Tél. : 04 67 82 54 12<br />E-mail : planeteauto34@gmail.com</p><h2>Identification</h2><p>SIREN : 799 787 262<br />SIRET : 799 787 262 00010<br />RCS : 799 787 262<br />Code NAF : 4511Z<br />N° TVA : FR62 799 787 262</p><h2>Garantie</h2><p>Les véhicules bénéficient d'une garantie de 3 mois ou 5 000 km, couvrant la boîte de vitesses et le moteur, selon les conditions applicables.</p></section></PageShell> }
