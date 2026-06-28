import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Doctor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'abdulbari@clinic.com', 'admin123')
  })

  test('shows dashboard heading and welcome message', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.locator('text=Doctor Dashboard')).toBeVisible()
    await expect(page.locator('text=Welcome')).toBeVisible()
  })

  test('shows average rating card', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.locator('text=Average Rating')).toBeVisible()
  })

  test('shows recent feedback card', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.locator('text=Recent Feedback')).toBeVisible()
  })

  test('shows four quick link cards for doctor', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.locator('text=Appointments')).toBeVisible()
    await expect(page.locator('text=Availability')).toBeVisible()
    await expect(page.locator('text=Prescriptions')).toBeVisible()
    await expect(page.locator('text=Profile')).toBeVisible()
  })

  test('shows today appointments section', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await expect(page.locator('text=Today\'s Appointments')).toBeVisible()
  })

  test('navigates to doctor appointments', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await page.locator('text=Appointments').first().click()
    await expect(page).toHaveURL(/\/doctor\/appointments/)
  })

  test('navigates to availability settings', async ({ page }) => {
    await page.goto('/doctor/dashboard')
    await page.locator('text=Availability').first().click()
    await expect(page).toHaveURL(/\/doctor\/availability/)
  })
})
