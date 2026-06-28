// Doctor dashboard — heading, today's appointments, quick links

import { test, expect } from '@playwright/test'

async function loginAsDoctor(page: any) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'abdulbari@clinic.com')
  await page.fill('input[type="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/doctor\/dashboard/, { timeout: 10000 })
}

test.describe('Doctor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDoctor(page)
  })

  test('shows heading and quick links', async ({ page }) => {
    await expect(page.locator('h1:has-text("Doctor Dashboard")')).toBeVisible()
    await expect(page.locator('text=Appointments').first()).toBeVisible()
    await expect(page.locator('text=Availability').first()).toBeVisible()
  })

  test('shows Today\'s Appointments section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Today\'s Appointments")')).toBeVisible()
  })
})
