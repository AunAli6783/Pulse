// Patient appointments — booking form and appointments page

import { test, expect } from '@playwright/test'

async function loginAsPatient(page: any) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'patient@clinic.com')
  await page.fill('input[type="password"]', 'admin231')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

test.describe('Appointments', () => {
  test('shows appointments page with heading', async ({ page }) => {
    await loginAsPatient(page)
    await page.goto('/dashboard/appointments')
    await expect(page.locator('h1:has-text("My Appointments")')).toBeVisible()
  })

  test('shows booking form for a doctor', async ({ page }) => {
    await loginAsPatient(page)
    await page.goto('/dashboard/book/1')
    await page.waitForSelector('h1:has-text("Book Appointment")', { timeout: 10000 })
    await expect(page.locator('h1:has-text("Book Appointment")')).toBeVisible()
    await expect(page.locator('input[type="date"]')).toBeVisible()
    await expect(page.locator('button:has-text("Book Appointment")')).toBeVisible()
  })
})
