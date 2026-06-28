// Authentication — Login (patient, doctor, admin) + Register

import { test, expect } from '@playwright/test'

function randomEmail() {
  return `test-${Date.now()}@example.com`
}

test.describe('Login', () => {
  test('logs in with valid patient credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'patient@clinic.com')
    await page.fill('input[type="password"]', 'admin231')
    await page.click('button[type="submit"]')
    // Patient login redirects to dashboard (via home page redirect)
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('logs in with valid doctor credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'abdulbari@clinic.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    // Doctor login redirects to doctor dashboard
    await expect(page).toHaveURL(/\/doctor\/dashboard/)
  })

  test('logs in with valid admin credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@clinic.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    // Admin login redirects to admin dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('shows login page elements', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1:has-text("Welcome back")')).toBeVisible()
    await expect(page.locator('label:has-text("Email")')).toBeVisible()
    await expect(page.locator('label:has-text("Password")')).toBeVisible()
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
  })

  test('has register link on login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('a[href="/register"]').first()).toBeVisible()
  })
})

test.describe('Register', () => {
  test('shows register page elements', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('h1:has-text("Create Account")')).toBeVisible()
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('label:has-text("Email")')).toBeVisible()
    await expect(page.locator('label:has-text("Phone")')).toBeVisible()
    await expect(page.locator('label:has-text("Password")')).toBeVisible()
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible()
  })

  test('has login link on register page', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('a[href="/login"]').first()).toBeVisible()
  })

  test('registers a new patient account', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input[type="text"]', 'Test User')
    await page.fill('input[type="email"]', randomEmail())
    await page.fill('input[type="tel"]', '03001234567')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    // On success, redirects to /login
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows error with duplicate email', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input[type="text"]', 'Duplicate')
    await page.fill('input[type="email"]', 'patient@clinic.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    // API returns: 'Email already registered'
    await expect(page.locator('text=Email already registered')).toBeVisible()
  })
})
