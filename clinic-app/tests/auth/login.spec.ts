import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('logs in with valid patient credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'patient@clinic.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('logs in with valid doctor credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'abdulbari@clinic.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/doctor\/dashboard/)
  })

  test('logs in with valid admin credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@clinic.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid')).toBeVisible()
  })

  test('redirects to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('has register link on login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('a:has-text("Register")')).toBeVisible()
  })

  test('shows login page elements', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=Welcome back')).toBeVisible()
    await expect(page.locator('text=Sign in to your account')).toBeVisible()
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
  })
})
