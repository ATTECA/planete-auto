import type { Metadata } from 'next'
import { SiteHeader, SiteFooter, TradeInForm } from '@/components/site-pages'

export const metadata: Metadata = {
	title: 'Vente et reprise de voiture à Saint-Jean-de-Védas | Planète Auto',
	description: 'Vendez votre voiture ou faites-la reprendre par Planète Auto : décrivez votre véhicule, ajoutez des photos et recevez une réponse rapide.',
}

export default function ReprisePage() {
	return <main className="inner-shell">
		<SiteHeader />
		<div className="tradein-blackzone">
			<section className="tradein-hero">
				<div className="tradein-hero-glow" />
				<div className="tradein-hero-copy">
					<h1>Vendez ou faites reprendre<br /><em>votre voiture</em></h1>
					<p>Que vous souhaitiez vendre votre véhicule directement ou le faire reprendre en échange d'un prochain achat, décrivez-le-nous en quelques informations.</p>
					<div className="trust-row light"><div><strong>48h</strong><span>de réponse</span></div><div><strong>Toutes marques</strong><span>tous kilométrages</span></div><div><strong>0 frais</strong><span>d'estimation</span></div></div>
				</div>
				<img className="tradein-hero-car" src="/reprise-car-cutout.png" alt="" />
			</section>
			<section className="tradein-below">
				<div className="page-section tradein-page">
					<TradeInForm />
				</div>
				<div className="tradein-edge-glow" />
			</section>
		</div>
		<SiteFooter />
	</main>
}
