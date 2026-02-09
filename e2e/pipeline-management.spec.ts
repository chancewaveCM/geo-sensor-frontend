import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils/test-helpers'

const BACKEND_URL = 'http://localhost:8765'

async function isBackendAvailable(): Promise<boolean> {
  try {
    const healthCandidates = ['/api/v1/health', '/health']
    for (const path of healthCandidates) {
      const response = await fetch(`${BACKEND_URL}${path}`)
      if (response.ok) return true
    }
    return false
  } catch {
    return false
  }
}

test.describe('Pipeline Management Smoke', () => {
  test.beforeAll(async () => {
    const available = await isBackendAvailable()
    test.skip(!available, 'Backend not available at localhost:8765')
  })

  test('loads hierarchy and schedule sections', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/dashboard/pipeline')

    await expect(page.getByText('Pipeline Control Center')).toBeVisible()

    await page.getByRole('tab', { name: 'Hierarchy' }).click()
    await expect(page.getByText('Company Profiles')).toBeVisible()

    await page.getByRole('tab', { name: 'Schedules' }).click()
    await expect(page.getByRole('heading', { name: 'Create Schedule' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Schedule List' })).toBeVisible()
  })
})
