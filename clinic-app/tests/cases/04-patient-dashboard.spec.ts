// Patient dashboard — stats, quick links, navigation

import { test, expect } from '@playwright/test'

async function loginAsPatient(page: any) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'patient@clinic.com')
  await page.fill('input[type="password"]', 'admin231')
  await page.click('button[type="submit"]')
  // Patient redirects to dashboard (via home page redirect)
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

test.describe('Patient Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page)
    await page.goto('/dashboard')
  })

  test('shows heading and stats', async ({ page }) => {
    await expect(page.locator('text=Patient Dashboard').first()).toBeVisible()
    await expect(page.locator('text=Total Appointments').first()).toBeVisible()
  })

  test('shows quick link cards', async ({ page }) => {
    await expect(page.locator('text=My Appointments').first()).toBeVisible()
    await expect(page.locator('text=Prescriptions').first()).toBeVisible()
    await expect(page.locator('text=Find Doctors').first()).toBeVisible()
    await expect(page.locator('text=My Profile').first()).toBeVisible()
  })

  test('navigates to appointments page via quick link', async ({ page }) => {
    await page.locator('a[href="/dashboard/appointments"]').first().click()
    await expect(page).toHaveURL(/\/dashboard\/appointments/)
  })
})
