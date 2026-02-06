import { FullConfig } from '@playwright/test';

const BACKEND_URL = 'http://localhost:8765';

const E2E_TEST_USER = {
  email: 'e2etest@example.com',
  password: 'TestPassword123@',
  name: 'E2E Test'
};

async function globalSetup(config: FullConfig) {
  // Check if backend is running
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/health`);
    if (!response.ok) {
      console.warn('[E2E Setup] Backend not running - backend-dependent tests will be skipped');
      return;
    }
    console.log('[E2E Setup] Backend is available');
  } catch {
    console.warn('[E2E Setup] Backend not reachable - backend-dependent tests will be skipped');
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
    if (response.ok) {
      console.log('[E2E Setup] Test user created successfully');
    } else {
      console.log('[E2E Setup] Test user already exists or registration failed (expected)');
    }
  } catch {
    console.log('[E2E Setup] Could not create test user - may already exist');
  }
}

export default globalSetup;
