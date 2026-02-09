import { FullConfig } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BACKEND_URL = 'http://localhost:8765';
const AUTH_CACHE_PATH = join(process.cwd(), 'e2e', '.cache', 'auth-token.json');

const E2E_TEST_USER = {
  email: 'e2etest@example.com',
  password: 'TestPassword123@',
  name: 'E2E Test'
};

async function globalSetup(config: FullConfig) {
  // Check if backend is running
  try {
    const healthCandidates = ['/api/v1/health', '/health'];
    let healthy = false;
    for (const path of healthCandidates) {
      const response = await fetch(`${BACKEND_URL}${path}`);
      if (response.ok) {
        healthy = true;
        break;
      }
    }
    if (!healthy) {
      console.warn('[E2E Setup] Backend not running - backend-dependent tests will be skipped');
      return;
    }
    // Backend is available
  } catch {
    // Backend not reachable - backend-dependent tests will be skipped
    return;
  }

  // Try to create test user (ignore if already exists)
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: E2E_TEST_USER.email,
        password: E2E_TEST_USER.password,
        full_name: E2E_TEST_USER.name
      })
    });
    // Test user created or already exists
  } catch {
    // Could not create test user - may already exist
  }

  // Cache one access token for all workers to reduce auth rate-limit failures.
  try {
    const form = new URLSearchParams();
    form.append('username', E2E_TEST_USER.email);
    form.append('password', E2E_TEST_USER.password);

    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    if (response.ok) {
      const payload = await response.json();
      if (payload?.access_token) {
        await mkdir(dirname(AUTH_CACHE_PATH), { recursive: true });
        await writeFile(
          AUTH_CACHE_PATH,
          JSON.stringify(
            {
              email: E2E_TEST_USER.email,
              access_token: payload.access_token,
              created_at: new Date().toISOString(),
            },
            null,
            2
          ),
          'utf8'
        );
        console.log('[E2E Setup] Auth token cache generated');
      }
    } else {
      console.warn('[E2E Setup] Failed to create auth token cache');
    }
  } catch {
    console.warn('[E2E Setup] Could not create auth token cache');
  }
}

export default globalSetup;
