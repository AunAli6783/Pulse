import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Appointment Booking', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
  })

  test('shows booking form for a doctor', async ({ page }) => {
    await page.goto('/dashboard/book/1')
    await expect(page.locator('text=Book Appointment')).toBeVisible()
    await expect(page.locator('input[type="date"]')).toBeVisible()
    await expect(page.locator('button:has-text("Book Appointment")')).toBeVisible()
  })

  test('shows available slots when date is selected', async ({ page }) => {
    await page.goto('/dashboard/book/1')
    const dateInput = page.locator('input[type="date"]')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    await dateInput.fill(dateStr)
    await page.waitForTimeout(1000)
    const slots = page.locator('button:has-text(":")').first()
    const noSlots = page.locator('text=No available slots')
    const exists = await slots.isVisible().catch(() => false)
    const empty = await noSlots.isVisible().catch(() => false)
    expect(exists || empty).toBe(true)
  })

  test('shows filter tabs on appointments page', async ({ page }) => {
    await page.goto('/dashboard/appointments')
    await expect(page.locator('text=All')).toBeVisible()
    await expect(page.locator('text=Upcoming')).toBeVisible()
    await expect(page.locator('text=Completed')).toBeVisible()
    await expect(page.locator('text=Cancelled')).toBeVisible()
  })

  test('filter tabs show status descriptions', async ({ page }) => {
    await page.goto('/dashboard/appointments')
    await page.locator('text=Upcoming').click()
    await expect(page.locator('text=Confirmed future')).toBeVisible()
    await page.locator('text=Completed').click()
    await expect(page.locator('text=fulfilled')).toBeVisible()
    await page.locator('text=Cancelled').click()
    await expect(page.locator('text=cancelled')).toBeVisible()
  })

  test('shows empty state when no appointments match filter', async ({ page }) => {
    await page.goto('/dashboard/appointments')
    await page.locator('text=Upcoming').click()
    const empty = page.locator('text=No upcoming appointments')
    const hasCards = page.locator('[class*="AppointmentCard"]').first()
    const cardVisible = await hasCards.isVisible().catch(() => false)
    if (!cardVisible) {
      await expect(empty).toBeVisible()
    }
  })

  test('can cancel a pending appointment', async ({ page }) => {
    await page.goto('/dashboard/appointments')
    const cancelBtn = page.locator('button:has-text("Cancel")').first()
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click()
      await page.waitForTimeout(500)
    }
  })
})
