import { test, expect } from '@playwright/test'

test.describe('Route Redirects', () => {
  test('/query-lab redirects to /analysis', async ({ page }) => {
    await page.goto('/query-lab')
    await page.waitForURL(/\/analysis/, { timeout: 10000 })
    expect(page.url()).toContain('/analysis')
  })

  test('/query-lab/history redirects to /analysis', async ({ page }) => {
    await page.goto('/query-lab/history')
    await page.waitForURL(/\/analysis/, { timeout: 10000 })
    expect(page.url()).toContain('/analysis')
  })
})
