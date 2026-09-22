'use client'

import { useMemo, useState } from 'react'

const DEFAULT_TAEG = 6.9
const TAEG_MIN = 1
const TAEG_MAX = 15
const TAEG_STEP = 0.1
const DEPOSIT_MIN = 10
const DEPOSIT_MAX = 50
const DEPOSIT_STEP = 5
const TERM_MIN = 12
const TERM_MAX = 72
const TERM_STEP = 12

function formatEuros(amount: number) {
  return `${Math.round(amount).toLocaleString('fr-FR')} €`
}

export function FinanceCalculator({ price }: { price: string }) {
  const vehiclePrice = useMemo(() => Number(price.replace(/\D/g, '')) || 0, [price])
  const [depositPercent, setDepositPercent] = useState(20)
  const [term, setTerm] = useState(48)
  const [taeg, setTaeg] = useState(DEFAULT_TAEG)

  const depositAmount = Math.round((vehiclePrice * depositPercent) / 100)
  const financedAmount = vehiclePrice - depositAmount
  const monthlyRate = taeg / 100 / 12
  const monthlyPayment = monthlyRate === 0
    ? financedAmount / term
    : (financedAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -term)
  const totalPayable = depositAmount + monthlyPayment * term

  if (!vehiclePrice) return null

  return (
    <div className="finance-calculator">
      <div className="finance-calculator-header">Financez ce véhicule</div>
      <div className="finance-calculator-body">
        <div className="finance-calculator-row">
          <span>Prix du véhicule</span>
          <strong>{price}</strong>
        </div>

        <label className="finance-calculator-field">
          <div className="finance-calculator-field-top">
            <span>Apport</span>
            <strong>
              {depositPercent}% ({formatEuros(depositAmount)})
            </strong>
          </div>
          <input
            type="range"
            min={DEPOSIT_MIN}
            max={DEPOSIT_MAX}
            step={DEPOSIT_STEP}
            value={depositPercent}
            onChange={(event) => setDepositPercent(Number(event.target.value))}
            aria-label="Apport"
          />
          <div className="finance-calculator-field-bounds">
            <span>{DEPOSIT_MIN}%</span>
            <span>{DEPOSIT_MAX}%</span>
          </div>
        </label>

        <label className="finance-calculator-field">
          <div className="finance-calculator-field-top">
            <span>Durée</span>
            <strong>{term} mois</strong>
          </div>
          <input
            type="range"
            min={TERM_MIN}
            max={TERM_MAX}
            step={TERM_STEP}
            value={term}
            onChange={(event) => setTerm(Number(event.target.value))}
            aria-label="Durée"
          />
          <div className="finance-calculator-field-bounds">
            <span>{TERM_MIN} mois</span>
            <span>{TERM_MAX} mois</span>
          </div>
        </label>

        <label className="finance-calculator-field">
          <div className="finance-calculator-field-top">
            <span>Taux (TAEG)</span>
            <strong>{taeg.toFixed(1).replace('.', ',')} %</strong>
          </div>
          <input
            type="range"
            min={TAEG_MIN}
            max={TAEG_MAX}
            step={TAEG_STEP}
            value={taeg}
            onChange={(event) => setTaeg(Number(event.target.value))}
            aria-label="Taux (TAEG)"
          />
          <div className="finance-calculator-field-bounds">
            <span>{TAEG_MIN} %</span>
            <span>{TAEG_MAX} %</span>
          </div>
        </label>

        <div className="finance-calculator-rule" />

        <div className="finance-calculator-row finance-calculator-highlight">
          <span>Mensualité estimée</span>
          <strong>{formatEuros(monthlyPayment)}/mois</strong>
        </div>
        <div className="finance-calculator-row finance-calculator-detail">
          <span>Coût total (prix + crédit)</span>
          <span>{formatEuros(totalPayable)}</span>
        </div>

        <p className="finance-calculator-disclaimer">
          Simulation indicative, hors assurance, sous réserve d'acceptation du dossier par l'organisme prêteur.
        </p>
      </div>
    </div>
  )
}
