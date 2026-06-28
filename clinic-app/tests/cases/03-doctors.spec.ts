// Doctor listing and detail pages

import { test, expect } from '@playwright/test'

test.describe('Doctor Listing', () => {
  test('displays doctor cards with specialties', async ({ page }) => {
    await page.goto('/doctors')
    // Wait for doctor data to load
    await page.waitForSelector('text=Cardiologist', { timeout: 10000 })
    await expect(page.locator('text=Cardiologist').first()).toBeVisible()
  })

  test('click on doctor opens detail page', async ({ page }) => {
    await page.goto('/doctors')
    await page.waitForSelector('a[href*="/doctors/"]', { timeout: 10000 })
    await Promise.all([
      page.waitForURL(/\/doctors\/\d+/),
      page.locator('a[href*="/doctors/"]').first().click()
    ])
  })
})

test.describe('Doctor Detail', () => {
  test('shows experience and fee', async ({ page }) => {
    await page.goto('/doctors/1')
    await page.waitForSelector('text=years experience', { timeout: 10000 })
    await expect(page.locator('text=years experience').first()).toBeVisible()
    await expect(page.locator('text=/ visit').first()).toBeVisible()
  })

  test('shows About section', async ({ page }) => {
    await page.goto('/doctors/1')
    await page.waitForSelector('h2:has-text("About")', { timeout: 10000 })
    await expect(page.locator('h2:has-text("About")')).toBeVisible()
  })

  test('shows Patient Reviews section', async ({ page }) => {
    await page.goto('/doctors/1')
    await page.waitForSelector('h2:has-text("Patient Reviews")', { timeout: 10000 })
    await expect(page.locator('h2:has-text("Patient Reviews")')).toBeVisible()
  })

  test('shows Login to Book button for unauthenticated users', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/doctors/1')
    await page.waitForSelector('a[href="/login"]', { timeout: 10000 })
    await expect(page.locator('a[href="/login"]:has-text("Login to Book")')).toBeVisible()
  })
})
