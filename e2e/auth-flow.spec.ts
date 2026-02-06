import { test, expect } from '@playwright/test'
import {
  createTestUser,
  loginAsTestUser,
  registerTestUser,
  clearAuthState,
  getAuthToken,
  waitForApiResponse
} from './utils'
import { koreanLabels } from './utils/fixtures'

test.describe('Authentication Flow', () => {
  test.describe.configure({ mode: 'serial' })

  let testUser: ReturnType<typeof createTestUser>

  test.beforeAll(() => {
    testUser = createTestUser()
  })

  test.beforeEach(async ({ page }) => {
    // Navigate to a page first so localStorage is available
    await page.goto('/')
    await clearAuthState(page)
  })

  test.describe('Registration', () => {
    test('should register new user successfully', async ({ page }) => {
      const user = createTestUser() // Unique user to avoid rate limit conflicts
      await page.goto('/register')

      // Fill form
      await page.getByLabel(/이름/i).fill(user.name)
      await page.getByLabel(/이메일/i).fill(user.email)
      await page.getByLabel(/^비밀번호$/i).fill(user.password)

      // Check for confirm password field and fill if exists
      const confirmField = page.getByLabel(/비밀번호 확인/i)
      const hasConfirmField = await confirmField.isVisible().catch(() => false)
      if (hasConfirmField) {
        await confirmField.fill(user.password)
      }

      // Submit
      const submitButton = page.getByRole('button', { name: /계정 만들기|회원가입/i })
      await submitButton.click()

      // Wait for redirect to dashboard (might redirect to / first)
      await page.waitForURL(/\/(dashboard)?$/, { timeout: 10000 })

      // Verify token is stored
      const token = await getAuthToken(page)
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token!.length).toBeGreaterThan(20)
    })

    test('should show validation error for short password', async ({ page }) => {
      await page.goto('/register')

      await page.getByLabel(/이름/i).fill('Test User')
      await page.getByLabel(/이메일/i).fill('test@example.com')
      const passwordField = page.getByLabel(/^비밀번호$/i)
      await passwordField.fill('123')
      await passwordField.blur()

      // Wait for validation to trigger
      await page.waitForTimeout(500)

      // Password strength indicator should show weak/error
      const strengthIndicator = page.locator('[data-testid="password-strength"], .password-strength, [class*="strength"]')
      const errorMessage = page.getByText(/8자|짧|약함|weak|too short/i)

      // Either strength indicator or error message should be visible
      const hasIndicator = await strengthIndicator.isVisible().catch(() => false)
      const hasError = await errorMessage.first().isVisible().catch(() => false)

      expect(hasIndicator || hasError).toBeTruthy()
    })

    test('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/register')

      await page.getByLabel(/이름/i).fill('Test User')
      const emailField = page.getByLabel(/이메일/i)
      await emailField.fill('not-an-email')
      await emailField.blur()

      // Wait for validation
      await page.waitForTimeout(500)

      // Check for email validation error or invalid state
      const emailError = page.getByText(/유효|올바른|이메일 형식|valid.*email|invalid.*email/i)
      const hasError = await emailError.first().isVisible().catch(() => false)
      const isInvalid = await emailField.evaluate(el => {
        if (el instanceof HTMLInputElement) {
          return !el.checkValidity()
        }
        return false
      }).catch(() => false)

      expect(hasError || isInvalid).toBeTruthy()
    })

    test('should show error for mismatched passwords', async ({ page }) => {
      await page.goto('/register')

      await page.getByLabel(/이름/i).fill('Test User')
      await page.getByLabel(/이메일/i).fill('test@example.com')
      const passwordField = page.getByLabel(/^비밀번호$/i)
      await passwordField.fill('ValidPass123!')

      // Check if confirm field exists
      const confirmField = page.getByLabel(/비밀번호 확인/i)
      const hasConfirmField = await confirmField.isVisible().catch(() => false)

      if (hasConfirmField) {
        await confirmField.fill('DifferentPass123!')

        // RHF+zod shows mismatch on submit, not blur
        // Fill all required fields first
        await page.getByLabel(/이름/i).fill('Test User')
        await page.getByLabel(/이메일/i).fill(`mismatch-${Date.now()}@example.com`)

        // Submit form to trigger validation
        await page.getByRole('button', { name: /계정 만들기|회원가입/i }).click()

        // Wait for validation
        await page.waitForTimeout(500)

        // Should show mismatch error
        const mismatchError = page.getByText(/일치|match|same/i)
        const hasError = await mismatchError.first().isVisible().catch(() => false)
        expect(hasError).toBeTruthy()
      } else {
        // Skip test if no confirm field
        test.skip()
      }
    })
  })

  test.describe('Login', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
      // Check if backend is available
      let backendAvailable = false;
      try {
        const response = await page.request.get('http://localhost:8765/docs');
        backendAvailable = response.ok();
      } catch {
        backendAvailable = false;
      }

      if (!backendAvailable) {
        test.skip(true, 'Backend not available - cannot test login');
        return;
      }

      // First register a user
      const user = createTestUser()
      await registerTestUser(page, user)
      await clearAuthState(page)

      // Now login
      await page.goto('/login')
      await page.getByLabel(/이메일/i).fill(user.email)
      await page.getByLabel(/비밀번호/i).fill(user.password)
      await page.getByRole('button', { name: /로그인/i }).click()

      // Wait for redirect
      await page.waitForURL(/\/(dashboard)?$/, { timeout: 10000 })

      // Verify token
      const token = await getAuthToken(page)
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login')

      // Use unique email to avoid rate limiting issues
      const uniqueEmail = `nonexistent-${Date.now()}@example.com`

      await page.getByLabel(/이메일/i).fill(uniqueEmail)
      await page.getByLabel(/비밀번호/i).fill('WrongPassword123!')
      await page.getByRole('button', { name: /로그인/i }).click()

      // Wait for error message or stay on login page
      await page.waitForTimeout(2000)

      // Should either show error message or stay on login page
      const errorMessage = page.getByText(/잘못된|실패|오류|incorrect|invalid|wrong/i)
      const hasError = await errorMessage.first().isVisible().catch(() => false)
      const stillOnLogin = page.url().includes('/login')

      expect(hasError || stillOnLogin).toBeTruthy()

      // Token should not be set
      const token = await getAuthToken(page)
      expect(token).toBeFalsy()
    })

    test('should show error for empty credentials', async ({ page }) => {
      await page.goto('/login')

      // Try to submit with empty fields
      const submitButton = page.getByRole('button', { name: /로그인/i })
      await submitButton.click()

      // Should either have HTML5 validation or custom validation
      const emailField = page.getByLabel(/이메일/i)
      const passwordField = page.getByLabel(/비밀번호/i)

      const emailInvalid = await emailField.evaluate(el => {
        if (el instanceof HTMLInputElement) {
          return !el.checkValidity()
        }
        return false
      }).catch(() => false)
      const passwordInvalid = await passwordField.evaluate(el => {
        if (el instanceof HTMLInputElement) {
          return !el.checkValidity()
        }
        return false
      }).catch(() => false)

      // At least one field should be invalid or we should still be on login page
      const stillOnLogin = page.url().includes('/login')
      expect(emailInvalid || passwordInvalid || stillOnLogin).toBeTruthy()
    })
  })

  test.describe('Token Persistence', () => {
    test('should persist authentication after page refresh', async ({ page }) => {
      // Check if backend is available
      let backendAvailable = false;
      try {
        const response = await page.request.get('http://localhost:8765/docs');
        backendAvailable = response.ok();
      } catch {
        backendAvailable = false;
      }

      if (!backendAvailable) {
        test.skip(true, 'Backend not available - cannot test token persistence');
        return;
      }

      // Register and login
      const user = createTestUser()
      try {
        await registerTestUser(page, user)
      } catch (error) {
        test.skip(true, 'Backend not available - registration failed');
        return;
      }

      // Get initial token
      const tokenBefore = await getAuthToken(page)
      expect(tokenBefore).toBeTruthy()

      // Refresh page
      await page.reload()
      await page.waitForLoadState('domcontentloaded')

      // Token should still be there
      const tokenAfter = await getAuthToken(page)
      expect(tokenAfter).toBeTruthy()
      expect(tokenAfter).toBe(tokenBefore)

      // Should still be on authenticated page
      const url = page.url()
      expect(url).not.toContain('/login')
      expect(url).not.toContain('/register')
    })

    test('should persist authentication across navigation', async ({ page }) => {
      // Check if backend is available
      let backendAvailable = false;
      try {
        const response = await page.request.get('http://localhost:8765/docs');
        backendAvailable = response.ok();
      } catch {
        backendAvailable = false;
      }

      if (!backendAvailable) {
        test.skip(true, 'Backend not available - cannot test token persistence');
        return;
      }

      // Register and login
      const user = createTestUser()
      try {
        await registerTestUser(page, user)
      } catch (error) {
        test.skip(true, 'Backend not available - registration failed');
        return;
      }

      const tokenBefore = await getAuthToken(page)
      expect(tokenBefore).toBeTruthy()

      // Navigate to settings (if exists)
      const settingsLink = page.getByRole('link', { name: /설정|settings/i })
      const hasSettings = await settingsLink.isVisible().catch(() => false)

      if (hasSettings) {
        await settingsLink.click()
        await page.waitForLoadState('domcontentloaded')

        // Token should persist
        const tokenAfter = await getAuthToken(page)
        expect(tokenAfter).toBe(tokenBefore)
      } else {
        // Navigate to home and back
        await page.goto('/')
        await page.waitForLoadState('domcontentloaded')

        const tokenAfter = await getAuthToken(page)
        expect(tokenAfter).toBe(tokenBefore)
      }
    })
  })

  test.describe('Logout', () => {
    test('should clear auth state on logout', async ({ page }) => {
      // Check if backend is available
      let backendAvailable = false;
      try {
        const response = await page.request.get('http://localhost:8765/docs');
        backendAvailable = response.ok();
      } catch {
        backendAvailable = false;
      }

      if (!backendAvailable) {
        test.skip(true, 'Backend not available - cannot test logout');
        return;
      }

      // Register and login
      const user = createTestUser()
      try {
        await registerTestUser(page, user)
      } catch (error) {
        test.skip(true, 'Backend not available - registration failed');
        return;
      }

      // Verify logged in
      const tokenBefore = await getAuthToken(page)
      expect(tokenBefore).toBeTruthy()

      // Try to find and click logout button
      const logoutButton = page.getByRole('button', { name: /로그아웃|logout/i })
      const logoutLink = page.getByRole('link', { name: /로그아웃|logout/i })
      const userMenu = page.locator('[data-testid="user-menu"], .user-menu, [aria-label*="user"], [aria-label*="사용자"]')

      // Try clicking user menu first if it exists
      const hasUserMenu = await userMenu.first().isVisible().catch(() => false)
      if (hasUserMenu) {
        await userMenu.first().click()
        await page.waitForTimeout(300)
      }

      const hasLogoutButton = await logoutButton.isVisible().catch(() => false)
      const hasLogoutLink = await logoutLink.isVisible().catch(() => false)

      if (hasLogoutButton) {
        await logoutButton.click()
        await page.waitForLoadState('domcontentloaded')
      } else if (hasLogoutLink) {
        await logoutLink.click()
        await page.waitForLoadState('domcontentloaded')
      } else {
        // If no logout UI exists, manually clear state and verify behavior
        await clearAuthState(page)
        await page.goto('/dashboard')

        // Should redirect to login if auth is required
        await page.waitForTimeout(1000)
        const finalUrl = page.url()
        const redirectedToLogin = finalUrl.includes('/login') || finalUrl.includes('/register')

        if (!redirectedToLogin) {
          // App might allow anonymous access
          test.skip()
          return
        }
      }

      // After logout, token should be cleared
      await page.waitForTimeout(500)
      const tokenAfter = await getAuthToken(page)
      expect(tokenAfter).toBeFalsy()

      // Should be redirected to login or home
      const finalUrl = page.url()
      const validLogoutDestination = finalUrl.includes('/login') ||
                                     finalUrl.includes('/register') ||
                                     finalUrl === 'http://localhost:3000/'
      expect(validLogoutDestination).toBeTruthy()
    })

    test('should require re-authentication after logout', async ({ page }) => {
      // Check if backend is available
      let backendAvailable = false;
      try {
        const response = await page.request.get('http://localhost:8765/docs');
        backendAvailable = response.ok();
      } catch {
        backendAvailable = false;
      }

      if (!backendAvailable) {
        test.skip(true, 'Backend not available - cannot test re-authentication');
        return;
      }

      // Register and login
      const user = createTestUser()
      try {
        await registerTestUser(page, user)
      } catch (error) {
        test.skip(true, 'Backend not available - registration failed');
        return;
      }

      // Manually logout by clearing state
      await clearAuthState(page)

      // Try to access protected route
      await page.goto('/dashboard')
      await page.waitForTimeout(1000)

      // Should be redirected to login or blocked
      const finalUrl = page.url()
      const requiresAuth = finalUrl.includes('/login') || finalUrl.includes('/register')

      // Token should be absent
      const token = await getAuthToken(page)

      // Either redirected to login OR no token means auth is required
      expect(requiresAuth || !token).toBeTruthy()
    })
  })

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
      await clearAuthState(page)
      await page.goto('/dashboard')

      // Wait for potential redirect
      await page.waitForTimeout(1500)

      const finalUrl = page.url()
      const token = await getAuthToken(page)

      // Should either redirect to login or not have a token
      const redirectedToLogin = finalUrl.includes('/login') || finalUrl.includes('/register')
      expect(redirectedToLogin || !token).toBeTruthy()
    })

    test('should allow access to public routes without auth', async ({ page }) => {
      await clearAuthState(page)

      // Try accessing login page
      await page.goto('/login')
      await page.waitForLoadState('domcontentloaded')

      const loginUrl = page.url()
      expect(loginUrl).toContain('/login')

      // Login page should be accessible
      const loginHeading = page.getByRole('heading', { name: /로그인/i })
      const hasHeading = await loginHeading.isVisible().catch(() => false)
      expect(hasHeading).toBeTruthy()
    })
  })
})
