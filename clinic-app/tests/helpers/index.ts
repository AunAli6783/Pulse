import { Page, expect } from '@playwright/test'

export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
}

export async function waitForToast(page: Page) {
  await page.waitForTimeout(500)
}

export function randomEmail() {
  return `test-${Date.now()}@example.com`
}
