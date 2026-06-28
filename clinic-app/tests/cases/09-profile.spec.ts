// Profile pages — patient and doctor

import { test, expect } from '@playwright/test'

test.describe('Profile Update', () => {
  test('patient profile page shows fields', async ({ page }) => {
    // Login as patient
    await page.goto('/login')
    await page.fill('input[type="email"]', 'patient@clinic.com')
    await page.fill('input[type="password"]', 'admin231')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    await page.goto('/dashboard/profile')
    await expect(page.locator('h1:has-text("My Profile")')).toBeVisible()
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('label:has-text("Email")')).toBeVisible()
    await expect(page.locator('text=Change Password').first()).toBeVisible()
    await expect(page.locator('button:has-text("Save Changes")')).toBeVisible()
  })

  test('doctor profile page shows fields', async ({ page }) => {
    // Login as doctor
    await page.goto('/login')
    await page.fill('input[type="email"]', 'abdulbari@clinic.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/doctor\/dashboard/, { timeout: 10000 })

    await page.goto('/doctor/profile')
    await expect(page.locator('h1:has-text("My Profile")')).toBeVisible()
    await expect(page.locator('text=Change Password').first()).toBeVisible()
    await expect(page.locator('button:has-text("Save Changes")')).toBeVisible()
  })
})
