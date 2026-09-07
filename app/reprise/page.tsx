import type { Metadata } from 'next'
import { PageShell, ContactForm } from '@/components/site-pages'

export const metadata: Metadata = {
	title: 'Reprise de voiture à Saint-Jean-de-Védas | Planète Auto',
	description: 'Faites reprendre votre voiture par Planète Auto et avancez vers votre prochain véhicule avec un accompagnement simple et personnalisé.',
}

export default function ReprisePage() { return <PageShell eyebrow="Reprise de votre voiture" title={<>Faites reprendre<br /><em>votre voiture.</em></>} intro="Décrivez-nous votre véhicule et nous vous recontacterons pour étudier sa reprise."><section className="page-section split-page"><div className="copy-block"><span className="card-kicker">Une démarche simple</span><h2>Votre ancienne voiture peut aider à financer <em>la prochaine.</em></h2><p>Indiquez-nous les informations principales de votre véhicule. Vous pouvez également ajouter quelques photos pour faciliter son étude.</p><ul><li>Étude personnalisée</li><li>Réponse rapide</li><li>Reprise toutes marques</li><li>Accompagnement administratif</li></ul></div><ContactForm subject="votre reprise" /></section></PageShell> }
