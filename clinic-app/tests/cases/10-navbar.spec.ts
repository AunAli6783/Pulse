// Navbar — public links, role-specific links, logout

import { test, expect } from '@playwright/test'

test.describe('Navbar', () => {
  test('shows public links when not logged in', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/')
    await expect(page.locator('nav a:has-text("Find Doctors")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Login")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Get Started")')).toBeVisible()
  })

  test('shows patient links when logged in as patient', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'patient@clinic.com')
    await page.fill('input[type="password"]', 'admin231')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    await expect(page.locator('nav a:has-text("Dashboard")').first()).toBeVisible()
    await expect(page.locator('nav a:has-text("Appointments")').first()).toBeVisible()
    await expect(page.locator('nav a:has-text("Prescriptions")').first()).toBeVisible()
  })

  test('shows admin links when logged in as admin', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@clinic.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })

    // Navigate to admin pages so admin links appear
    await page.goto('/admin/dashboard')
    await expect(page.locator('nav a:has-text("Doctors")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Patients")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Reports")')).toBeVisible()
  })

  test('shows logout button when logged in', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'patient@clinic.com')
    await page.fill('input[type="password"]', 'admin231')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    await expect(page.locator('nav button:has-text("Logout")')).toBeVisible()
  })
})
