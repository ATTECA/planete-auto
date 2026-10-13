import { describe, expect, it } from 'vitest'
import { vehicleSlug, parseVehicleIdParam, vehicleStatusCategory, groupVehicleFacts } from '@/lib/vehicles'
import { renderEmailHtml } from '@/lib/email-template'

describe('vehicleSlug', () => {
  it('builds a URL slug from the id, name and meta', () => {
    const slug = vehicleSlug({ id: 16, name: 'BMW X5', meta: 'E70 3.0 V6 TDI 245ch' })
    expect(slug).toBe('16-bmw-x5-e70-3-0-v6-tdi-245ch')
  })

  it('removes accents', () => {
    const slug = vehicleSlug({ id: 3, name: 'Citroën C3', meta: 'Élégance' })
    expect(slug).toBe('3-citroen-c3-elegance')
  })

  it('falls back to just the id when name and meta are empty', () => {
    expect(vehicleSlug({ id: 7, name: '', meta: '' })).toBe('7')
  })
})

describe('parseVehicleIdParam', () => {
  it('gets the id from a slug', () => {
    expect(parseVehicleIdParam('16-bmw-x5')).toBe('16')
  })

  it('works with just a number', () => {
    expect(parseVehicleIdParam('16')).toBe('16')
  })

  it('returns null when there is no number at the start', () => {
    expect(parseVehicleIdParam('bmw-16')).toBeNull()
  })

  it('returns null for an empty address', () => {
    expect(parseVehicleIdParam('')).toBeNull()
  })  
})

describe('vehicleStatusCategory', () => {
  it('works with Disponible', () => {
    expect(vehicleStatusCategory('Disponible')).toBe('disponible')
  })

  it('works with Réservé', () => {
    expect(vehicleStatusCategory('Réservé')).toBe('reserve')
  })

  it('works with Vendu', () => {
    expect(vehicleStatusCategory('Vendu')).toBe('vendu')
  })

  it('works with Archivé', () => {
    expect(vehicleStatusCategory('Archivé')).toBe('archive')
  })

  it('returns autre when value doesnt match', () => {
    expect(vehicleStatusCategory('test')).toBe('autre')
  })
})

describe('groupVehicleFacts', () => {
  it('puts known labels in their section', () => {
    const result = groupVehicleFacts([['Marque', 'BMW']])
    expect(result).toEqual([
      { title: 'Identité', facts: [['Marque', 'BMW']] },
    ])
  })

  it('puts unknown labels in Autres informations', () => {
    const result = groupVehicleFacts([['info', 'info']])
    expect(result).toEqual([
      { title: 'Autres informations', facts: [['info', 'info']] },
    ])
  })  

  it('sorts a mix of details into sections in page order', () => {
    const result = groupVehicleFacts([
      ['Kilométrage', '120 000 km'],
      ['Garantie', '12 mois'],
      ['Marque', 'BMW'],
    ])
    expect(result).toEqual([
      { title: 'Identité', facts: [['Marque', 'BMW']] },
      { title: 'Année & kilométrage', facts: [['Kilométrage', '120 000 km']] },
      { title: 'Autres informations', facts: [['Garantie', '12 mois']] },
    ])
  })    
})

describe('renderEmailHtml', () => {
  it('includes the heading and the form values', () => {
    const html = renderEmailHtml({
      heading: 'Nouvelle demande de reprise',
      rows: [{ label: 'Nom', value: 'Jean Dupont' }],
    })
    expect(html).toContain('Nouvelle demande de reprise')
    expect(html).toContain('Jean Dupont')
  })    

  it('escapes HTML typed by the visitor', () => {
    const html = renderEmailHtml({
      heading: 'Test',
      rows: [{ label: 'Nom', value: '<b>Jean</b>' }],
    })

    expect(html).not.toContain('<b>Jean</b>')
    expect(html).toContain('&lt;b&gt;Jean&lt;/b&gt;')
  })

})