// Admin dashboard + reports pages

import { test, expect } from '@playwright/test'

async function loginAsAdmin(page: any) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'admin@clinic.com')
  await page.fill('input[type="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })
}

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('shows admin dashboard heading', async ({ page }) => {
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible()
  })

  test('admin pages are accessible', async ({ page }) => {
    await page.goto('/admin/appointments')
    await expect(page.locator('h1:has-text("Appointments")')).toBeVisible()

    await page.goto('/admin/doctors')
    await expect(page.locator('h1:has-text("Manage Doctors")')).toBeVisible()

    await page.goto('/admin/patients')
    await expect(page.locator('h1:has-text("Manage Patients")')).toBeVisible()

    await page.goto('/admin/reports')
    await expect(page.locator('h1:has-text("Reports")')).toBeVisible()
  })
})

test.describe('Admin Reports', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('report section headings are visible', async ({ page }) => {
    await page.goto('/admin/reports')
    await page.waitForSelector('text=Monthly Revenue', { timeout: 10000 })
    await expect(page.locator('h2:has-text("Monthly Revenue")')).toBeVisible()
    await expect(page.locator('h2:has-text("Doctor Performance")')).toBeVisible()
    await expect(page.locator('h2:has-text("Patient History")')).toBeVisible()
    await expect(page.locator('h2:has-text("Patient Reviews")')).toBeVisible()
  })
})
