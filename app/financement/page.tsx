import { ContactForm, PageShell } from '@/components/site-pages'

export const metadata = { title: 'Financement | Planète Auto', description: 'Une solution de financement adaptée à votre projet automobile.' }

export default function FinancementPage() {
  return <PageShell eyebrow="Financement automobile" title={<>Votre projet, <em>à votre rythme.</em></>} intro="Nous vous accompagnons pour trouver une solution de financement claire et adaptée à votre budget."><section className="page-section split-page"><div className="copy-block"><div className="eyebrow"><span className="eyebrow-line" /> Une solution sur mesure</div><h2>Financez votre<br /><em>prochain départ.</em></h2><p>Parlez-nous de votre projet. Nous étudions avec vous les possibilités disponibles, sans engagement.</p><ul><li>Étude personnalisée de votre budget</li><li>Accompagnement transparent</li><li>Réponse adaptée à votre véhicule</li><li>Possibilité de financement avec garantie</li></ul></div><ContactForm subject="votre financement" /></section></PageShell>
}
