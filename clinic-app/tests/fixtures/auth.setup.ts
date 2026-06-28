import { test as setup, expect } from '@playwright/test'

const AUTH_FILE = 'playwright/.auth/user.json'

setup('authenticate as patient', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'patient@clinic.com')
  await page.fill('input[type="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)
  await page.context().storageState({ path: AUTH_FILE })
})

export { AUTH_FILE }
