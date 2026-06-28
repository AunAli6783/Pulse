// Contact page — form, info cards, developer credit

import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('shows heading and badge', async ({ page }) => {
    await expect(page.locator('h1:has-text("Contact Us")')).toBeVisible()
    await expect(page.locator('text=Get in Touch')).toBeVisible()
  })

  test('shows contact info cards', async ({ page }) => {
    await expect(page.locator('h3:has-text("Email")')).toBeVisible()
    await expect(page.locator('h3:has-text("Phone")')).toBeVisible()
    await expect(page.locator('h3:has-text("Location")')).toBeVisible()
  })

  test('shows contact form fields', async ({ page }) => {
    await expect(page.locator('h2:has-text("Send a Message")')).toBeVisible()
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('label:has-text("Email")')).toBeVisible()
    await expect(page.locator('label:has-text("Message")')).toBeVisible()
    await expect(page.locator('button:has-text("Send Message")')).toBeVisible()
  })

  test('submit shows success message', async ({ page }) => {
    await page.fill('input[type="text"]', 'John Doe')
    await page.fill('input[type="email"]', 'john@example.com')
    await page.fill('textarea', 'This is a test message.')
    await page.click('button:has-text("Send Message")')
    await expect(page.locator('text=Message sent successfully!')).toBeVisible()
  })

  test('shows developer credit', async ({ page }) => {
    await expect(page.locator('text=This project was built by')).toBeVisible()
    await expect(page.locator('text=Raja Aun Ali Khan').first()).toBeVisible()
  })
})
