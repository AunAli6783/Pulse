import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Prescriptions', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
  })

  test('shows prescriptions page', async ({ page }) => {
    await page.goto('/dashboard/prescriptions')
    await expect(page.locator('h1')).toContainText('Prescriptions')
  })

  test('doctor can access prescriptions page', async ({ page }) => {
    await loginAs(page, 'abdulbari@clinic.com', 'admin123')
    await page.goto('/doctor/prescriptions')
    await expect(page.locator('h1')).toContainText('Prescriptions')
  })

  test('shows empty state when no prescriptions', async ({ page }) => {
    await page.goto('/dashboard/prescriptions')
    const empty = page.locator('text=No prescriptions')
    const rows = page.locator('table tbody tr')
    if (await rows.count() === 0) {
      await expect(empty).toBeVisible()
    }
  })
})
