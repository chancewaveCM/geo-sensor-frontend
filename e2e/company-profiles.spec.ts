import { test, expect, type Page } from '@playwright/test'
import { loginWithTestUser, getAuthToken } from './utils/test-helpers'
import { createProfileViaApi, deleteProfileViaApi } from './utils/api-helpers'

const FRONTEND_URL = 'http://localhost:3765'
const BACKEND_URL = 'http://localhost:8765'

interface ProfilePayload {
  name: string
  industry: string
  description: string
  target_audience?: string
  main_products?: string
  competitors?: string
  unique_value?: string
  website_url?: string
}

async function isBackendAvailable(): Promise<boolean> {
  const healthCandidates = ['/api/v1/health', '/health']

  for (const path of healthCandidates) {
    try {
      const response = await fetch(`${BACKEND_URL}${path}`)
      if (response.ok) {
        return true
      }
    } catch {
      // Try next health endpoint.
    }
  }

  return false
}

async function gotoSettings(page: Page) {
  await page.goto(`${FRONTEND_URL}/settings`)
  await page.waitForLoadState('domcontentloaded')
  await expect(page).toHaveURL(/\/settings/)
}

async function openCreateModal(page: Page) {
  const addButton = page.locator('button:has(svg.lucide-plus)').first()
  await expect(addButton).toBeVisible()
  await addButton.click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

async function fillProfileForm(page: Page, profile: ProfilePayload) {
  const dialog = page.getByRole('dialog')

  await dialog.locator('input[name="name"]').fill(profile.name)
  await dialog.locator('input[name="industry"]').fill(profile.industry)
  await dialog.locator('textarea[name="description"]').fill(profile.description)

  if (profile.target_audience) {
    await dialog.locator('input[name="target_audience"]').fill(profile.target_audience)
  }
  if (profile.main_products) {
    await dialog.locator('input[name="main_products"]').fill(profile.main_products)
  }
  if (profile.competitors) {
    await dialog.locator('input[name="competitors"]').fill(profile.competitors)
  }
  if (profile.unique_value) {
    await dialog.locator('input[name="unique_value"]').fill(profile.unique_value)
  }
  if (profile.website_url) {
    await dialog.locator('input[name="website_url"]').fill(profile.website_url)
  }
}

function profileCard(page: Page, profileName: string) {
  return page.locator('div[class*="grid"] > div').filter({ hasText: profileName }).first()
}

async function openCardMenu(page: Page, profileName: string) {
  const card = profileCard(page, profileName)
  await expect(card).toBeVisible()

  const menuButton = card.locator('button[aria-haspopup="menu"], button:has(svg.lucide-more-vertical)').first()
  await expect(menuButton).toBeVisible()
  await menuButton.click()

  const menuItems = page.getByRole('menuitem')
  await expect(menuItems.first()).toBeVisible()
  return menuItems
}

test.describe.configure({ mode: 'serial' })

test.describe('Company Profiles', () => {
  let backendAvailable = false
  const createdProfileIds: number[] = []

  test.beforeAll(async () => {
    backendAvailable = await isBackendAvailable()
  })

  test.beforeEach(async ({ page }) => {
    test.skip(!backendAvailable, 'Backend not available')

    await loginWithTestUser(page)
    await gotoSettings(page)
  })

  test.afterEach(async ({ page }) => {
    const token = await getAuthToken(page)
    if (!token) {
      createdProfileIds.length = 0
      return
    }

    while (createdProfileIds.length > 0) {
      const id = createdProfileIds.pop()
      if (!id) {
        continue
      }
      await deleteProfileViaApi(token, id)
    }
  })

  test('settings page and profile form render correctly', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('#show-inactive')).toBeVisible()

    await openCreateModal(page)

    const dialog = page.getByRole('dialog')
    await expect(dialog.locator('input[name="name"]')).toBeVisible()
    await expect(dialog.locator('input[name="industry"]')).toBeVisible()
    await expect(dialog.locator('textarea[name="description"]')).toBeVisible()
    await expect(dialog.locator('button[type="submit"]')).toBeVisible()
  })

  test('creates a profile via settings modal', async ({ page }) => {
    const profile = {
      name: `E2E Create ${Date.now()}`,
      industry: 'Technology',
      description: 'This profile is created by an automated end-to-end test.',
      target_audience: 'Developers',
      main_products: 'SaaS Platform',
      competitors: 'ACME Inc',
      unique_value: 'Fast iteration',
      website_url: 'https://example.com',
    }

    await openCreateModal(page)
    await fillProfileForm(page, profile)

    const createResponsePromise = page.waitForResponse((response) => (
      response.url().includes('/api/v1/company-profiles/')
      && response.request().method() === 'POST'
    ))

    await page.getByRole('dialog').locator('button[type="submit"]').click()

    const createResponse = await createResponsePromise
    expect(createResponse.status()).toBe(201)

    const createdProfile = await createResponse.json()
    createdProfileIds.push(createdProfile.id)

    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page.getByText(profile.name)).toBeVisible()
  })

  test('updates an existing profile through the dropdown menu', async ({ page }) => {
    const token = await getAuthToken(page)
    expect(token).toBeTruthy()

    const originalName = `E2E Edit ${Date.now()}`
    const createdProfile = await createProfileViaApi(token as string, {
      name: originalName,
      industry: 'Services',
      description: 'A profile prepared for edit flow verification in UI.',
    })
    createdProfileIds.push(createdProfile.id)

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const menuItems = await openCardMenu(page, originalName)
    await menuItems.first().click()

    const updatedName = `${originalName} Updated`
    const updatedDescription = 'Updated description from the Playwright profile edit flow.'

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.locator('input[name="name"]').fill(updatedName)
    await dialog.locator('textarea[name="description"]').fill(updatedDescription)

    const updateResponsePromise = page.waitForResponse((response) => (
      response.url().includes(`/api/v1/company-profiles/${createdProfile.id}`)
      && response.request().method() === 'PUT'
    ))

    await dialog.locator('button[type="submit"]').click()

    const updateResponse = await updateResponsePromise
    expect(updateResponse.status()).toBe(200)

    await expect(dialog).not.toBeVisible()
    await expect(page.getByText(updatedName)).toBeVisible()
  })

  test('deactivates and reactivates a profile from the settings list', async ({ page }) => {
    const token = await getAuthToken(page)
    expect(token).toBeTruthy()

    const profileName = `E2E Active Toggle ${Date.now()}`
    const createdProfile = await createProfileViaApi(token as string, {
      name: profileName,
      industry: 'Software',
      description: 'Profile used for deactivate/reactivate end-to-end scenario.',
    })
    createdProfileIds.push(createdProfile.id)

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const deactivateMenuItems = await openCardMenu(page, profileName)
    await deactivateMenuItems.nth(1).click()

    const deactivateResponse = await page.waitForResponse((response) => (
      response.url().includes(`/api/v1/company-profiles/${createdProfile.id}`)
      && response.request().method() === 'DELETE'
    ))
    expect([200, 204]).toContain(deactivateResponse.status())

    const showInactiveSwitch = page.locator('#show-inactive')
    await expect(showInactiveSwitch).toBeVisible()

    if ((await showInactiveSwitch.getAttribute('aria-checked')) !== 'true') {
      await showInactiveSwitch.click()
    }

    await expect(page.getByText(profileName)).toBeVisible()

    const reactivateMenuItems = await openCardMenu(page, profileName)
    await reactivateMenuItems.nth(1).click()

    const reactivateResponse = await page.waitForResponse((response) => (
      response.url().includes(`/api/v1/company-profiles/${createdProfile.id}/reactivate`)
      && response.request().method() === 'PUT'
    ))
    expect(reactivateResponse.status()).toBe(200)
  })
})
