import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils/test-helpers'

const FRONTEND_URL = 'http://localhost:3765'

test.describe('Query Lab Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto(`${FRONTEND_URL}/query-lab`)
    await page.waitForLoadState('domcontentloaded')
  })

  test('renders pipeline setup controls', async ({ page }) => {
    await expect(page.locator('#company')).toBeVisible()
    await expect(page.locator('#categories')).toBeVisible()
    await expect(page.locator('#queries')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('provider toggle buttons are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /gemini/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /openai/i })).toBeVisible()
  })

  test('handles profile API failure without crash', async ({ page }) => {
    await page.route('**/api/v1/company-profiles/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Server Error' }),
      })
    })

    await page.goto(`${FRONTEND_URL}/query-lab`)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('#company')).toBeVisible()
  })
})
