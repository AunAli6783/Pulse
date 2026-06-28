import { test, expect } from '@playwright/test'
import { randomEmail } from '../helpers'

test.describe('Registration', () => {
  test('registers a new patient account', async ({ page }) => {
    await page.goto('/register')
    await page.locator('input[type="text"]').first().fill('Test User')
    await page.locator('input[type="email"]').fill(randomEmail())
    await page.locator('input[type="tel"]').fill('03001234567')
    await page.locator('input[type="password"]').fill('testpass123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows error when registering with existing email', async ({ page }) => {
    await page.goto('/register')
    await page.locator('input[type="text"]').first().fill('Duplicate User')
    await page.locator('input[type="email"]').fill('patient@clinic.com')
    await page.locator('input[type="password"]').fill('testpass123')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=already exists')).toBeVisible()
  })

  test('shows register page elements', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('text=Create Account')).toBeVisible()
    await expect(page.locator('text=Join Pulse today')).toBeVisible()
    await expect(page.locator('input[type="text"]').first()).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible()
  })

  test('has login link on register page', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('a:has-text("Login")')).toBeVisible()
  })
})
