import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin@clinic.com', 'admin123')
  })

  test('shows admin dashboard with stats', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page.locator('text=Total Patients')).toBeVisible()
    await expect(page.locator('text=Total Doctors')).toBeVisible()
    await expect(page.locator('text=Total Appointments')).toBeVisible()
  })

  test('can navigate to appointments management', async ({ page }) => {
    await page.goto('/admin/appointments')
    await expect(page.locator('text=All Appointments')).toBeVisible()
    await expect(page.locator('text=Today')).toBeVisible()
    await expect(page.locator('text=This Month')).toBeVisible()
  })

  test('shows doctors management page', async ({ page }) => {
    await page.goto('/admin/doctors')
    await expect(page.locator('text=Manage Doctors')).toBeVisible()
  })

  test('shows patients management page', async ({ page }) => {
    await page.goto('/admin/patients')
    await expect(page.locator('text=Manage Patients')).toBeVisible()
  })

  test('shows reports page with charts', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Reports & Analytics')).toBeVisible()
  })
})
