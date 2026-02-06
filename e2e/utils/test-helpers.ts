import { Page, expect } from '@playwright/test'
import { testUserCredentials } from './fixtures'

// Pre-created test user for E2E tests (avoids rate limiting on register)
const E2E_TEST_USER = {
  email: 'e2etest@example.com',
  password: 'TestPassword123@',
  name: 'E2E Test'
}

/**
 * Generate unique test user credentials with timestamp
 * @returns Object containing unique email, password, and name
 */
export function createTestUser() {
  const timestamp = Date.now()
  return {
    email: `test-${timestamp}@example.com`,
    password: 'TestPass123!',
    name: `Test User ${timestamp}`
  }
}

/**
 * Login with the pre-created E2E test user
 * This is the recommended way to authenticate in E2E tests
 * @param page - Playwright page object
 * @returns Access token from localStorage
 */
export async function loginWithTestUser(page: Page) {
  await page.goto('http://localhost:3765/login')
  await page.waitForLoadState('domcontentloaded')

  // Fill login form using label text (Korean UI)
  await page.getByLabel('이메일').fill(E2E_TEST_USER.email)
  await page.getByLabel('비밀번호').fill(E2E_TEST_USER.password)

  // Submit
  await page.getByRole('button', { name: '로그인' }).click()

  // Wait for redirect to dashboard (explicit path)
  await page.waitForURL('**/dashboard', { timeout: 15000 })

  // Verify token is stored
  const token = await page.evaluate(() => localStorage.getItem('access_token'))
  expect(token).toBeTruthy()

  return token
}

/**
 * Login helper - handles full login flow
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 * @returns Access token from localStorage
 */
export async function loginAsTestUser(page: Page, email?: string, password?: string) {
  // Use default test user if no credentials provided
  const userEmail = email || E2E_TEST_USER.email
  const userPassword = password || E2E_TEST_USER.password

  await page.goto('http://localhost:3765/login')
  await page.waitForLoadState('domcontentloaded')

  await page.locator('input[type="email"], input[name="email"]').fill(userEmail)
  await page.locator('input[type="password"], input[name="password"]').fill(userPassword)
  await page.locator('button[type="submit"]').click()

  // Wait for redirect to dashboard
  await page.waitForURL(/\/(dashboard)?$/, { timeout: 10000 })

  // Verify token is stored
  const token = await page.evaluate(() => localStorage.getItem('access_token'))
  expect(token).toBeTruthy()

  return token
}

/**
 * Registration helper - handles full registration flow
 * @param page - Playwright page object
 * @param credentials - User registration data
 */
export async function registerTestUser(page: Page, credentials: { email: string; password: string; name: string }) {
  await page.goto('/register')
  await page.getByLabel(/이름/i).fill(credentials.name)
  await page.getByLabel(/이메일/i).fill(credentials.email)
  await page.getByLabel(/^비밀번호$/i).fill(credentials.password)

  // Check if confirm password field exists
  const confirmField = page.getByLabel(/비밀번호 확인/i);
  const hasConfirmField = await confirmField.isVisible().catch(() => false);
  if (hasConfirmField) {
    await confirmField.fill(credentials.password);
  }

  await page.getByRole('button', { name: /계정 만들기|회원가입/i }).click()

  // Wait for redirect or error (backend might not be available)
  try {
    await page.waitForURL(/\/(dashboard)?$/, { timeout: 10000 })
  } catch (error) {
    // If redirect fails, check if we got an error message (backend unavailable)
    const errorMessage = await page.locator('text=/실패|오류|error/i').isVisible().catch(() => false);
    if (errorMessage) {
      throw new Error('Backend not available - registration failed');
    }
    // Otherwise re-throw the original error
    throw error;
  }
}

/**
 * Clear all authentication state (localStorage and cookies)
 * @param page - Playwright page object
 */
export async function clearAuthState(page: Page) {
  // Clear cookies first (works without navigation)
  await page.context().clearCookies()

  // Navigate to app first to access localStorage (required for security)
  const currentUrl = page.url()
  if (!currentUrl.includes('localhost:3765')) {
    await page.goto('http://localhost:3765')
  }

  // Now we can safely access localStorage
  await page.evaluate(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.clear()
  })
}

/**
 * Wait for specific API response
 * @param page - Playwright page object
 * @param urlPattern - String or RegExp pattern to match API URL
 * @returns Promise that resolves when matching response is received
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(
    response => {
      const url = response.url()
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern)
      }
      return urlPattern.test(url)
    }
  )
}

/**
 * Get current auth token from localStorage
 * @param page - Playwright page object
 * @returns Access token or null if not found
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return page.evaluate(() => localStorage.getItem('access_token'))
}

/**
 * Setup authenticated state for tests by registering a new user
 * @param page - Playwright page object
 * @returns User credentials used for registration
 */
export async function setupAuthenticatedState(page: Page) {
  const credentials = createTestUser()
  await registerTestUser(page, credentials)
  return credentials
}
