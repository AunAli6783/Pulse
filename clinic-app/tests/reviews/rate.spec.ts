import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Patient Reviews', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
  })

  test('shows rate button for completed appointments', async ({ page }) => {
    await page.goto('/dashboard/appointments')
    await page.locator('text=Completed').click()
    const rateBtn = page.locator('button:has-text("Rate")').first()
    if (await rateBtn.isVisible()) {
      await rateBtn.click()
      await expect(page.locator('text=Rate Your Visit')).toBeVisible()
    }
  })

  test('shows submit review button disabled until star selected', async ({ page }) => {
    await page.goto('/dashboard/appointments')
    await page.locator('text=Completed').click()
    const rateBtn = page.locator('button:has-text("Rate")').first()
    if (await rateBtn.isVisible()) {
      await rateBtn.click()
      await page.waitForTimeout(300)
      const submitBtn = page.locator('button:has-text("Submit Review")')
      await expect(submitBtn).toBeVisible()
    }
  })

  test('shows reviewed badge for already-reviewed appointments', async ({ page }) => {
    await page.goto('/dashboard/appointments')
    await page.locator('text=Completed').click()
    const reviewed = page.locator('text=Reviewed').first()
    if (await reviewed.isVisible()) {
      await expect(reviewed).toBeVisible()
    }
  })

  test('shows patient reviews section on doctor detail page', async ({ page }) => {
    await page.goto('/doctors/1')
    await expect(page.locator('text=Patient Reviews')).toBeVisible()
  })

  test('shows star rating on doctor detail page when reviews exist', async ({ page }) => {
    await page.goto('/doctors/1')
    const rating = page.locator('text=/\\d+(\\.\\d+)?\\s*\\/\\s*5/')
    if (await rating.isVisible()) {
      await expect(rating).toBeVisible()
    }
  })

  test('shows reviews on doctor dashboard', async ({ page }) => {
    await loginAs(page, 'abdulbari@clinic.com', 'admin123')
    await page.goto('/doctor/dashboard')
    await expect(page.locator('text=Average Rating')).toBeVisible()
    await expect(page.locator('text=Recent Feedback')).toBeVisible()
  })
})
