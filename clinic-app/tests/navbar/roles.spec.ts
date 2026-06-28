import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Navbar Role Links', () => {
  test('shows public links when not logged in', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav a:has-text("Find Doctors")')).toBeVisible()
    await expect(page.locator('nav a:has-text("How It Works")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Specialties")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Login")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Get Started")')).toBeVisible()
  })

  test('shows patient links when logged in as patient', async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
    await page.goto('/dashboard')
    await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Appointments")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Prescriptions")')).toBeVisible()
  })

  test('shows doctor-specific links when logged in as doctor', async ({ page }) => {
    await loginAs(page, 'abdulbari@clinic.com', 'admin123')
    await page.goto('/doctor/dashboard')
    await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Availability")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Prescriptions")')).toBeVisible()
  })

  test('shows admin-specific links when logged in as admin', async ({ page }) => {
    await loginAs(page, 'admin@clinic.com', 'admin123')
    await page.goto('/admin/dashboard')
    await expect(page.locator('nav a:has-text("Appointments")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Doctors")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Patients")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Reports")')).toBeVisible()
  })

  test('shows logout button when logged in', async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
    await page.goto('/dashboard')
    await expect(page.locator('nav button:has-text("Logout")')).toBeVisible()
  })

  test('hides how-it-works from navbar when logged in', async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
    await page.goto('/dashboard')
    await expect(page.locator('nav a:has-text("How It Works")')).toHaveCount(0)
    await expect(page.locator('nav a:has-text("Specialties")')).toHaveCount(0)
  })
})
