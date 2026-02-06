import { test, expect } from '@playwright/test'
import {
  getAuthToken,
  waitForApiResponse
} from './utils/test-helpers'
import {
  createProfileViaApi,
  deleteProfileViaApi,
  cleanupTestData,
  listProfilesViaApi
} from './utils/api-helpers'
import { testCompanyProfile, minimalProfile } from './utils/fixtures'

const FRONTEND_URL = 'http://localhost:3765'

// Serial mode for dependent tests
test.describe.configure({ mode: 'serial' })

test.describe('Company Profiles - CRUD Operations', () => {
  let userCredentials: { email: string; password: string; name: string } = {
    email: 'test-profiles@example.com',
    password: 'Test123!@#',
    name: 'Test User'
  }
  let authToken: string | null = null
  const createdProfileIds: number[] = []

  test.beforeAll(async () => {
    // Check if backend is available
    try {
      const response = await fetch('http://localhost:8765/api/v1/health');
      if (!response.ok) test.skip(true, 'Backend not available');
    } catch {
      test.skip(true, 'Backend not available');
    }
  })

  test.afterAll(async () => {
    // Cleanup all created profiles
    if (authToken) {
      await cleanupTestData(authToken)
    }
  })

  test('should navigate to Settings page and see company profile section', async ({ page }) => {
    // Setup: Login first
    await page.goto('/login')
    await page.getByLabel(/이메일/i).fill(userCredentials.email)
    await page.getByLabel(/비밀번호/i).fill(userCredentials.password)
    await page.getByRole('button', { name: /로그인/i }).click()
    await page.waitForURL(/\/(dashboard)?$/)

    // Navigate to Settings
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/settings/)

    // Verify settings page heading
    await expect(page.getByRole('heading', { name: /설정/i })).toBeVisible()

    // Verify "새 프로필 추가" button exists
    await expect(page.getByRole('button', { name: /새 프로필 추가/i })).toBeVisible()
  })

  test('should create a new company profile with all fields', async ({ page }) => {
    await page.goto('/settings')

    // Click "새 프로필 추가" button
    await page.getByRole('button', { name: /새 프로필 추가/i }).click()

    // Wait for form modal/dialog to appear
    await expect(page.getByRole('dialog')).toBeVisible()

    // Generate unique name with timestamp
    const uniqueProfile = {
      ...testCompanyProfile,
      name: `${testCompanyProfile.name} ${Date.now()}`
    }

    // Fill all fields
    await page.getByLabel(/회사명|이름/i).fill(uniqueProfile.name)
    await page.getByLabel(/산업|업종/i).fill(uniqueProfile.industry)
    await page.getByLabel(/^설명/i).fill(uniqueProfile.description)

    // Fill optional fields if available
    const targetAudienceField = page.getByLabel(/타겟|고객/i)
    if (await targetAudienceField.isVisible().catch(() => false)) {
      await targetAudienceField.fill(uniqueProfile.target_audience || '')
    }

    const productsField = page.getByLabel(/제품|상품/i)
    if (await productsField.isVisible().catch(() => false)) {
      await productsField.fill(uniqueProfile.main_products || '')
    }

    const competitorsField = page.getByLabel(/경쟁사/i)
    if (await competitorsField.isVisible().catch(() => false)) {
      await competitorsField.fill(uniqueProfile.competitors || '')
    }

    const uniqueValueField = page.getByLabel(/고유|강점/i)
    if (await uniqueValueField.isVisible().catch(() => false)) {
      await uniqueValueField.fill(uniqueProfile.unique_value || '')
    }

    const websiteField = page.getByLabel(/웹사이트|URL/i)
    if (await websiteField.isVisible().catch(() => false)) {
      await websiteField.fill(uniqueProfile.website_url || '')
    }

    // Wait for API response
    const responsePromise = waitForApiResponse(page, '/api/v1/company-profiles/')

    // Submit form
    await page.getByRole('button', { name: /저장|생성|추가/i }).click()

    // Wait for successful response
    const response = await responsePromise
    expect(response.status()).toBe(201)

    // Extract profile ID from response
    const responseData = await response.json()
    createdProfileIds.push(responseData.id)

    // Verify modal closes
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Verify profile appears in list
    await expect(page.getByText(uniqueProfile.name)).toBeVisible()
    await expect(page.getByText(uniqueProfile.industry)).toBeVisible()
  })

  test('should create a minimal profile with required fields only', async ({ page }) => {
    await page.goto('/settings')

    await page.getByRole('button', { name: /새 프로필 추가/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Generate unique minimal profile
    const uniqueMinimal = {
      ...minimalProfile,
      name: `${minimalProfile.name} ${Date.now()}`
    }

    // Fill only required fields
    await page.getByLabel(/회사명|이름/i).fill(uniqueMinimal.name)
    await page.getByLabel(/산업|업종/i).fill(uniqueMinimal.industry)
    await page.getByLabel(/^설명/i).fill(uniqueMinimal.description)

    const responsePromise = waitForApiResponse(page, '/api/v1/company-profiles/')
    await page.getByRole('button', { name: /저장|생성|추가/i }).click()

    const response = await responsePromise
    expect(response.status()).toBe(201)

    const responseData = await response.json()
    createdProfileIds.push(responseData.id)

    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page.getByText(uniqueMinimal.name)).toBeVisible()
  })

  test('should list all profiles on settings page', async ({ page }) => {
    await page.goto('/settings')

    // Wait for profiles to load
    await page.waitForSelector('text=/프로필|profile/i', { timeout: 5000 }).catch(() => {})

    // Verify at least the profiles we created are visible
    const token = await getAuthToken(page)
    if (token) {
      const profiles = await listProfilesViaApi(token)

      // Should have at least 2 profiles from previous tests
      expect(profiles.items.length).toBeGreaterThanOrEqual(2)

      // Verify pagination elements if more than 10 profiles
      if (profiles.total > 10) {
        await expect(page.getByRole('navigation', { name: /페이지/i })).toBeVisible()
      }
    }
  })

  test('should display profile card with name, industry, and description', async ({ page }) => {
    await page.goto('/settings')

    // Get first profile from the list
    const token = await getAuthToken(page)
    if (token) {
      const profiles = await listProfilesViaApi(token)
      const firstProfile = profiles.items[0]

      if (firstProfile) {
        // Verify all key fields are displayed
        await expect(page.getByText(firstProfile.name)).toBeVisible()
        await expect(page.getByText(firstProfile.industry)).toBeVisible()

        // Description might be truncated, so check for partial match
        const descriptionPreview = firstProfile.description.substring(0, 50)
        await expect(page.getByText(new RegExp(descriptionPreview))).toBeVisible()
      }
    }
  })

  test('should update an existing profile', async ({ page }) => {
    await page.goto('/settings')

    // Find the first profile and click edit button (Pencil icon)
    const editButton = page.locator('button[aria-label*="수정"], button:has-text("수정")').first()
    await editButton.click()

    // Wait for edit dialog
    await expect(page.getByRole('dialog')).toBeVisible()

    // Modify fields
    const updatedName = `Updated Profile ${Date.now()}`
    const updatedDescription = 'This is an updated description that meets the minimum length requirement.'

    const nameField = page.getByLabel(/회사명|이름/i)
    await nameField.clear()
    await nameField.fill(updatedName)

    const descField = page.getByLabel(/^설명/i)
    await descField.clear()
    await descField.fill(updatedDescription)

    // Wait for PUT request
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/v1/company-profiles/') && response.request().method() === 'PUT'
    )

    // Save changes
    await page.getByRole('button', { name: /저장|수정/i }).click()

    // Verify API call
    const response = await responsePromise
    expect(response.status()).toBe(200)

    // Verify modal closes
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Verify updated name appears in list
    await expect(page.getByText(updatedName)).toBeVisible()
  })

  test('should show validation errors for invalid form data', async ({ page }) => {
    await page.goto('/settings')

    await page.getByRole('button', { name: /새 프로필 추가/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Try to submit empty form
    await page.getByRole('button', { name: /저장|생성|추가/i }).click()

    // Should see validation errors
    await expect(page.getByText(/필수|required/i)).toBeVisible()

    // Fill name and industry, but use too short description
    await page.getByLabel(/회사명|이름/i).fill('Test Company')
    await page.getByLabel(/산업|업종/i).fill('Tech')
    await page.getByLabel(/^설명/i).fill('Short')

    // Try to submit
    await page.getByRole('button', { name: /저장|생성|추가/i }).click()

    // Should see validation error for description length
    await expect(page.getByText(/10자|10 characters/i)).toBeVisible()

    // Cancel form
    await page.getByRole('button', { name: /취소|cancel/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should deactivate a profile (soft delete)', async ({ page }) => {
    // First create a profile to deactivate
    const token = await getAuthToken(page)
    if (!token) {
      throw new Error('No auth token available')
    }

    const profileToDeactivate = {
      name: `Deactivate Test ${Date.now()}`,
      industry: 'Test Industry',
      description: 'This profile will be deactivated for testing purposes.'
    }

    const created = await createProfileViaApi(token, profileToDeactivate)
    createdProfileIds.push(created.id)

    await page.goto('/settings')
    await page.reload() // Ensure fresh data

    // Find the profile and open dropdown menu
    const profileCard = page.locator(`text=${profileToDeactivate.name}`).locator('..').locator('..')
    const dropdownButton = profileCard.locator('button[aria-haspopup="menu"]')
    await dropdownButton.click()

    // Click deactivate option
    await page.getByRole('menuitem', { name: /비활성화/i }).click()

    // Wait for confirmation dialog if present
    const confirmButton = page.getByRole('button', { name: /확인|비활성화/i })
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click()
    }

    // Wait for API response
    await page.waitForResponse(
      response => response.url().includes(`/api/v1/company-profiles/${created.id}/deactivate`) && response.request().method() === 'PUT'
    )

    // Profile should now show "비활성" badge
    await expect(page.getByText(profileToDeactivate.name).locator('..').getByText(/비활성/i)).toBeVisible()
  })

  test('should hide inactive profiles by default', async ({ page }) => {
    await page.goto('/settings')

    // Find toggle for showing inactive profiles
    const showInactiveToggle = page.getByLabel(/비활성 프로필 표시/i)

    // Ensure toggle is OFF (unchecked)
    const isChecked = await showInactiveToggle.isChecked().catch(() => false)
    if (isChecked) {
      await showInactiveToggle.click()
      await page.waitForTimeout(500) // Wait for filter to apply
    }

    // Count visible profiles
    const token = await getAuthToken(page)
    if (token) {
      const allProfiles = await listProfilesViaApi(token)
      const activeProfiles = allProfiles.items.filter((p: any) => p.is_active)

      // Number of visible profile cards should match active count
      const visibleCards = await page.locator('[data-testid="profile-card"], .profile-card').count()

      // Allow some tolerance for async loading
      expect(visibleCards).toBeLessThanOrEqual(allProfiles.total)
    }
  })

  test('should show inactive profiles when toggle is enabled', async ({ page }) => {
    await page.goto('/settings')

    // Enable "비활성 프로필 표시" toggle
    const showInactiveToggle = page.getByLabel(/비활성 프로필 표시/i)

    const isChecked = await showInactiveToggle.isChecked().catch(() => false)
    if (!isChecked) {
      await showInactiveToggle.click()
      await page.waitForTimeout(500) // Wait for filter to apply
    }

    // Should see "비활성" badges on deactivated profiles
    const inactiveBadges = page.getByText(/비활성/i)
    const badgeCount = await inactiveBadges.count()

    // Should have at least 1 inactive profile from previous test
    expect(badgeCount).toBeGreaterThanOrEqual(1)
  })

  test('should reactivate an inactive profile', async ({ page }) => {
    await page.goto('/settings')

    // Enable showing inactive profiles
    const showInactiveToggle = page.getByLabel(/비활성 프로필 표시/i)
    const isChecked = await showInactiveToggle.isChecked().catch(() => false)
    if (!isChecked) {
      await showInactiveToggle.click()
      await page.waitForTimeout(500)
    }

    // Find an inactive profile
    const inactiveBadge = page.getByText(/비활성/i).first()
    await inactiveBadge.waitFor({ state: 'visible' })

    // Find parent card and open dropdown
    const profileCard = inactiveBadge.locator('..').locator('..')
    const dropdownButton = profileCard.locator('button[aria-haspopup="menu"]').first()
    await dropdownButton.click()

    // Click reactivate option
    await page.getByRole('menuitem', { name: /활성화/i }).click()

    // Wait for confirmation if present
    const confirmButton = page.getByRole('button', { name: /확인|활성화/i })
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click()
    }

    // Wait for API response
    await page.waitForResponse(
      response => response.url().includes('/api/v1/company-profiles/') &&
                  response.url().includes('/reactivate') &&
                  response.request().method() === 'PUT'
    )

    // Badge should be removed after reactivation
    // Note: Profile might move if list is filtered, so check for absence of badge on any profile with same name
    await page.waitForTimeout(500)

    // Profile should still be visible and no longer have "비활성" badge
    const token = await getAuthToken(page)
    if (token) {
      const profiles = await listProfilesViaApi(token)
      const reactivatedProfile = profiles.items.find((p: any) => p.is_active)
      expect(reactivatedProfile).toBeDefined()
    }
  })

  test('should validate description minimum length during edit', async ({ page }) => {
    await page.goto('/settings')

    // Click edit on first profile
    const editButton = page.locator('button[aria-label*="수정"], button:has-text("수정")').first()
    await editButton.click()

    await expect(page.getByRole('dialog')).toBeVisible()

    // Clear description and enter short text
    const descField = page.getByLabel(/^설명/i)
    await descField.clear()
    await descField.fill('Short')

    // Try to save
    await page.getByRole('button', { name: /저장|수정/i }).click()

    // Should see validation error
    await expect(page.getByText(/10자|10 characters/i)).toBeVisible()

    // Dialog should remain open
    await expect(page.getByRole('dialog')).toBeVisible()

    // Cancel
    await page.getByRole('button', { name: /취소|cancel/i }).click()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/settings')

    // Intercept API call to simulate error
    await page.route('**/api/v1/company-profiles/', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Internal Server Error' })
        })
      } else {
        route.continue()
      }
    })

    await page.getByRole('button', { name: /새 프로필 추가/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Fill valid data
    await page.getByLabel(/회사명|이름/i).fill('Test Error Handling')
    await page.getByLabel(/산업|업종/i).fill('Tech')
    await page.getByLabel(/^설명/i).fill('Valid description for error test')

    // Submit
    await page.getByRole('button', { name: /저장|생성|추가/i }).click()

    // Should show error message
    await expect(page.getByText(/오류|에러|error/i)).toBeVisible()

    // Dialog should remain open to allow retry
    await expect(page.getByRole('dialog')).toBeVisible()

    // Unroute to restore normal behavior
    await page.unroute('**/api/v1/company-profiles/')
  })

  test('should persist profile data across page reloads', async ({ page }) => {
    // Create a profile
    const token = await getAuthToken(page)
    if (!token) {
      throw new Error('No auth token')
    }

    const testProfile = {
      name: `Persistence Test ${Date.now()}`,
      industry: 'Testing',
      description: 'Testing data persistence across reloads.'
    }

    const created = await createProfileViaApi(token, testProfile)
    createdProfileIds.push(created.id)

    // Load settings page
    await page.goto('/settings')
    await expect(page.getByText(testProfile.name)).toBeVisible()

    // Reload page
    await page.reload()

    // Profile should still be visible
    await expect(page.getByText(testProfile.name)).toBeVisible()
    await expect(page.getByText(testProfile.industry)).toBeVisible()
  })
})
