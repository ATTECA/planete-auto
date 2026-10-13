import { expect, test } from '@playwright/test'

test('a visitor can open a car from the homepage', async ({ page }) => {
  await page.goto('/')

  const firstCard = page.locator('.inventory-card').first()
  const carName = await firstCard.locator('h3').textContent()

  await firstCard.getByRole('link', { name: 'Voir le véhicule' }).click()

  await expect(page).toHaveURL(/\/vehicules\/\d+-/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(carName!)
})

test('a bad car address shows a 404', async ({ page }) => {
  const response = await page.goto('/vehicules/bmw-16')
  expect(response?.status()).toBe(404)
})
