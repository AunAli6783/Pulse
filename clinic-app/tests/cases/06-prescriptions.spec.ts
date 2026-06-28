// Prescriptions — patient and doctor views

import { test, expect } from '@playwright/test'

async function loginAsPatient(page: any) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'patient@clinic.com')
  await page.fill('input[type="password"]', 'admin231')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

async function loginAsDoctor(page: any) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'abdulbari@clinic.com')
  await page.fill('input[type="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/doctor\/dashboard/, { timeout: 10000 })
}

test.describe('Prescriptions', () => {
  test('patient can view prescriptions page', async ({ page }) => {
    await loginAsPatient(page)
    await page.goto('/dashboard/prescriptions')
    await expect(page.locator('h1:has-text("My Prescriptions")')).toBeVisible()
  })

  test('doctor can view prescriptions page', async ({ page }) => {
    await loginAsDoctor(page)
    await page.goto('/doctor/prescriptions')
    await expect(page.locator('h1:has-text("Prescriptions")')).toBeVisible()
  })
})
