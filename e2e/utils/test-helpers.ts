import { Page, expect } from '@playwright/test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const FRONTEND_URL = 'http://localhost:3765'
const BACKEND_URL = 'http://localhost:8765'
const AUTH_CACHE_PATH = join(process.cwd(), 'e2e', '.cache', 'auth-token.json')

const E2E_TEST_USER = {
  email: 'e2etest@example.com',
  password: 'TestPassword123@',
  name: 'E2E Test',
}

interface CachedAuthFile {
  email: string
  access_token: string
  created_at?: string
}

const cachedTokenByEmail = new Map<string, string>()

export function createTestUser() {
  const timestamp = Date.now()
  return {
    email: `test-${timestamp}@example.com`,
    password: 'TestPass123!',
    name: `Test User ${timestamp}`,
  }
}

async function ensureUserRegistered(credentials: { email: string; password: string; name: string }) {
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      full_name: credentials.name,
    }),
  })

  if (
    response.ok
    || response.status === 400
    || response.status === 409
    || response.status === 422
    || response.status === 429
  ) {
    return
  }

  const body = await response.text().catch(() => '')
  throw new Error(`Failed to register user via API: ${response.status} ${body}`)
}

async function fetchAccessToken(email: string, password: string): Promise<string> {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)

  const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Failed to login via API: ${response.status} ${body}`)
  }

  const data = await response.json()
  if (!data.access_token) {
    throw new Error('Login response does not include access_token')
  }

  return data.access_token as string
}

async function readTokenFromFile(email: string): Promise<string | null> {
  try {
    const raw = await readFile(AUTH_CACHE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as CachedAuthFile

    if (parsed.email === email && parsed.access_token) {
      return parsed.access_token
    }
  } catch {
    // Cache file may not exist yet.
  }

  return null
}

async function writeTokenToFile(email: string, accessToken: string): Promise<void> {
  try {
    await mkdir(dirname(AUTH_CACHE_PATH), { recursive: true })
    const payload: CachedAuthFile = {
      email,
      access_token: accessToken,
      created_at: new Date().toISOString(),
    }
    await writeFile(AUTH_CACHE_PATH, JSON.stringify(payload, null, 2), 'utf8')
  } catch {
    // Best effort only.
  }
}

async function resolveToken(email: string, password: string): Promise<string> {
  const cachedToken = cachedTokenByEmail.get(email)
  if (cachedToken) {
    return cachedToken
  }

  const fileToken = await readTokenFromFile(email)
  if (fileToken) {
    cachedTokenByEmail.set(email, fileToken)
    return fileToken
  }

  const token = await fetchAccessToken(email, password)
  cachedTokenByEmail.set(email, token)
  await writeTokenToFile(email, token)
  return token
}

export async function loginAsTestUser(page: Page, email?: string, password?: string) {
  const userEmail = email || E2E_TEST_USER.email
  const userPassword = password || E2E_TEST_USER.password

  const token = await resolveToken(userEmail, userPassword)

  await page.goto(FRONTEND_URL)
  await page.evaluate((accessToken) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.removeItem('refresh_token')
    document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 30}; SameSite=Lax`
  }, token)

  await page.goto(`${FRONTEND_URL}/dashboard`)
  await page.waitForLoadState('domcontentloaded')

  const storedToken = await page.evaluate(() => localStorage.getItem('access_token'))
  expect(storedToken).toBeTruthy()

  return storedToken
}

export async function loginWithTestUser(page: Page) {
  await ensureUserRegistered(E2E_TEST_USER)
  return loginAsTestUser(page, E2E_TEST_USER.email, E2E_TEST_USER.password)
}

export async function registerTestUser(
  page: Page,
  credentials: { email: string; password: string; name: string }
) {
  await ensureUserRegistered(credentials)
  await clearAuthState(page)
  await loginAsTestUser(page, credentials.email, credentials.password)
}

export async function clearAuthState(page: Page) {
  await page.context().clearCookies()

  const currentUrl = page.url()
  if (!currentUrl.includes('localhost:3765')) {
    await page.goto(FRONTEND_URL)
  }

  await page.evaluate(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.clear()
  })
}

export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse((response) => {
    const url = response.url()
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern)
    }
    return urlPattern.test(url)
  })
}

export async function getAuthToken(page: Page): Promise<string | null> {
  try {
    return await page.evaluate(() => localStorage.getItem('access_token'))
  } catch {
    return null
  }
}

export async function setupAuthenticatedState(page: Page) {
  await loginWithTestUser(page)
  return E2E_TEST_USER
}
