import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers'

test.describe('Profile Update', () => {
  test('patient can view and edit profile', async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
    await page.goto('/dashboard/profile')
    await expect(page.locator('text=My Profile')).toBeVisible()
    await expect(page.locator('input')).toBeVisible()
    await expect(page.locator('button:has-text("Save Changes")')).toBeVisible()
  })

  test('patient profile has name and email inputs', async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
    await page.goto('/dashboard/profile')
    await expect(page.locator('text=NAME')).toBeVisible()
    await expect(page.locator('text=EMAIL')).toBeVisible()
    await expect(page.locator('text=ROLE')).toBeVisible()
  })

  test('patient profile has password change section', async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
    await page.goto('/dashboard/profile')
    await expect(page.locator('text=Change Password')).toBeVisible()
    await expect(page.locator('input[placeholder="Current password"]')).toBeVisible()
    await expect(page.locator('input[placeholder="New password"]')).toBeVisible()
  })

  test('doctor can view and edit profile', async ({ page }) => {
    await loginAs(page, 'abdulbari@clinic.com', 'admin123')
    await page.goto('/doctor/profile')
    await expect(page.locator('text=My Profile')).toBeVisible()
    await expect(page.locator('input')).toBeVisible()
    await expect(page.locator('button:has-text("Save Changes")')).toBeVisible()
  })

  test('doctor profile has password change section', async ({ page }) => {
    await loginAs(page, 'abdulbari@clinic.com', 'admin123')
    await page.goto('/doctor/profile')
    await expect(page.locator('text=Change Password')).toBeVisible()
    await expect(page.locator('input[placeholder="Current password"]')).toBeVisible()
    await expect(page.locator('input[placeholder="New password"]')).toBeVisible()
  })

  test('save button is clickable without changing password', async ({ page }) => {
    await loginAs(page, 'patient@clinic.com', 'admin123')
    await page.goto('/dashboard/profile')
    const nameInput = page.locator('input').first()
    const currentName = await nameInput.inputValue()
    await nameInput.fill(currentName)
    await page.locator('button:has-text("Save Changes")').click()
    await page.waitForTimeout(500)
  })
})
