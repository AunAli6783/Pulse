import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('shows contact heading and badge', async ({ page }) => {
    await expect(page.locator('text=Contact Us')).toBeVisible()
    await expect(page.locator('text=Get in Touch')).toBeVisible()
  })

  test('shows contact info cards', async ({ page }) => {
    await expect(page.locator('text=Email').first()).toBeVisible()
    await expect(page.locator('text=Phone').first()).toBeVisible()
    await expect(page.locator('text=Location').first()).toBeVisible()
  })

  test('shows contact form with all fields', async ({ page }) => {
    await expect(page.locator('input[placeholder="Your Name"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Your Email"]')).toBeVisible()
    await expect(page.locator('textarea[placeholder="Your Message"]')).toBeVisible()
    await expect(page.locator('button:has-text("Send Message")')).toBeVisible()
  })

  test('submit button sends message and shows success', async ({ page }) => {
    await page.fill('input[placeholder="Your Name"]', 'Test User')
    await page.fill('input[placeholder="Your Email"]', 'test@example.com')
    await page.fill('textarea[placeholder="Your Message"]', 'This is a test message.')
    await page.locator('button:has-text("Send Message")').click()
    await expect(page.locator('text=Message sent successfully')).toBeVisible()
  })

  test('shows developer section', async ({ page }) => {
    await expect(page.locator('text=built by').first()).toBeVisible()
  })
})
