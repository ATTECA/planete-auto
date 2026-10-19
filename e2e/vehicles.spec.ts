import { expect, test } from '@playwright/test'

test('a visitor can open a car from the homepage', async ({ page }) => {
  await page.goto('/')

  const firstCard = page.locator('.inventory-card').first()
  const carName = await firstCard.locator('h3').textContent()

  await firstCard.getByRole('link', { name: 'Voir le véhicule' }).click()

  await expect(page).toHaveURL(/\/vehicules\/\d+-/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(carName!)
})

test('a visitor can open the contact page from the homepage hero', async ({ page }) => {
  await page.goto('/')

  const heroActions = page.locator('.hero-actions')
  await expect(heroActions.getByRole('link', { name: 'Vendre ma voiture' })).toBeVisible()
  const contactLink = heroActions.getByRole('link', { name: 'Nous contacter' })
  await expect(contactLink).toBeVisible()

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(contactLink).toBeVisible()
  await contactLink.click()

  await expect(page).toHaveURL(/\/contact$/)
})

test('the workshop strip shows service photos without the separate quote callout', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.workshop-strip .workshop-tile')).toHaveCount(6)
  await expect(page.locator('.workshop-strip .workshop-quote-cta')).toHaveCount(0)
})

test('a workshop tile opens its section on the services page, and its quote link pre-selects the service', async ({ page }) => {
  await page.goto('/')

  await page.locator('.workshop-strip .workshop-tile', { hasText: 'Pneumatique' }).click()
  await expect(page).toHaveURL(/\/prestations#pneumatique$/)
  const section = page.locator('#pneumatique')
  await expect(section).toBeInViewport()

  await section.getByRole('link', { name: 'Demander un devis' }).click()
  await expect(page).toHaveURL(/\/devis\?prestation=Pneumatique$/)
  await expect(page.getByLabel('Type de prestation')).toHaveValue('Pneumatique')
})

test('a visitor can request a quote from the sticky homepage button', async ({ page }) => {
  await page.goto('/')

  const quoteCta = page.getByRole('link', { name: 'Demander un devis' })
  const desktopBox = await quoteCta.boundingBox()
  expect(desktopBox).not.toBeNull()
  expect(desktopBox!.x).toBeGreaterThan(600)
  expect(desktopBox!.x + desktopBox!.width).toBeLessThanOrEqual(1280)
  expect(desktopBox!.width).toBeLessThan(140)
  await expect(quoteCta.locator('svg')).toBeVisible()
  await expect(quoteCta.locator('.floating-quote-label')).toHaveText('Demanderun devis')

  await page.setViewportSize({ width: 390, height: 844 })
  const mobileBox = await quoteCta.boundingBox()
  expect(mobileBox).not.toBeNull()
  expect(mobileBox!.x).toBeGreaterThanOrEqual(0)
  expect(mobileBox!.x + mobileBox!.width).toBeLessThanOrEqual(390)

  await quoteCta.click()

  await expect(page).toHaveURL(/\/devis$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('votre véhicule.')
  await expect(page.getByRole('link', { name: 'Demander un devis' })).toHaveCount(0)
})

test('a visitor can submit a separate workshop quote request', async ({ page }) => {
  await page.route('**/api/devis', async (route) => {
    await route.fulfill({ json: { ok: true } })
  })
  await page.goto('/devis')

  await page.getByLabel('Votre nom').fill('Camille Martin')
  await page.getByLabel('Votre téléphone').fill('0612345678')
  await page.getByLabel('Votre adresse e-mail (facultatif)').fill('camille@example.com')
  await page.getByLabel('Votre véhicule').fill('Peugeot 208')
  await page.getByLabel('Immatriculation (facultatif)').fill('ab-123-cd')
  await page.getByLabel('Type de prestation').selectOption('Mécanique')
  await page.getByLabel('Décrivez le problème ou les travaux souhaités').fill('Bruit au freinage')
  await page.getByRole('button', { name: 'Envoyer ma demande de devis' }).click()

  await expect(page.getByRole('heading', { name: 'Votre demande de devis est bien reçue.' })).toBeVisible()
})

test('a bad car address shows a 404', async ({ page }) => {
  const response = await page.goto('/vehicules/bmw-16')
  expect(response?.status()).toBe(404)
})
