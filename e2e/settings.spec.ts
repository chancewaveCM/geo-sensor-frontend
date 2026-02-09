import { test, expect } from '@playwright/test'
import { loginWithTestUser, clearAuthState } from './utils/test-helpers'

const FRONTEND_URL = 'http://localhost:3765'
const BACKEND_URL = 'http://localhost:8765'

async function isBackendAvailable(): Promise<boolean> {
  const healthCandidates = ['/api/v1/health', '/health']

  for (const path of healthCandidates) {
    try {
      const response = await fetch(`${BACKEND_URL}${path}`)
      if (response.ok) {
        return true
      }
    } catch {
      // Try next endpoint.
    }
  }

  return false
}

test.describe.configure({ mode: 'serial' })

test.describe('Settings Page', () => {
  let backendAvailable = false

  test.beforeAll(async () => {
    backendAvailable = await isBackendAvailable()
  })

  test.beforeEach(async ({ page }) => {
    test.skip(!backendAvailable, 'Backend not available')

    await clearAuthState(page)
    await loginWithTestUser(page)

    await page.goto(`${FRONTEND_URL}/settings`)
    await page.waitForLoadState('domcontentloaded')
  })

  test('renders settings main content', async ({ page }) => {
    await expect(page).toHaveURL(/\/settings/)
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('#show-inactive')).toBeVisible()
  })

  test('opens and closes profile modal', async ({ page }) => {
    const addButton = page.locator('button:has(svg.lucide-plus)').first()
    await expect(addButton).toBeVisible()

    await addButton.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('input[name="name"]')).toBeVisible()

    const cancelButton = dialog.locator('button[type="button"]').filter({ hasText: /취소|cancel/i }).first()
    await cancelButton.click()

    await expect(dialog).not.toBeVisible()
  })

  test('toggle for inactive profiles is interactive', async ({ page }) => {
    const toggle = page.locator('#show-inactive')
    await expect(toggle).toBeVisible()

    const before = await toggle.getAttribute('aria-checked')
    await toggle.click()
    const after = await toggle.getAttribute('aria-checked')

    expect(before).not.toBe(after)
  })
})
