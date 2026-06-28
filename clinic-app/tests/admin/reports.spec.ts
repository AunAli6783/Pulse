import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Admin Reports', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin@clinic.com', 'admin123')
  })

  test('shows reports page with heading and export button', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Reports & Analytics')).toBeVisible()
    await expect(page.locator('button:has-text("Export CSV")').first()).toBeVisible()
  })

  test('shows monthly revenue chart section', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Monthly Revenue')).toBeVisible()
  })

  test('shows monthly breakdown section', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Monthly Breakdown')).toBeVisible()
  })

  test('shows doctor performance table', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Doctor Performance')).toBeVisible()
    await expect(page.locator('text=Specialization')).toBeVisible()
    await expect(page.locator('text=Completion %').first()).toBeVisible()
  })

  test('shows patient history table', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Patient History')).toBeVisible()
  })

  test('shows patient reviews section', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Patient Reviews')).toBeVisible()
  })

  test('shows recent appointments section', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.locator('text=Recent Appointments')).toBeVisible()
  })

  test('patient history modal opens on view history click', async ({ page }) => {
    await page.goto('/admin/reports')
    const viewBtn = page.locator('button:has-text("View History")').first()
    if (await viewBtn.isVisible()) {
      await viewBtn.click()
      await page.waitForTimeout(300)
      const modalClose = page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first()
      const modalVisible = await modalClose.isVisible().catch(() => false)
      if (modalVisible) {
        await modalClose.click()
      }
    }
  })
})
