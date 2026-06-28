import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows hero section with title and CTAs', async ({ page }) => {
    await expect(page.locator('text=Your Health')).toBeVisible()
    await expect(page.locator('text=Get Started Free')).toBeVisible()
    await expect(page.locator('text=Browse Doctors')).toBeVisible()
  })

  test('shows stats bar with doctor/patient counts', async ({ page }) => {
    await expect(page.locator('text=500+ Doctors')).toBeVisible()
    await expect(page.locator('text=50K+ Patients')).toBeVisible()
  })

  test('shows specialties section', async ({ page }) => {
    await expect(page.locator('text=Browse by Specialty')).toBeVisible()
    await expect(page.locator('text=Cardiology')).toBeVisible()
    await expect(page.locator('text=Neurology')).toBeVisible()
  })

  test('shows how it works section with steps', async ({ page }) => {
    await expect(page.locator('text=How It Works')).toBeVisible()
    await expect(page.locator('text=Find a Doctor')).toBeVisible()
    await expect(page.locator('text=Book Online')).toBeVisible()
    await expect(page.locator('text=Get Treated')).toBeVisible()
  })

  test('shows features section', async ({ page }) => {
    await expect(page.locator('text=Why Pulse')).toBeVisible()
    await expect(page.locator('text=Secure & Private').first()).toBeVisible()
    await expect(page.locator('text=Instant Booking').first()).toBeVisible()
  })

  test('shows CTA section at bottom', async ({ page }) => {
    await expect(page.locator('text=Ready to take control of your health?')).toBeVisible()
    await expect(page.locator('text=Create Free Account').first()).toBeVisible()
  })
})
