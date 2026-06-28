// Landing page — hero, stats, specialties, how it works, features, CTA
// IMPORTANT: The page redirects logged-in users via useEffect, so clear cookies in beforeEach.

import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/')
  })

  test('shows hero badge', async ({ page }) => {
    await expect(page.locator('text=Trusted by 50,000+ patients across Pakistan').first()).toBeVisible()
  })

  test('shows hero heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible()
    // The heading is split across two spans: "Your Health," and "Our Priority."
    await expect(page.locator('text=Your Health,').first()).toBeVisible()
    await expect(page.locator('text=Our Priority.').first()).toBeVisible()
  })

  test('shows hero CTAs', async ({ page }) => {
    await expect(page.locator('a[href="/register"]:has-text("Get Started Free")')).toBeVisible()
    await expect(page.locator('a[href="/doctors"]:has-text("Browse Doctors")').first()).toBeVisible()
  })

  test('shows stats bar', async ({ page }) => {
    await expect(page.locator('text=500+').first()).toBeVisible()
    await expect(page.locator('text=Doctors').first()).toBeVisible()
    await expect(page.locator('text=50K+').first()).toBeVisible()
    await expect(page.locator('text=Patients').first()).toBeVisible()
    await expect(page.locator('text=98%').first()).toBeVisible()
    await expect(page.locator('text=Satisfaction').first()).toBeVisible()
    await expect(page.locator('text=24/7').first()).toBeVisible()
    await expect(page.locator('text=Support').first()).toBeVisible()
  })

  test('shows specialties section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Browse by Specialty")')).toBeVisible()
    await expect(page.locator('text=Cardiology').first()).toBeVisible()
    await expect(page.locator('text=Neurology').first()).toBeVisible()
  })

  test('shows how it works section', async ({ page }) => {
    await expect(page.locator('h2:has-text("How It Works")')).toBeVisible()
    await expect(page.locator('text=Find a Doctor').first()).toBeVisible()
    await expect(page.locator('text=Book Online').first()).toBeVisible()
  })

  test('shows features section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Built for your peace of mind")')).toBeVisible()
    await expect(page.locator('text=Secure & Private').first()).toBeVisible()
    await expect(page.locator('text=Instant Booking').first()).toBeVisible()
    await expect(page.locator('text=Digital Records').first()).toBeVisible()
    await expect(page.locator('text=Verified Doctors').first()).toBeVisible()
  })

  test('shows CTA section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Ready to take control of your health?")')).toBeVisible()
  })
})
