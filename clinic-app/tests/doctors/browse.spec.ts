import { test, expect } from '@playwright/test'

test.describe('Doctor Listing', () => {
  test('displays doctor cards on the browse page', async ({ page }) => {
    await page.goto('/doctors')
    await expect(page.locator('text=Our Specialists')).toBeVisible()
    await expect(page.locator('text=Cardiologist')).toBeVisible()
    await expect(page.locator('text=Dermatologist')).toBeVisible()
  })

  test('shows doctor detail page when clicking a doctor', async ({ page }) => {
    await page.goto('/doctors')
    await page.locator('a[href*="/doctors/"]').first().click()
    await expect(page).toHaveURL(/\/doctors\/\d+/)
  })

  test('doctor detail shows specialization and qualifications', async ({ page }) => {
    await page.goto('/doctors/1')
    await expect(page.locator('text=Specialization').first()).toBeVisible()
    await expect(page.locator('text=Qualification').first()).toBeVisible()
  })

  test('doctor detail shows experience and fee', async ({ page }) => {
    await page.goto('/doctors/1')
    await expect(page.locator('text=years experience').first()).toBeVisible()
    await expect(page.locator('text=/ visit').first()).toBeVisible()
  })

  test('doctor detail shows patient reviews section', async ({ page }) => {
    await page.goto('/doctors/1')
    await expect(page.locator('text=Patient Reviews')).toBeVisible()
  })

  test('shows login button on doctor detail for unauthenticated users', async ({ page }) => {
    await page.goto('/doctors/1')
    await expect(page.locator('a:has-text("Login to Book")')).toBeVisible()
  })

  test('doctor detail shows available slots section', async ({ page }) => {
    await page.goto('/doctors/1')
    await expect(page.locator('text=Available').first()).toBeVisible()
  })
})
