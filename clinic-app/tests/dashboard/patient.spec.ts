import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Patient Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
  })

  test('shows welcome heading and dashboard stats', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('text=Patient Dashboard')).toBeVisible()
    await expect(page.locator('text=Total Appointments')).toBeVisible()
    await expect(page.locator('text=Upcoming')).toBeVisible()
    await expect(page.locator('text=Completed')).toBeVisible()
    await expect(page.locator('text=Cancelled')).toBeVisible()
  })

  test('shows next appointment widget when appointment exists', async ({ page }) => {
    await page.goto('/dashboard')
    const widget = page.locator('text=Next Appointment')
    if (await widget.isVisible()) {
      await expect(page.locator('text=View All')).toBeVisible()
    }
  })

  test('shows four quick link cards', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('text=My Appointments')).toBeVisible()
    await expect(page.locator('text=Prescriptions')).toBeVisible()
    await expect(page.locator('text=Find Doctors')).toBeVisible()
    await expect(page.locator('text=My Profile')).toBeVisible()
  })

  test('navigates to appointments via quick link', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('text=My Appointments').click()
    await expect(page).toHaveURL(/\/dashboard\/appointments/)
  })

  test('navigates to prescriptions via quick link', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('text=Prescriptions').first().click()
    await expect(page).toHaveURL(/\/dashboard\/prescriptions/)
  })

  test('navigates to find doctors via quick link', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('text=Find Doctors').click()
    await expect(page).toHaveURL(/\/doctors/)
  })

  test('navigates to profile via quick link', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('text=My Profile').click()
    await expect(page).toHaveURL(/\/dashboard\/profile/)
  })
})
