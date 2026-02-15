import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    // Payload redirects to login if not authenticated
    await expect(page).toHaveURL(/\/admin/)
  })
})
