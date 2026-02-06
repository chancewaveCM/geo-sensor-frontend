# E2E Tests for GEO Sensor Frontend

## Overview

This directory contains end-to-end tests for the GEO Sensor Frontend application using Playwright. Tests cover user authentication flows, company profile management, analysis workflows, and integration scenarios.

## Setup Requirements

- **Node.js**: 18 or higher
- **pnpm**: Package manager for the project
- **Backend**: Running on http://localhost:8765
- **Frontend**: Running on http://localhost:3765
- **Chromium**: Browser for test execution

## Installation

### Install Dependencies

```bash
cd geo-sensor-frontend
pnpm install
pnpm exec playwright install chromium
```

### Verify Setup

```bash
# Check backend health
curl http://localhost:8765/docs

# Check frontend health
curl http://localhost:3765

# Verify Playwright installation
pnpm exec playwright --version
```

## Running Tests

### Run All Tests (Headless)

```bash
pnpm test:e2e
```

Runs all tests in headless mode (no visible browser window). Parallel execution enabled for speed.

### Run with UI Mode (Interactive)

```bash
pnpm test:e2e:ui
```

Opens the Playwright Inspector with interactive test controls. Best for debugging and development.

### Run Specific Test File

```bash
# Run a single test file
pnpm test:e2e e2e/auth-flow.spec.ts

# Run tests matching a pattern
pnpm test:e2e e2e/*-flow.spec.ts
```

### Run with Browser Visible

```bash
pnpm test:e2e:headed
```

Runs tests with visible browser window for manual observation.

### Run Single Test

```bash
pnpm test:e2e -g "should successfully register a new user"
```

## Test Files

| File | Coverage | Purpose |
|------|----------|---------|
| **auth-flow.spec.ts** | Registration, login, logout, token persistence | User authentication and session management |
| **company-profiles.spec.ts** | Full CRUD operations on company profiles | Profile creation, update, deletion |
| **settings.spec.ts** | Settings page UI and modals | User preferences and configurations |
| **navigation.spec.ts** | Route protection, navigation flows | Navigation and access control |
| **analysis-wizard.spec.ts** | 3-step wizard for analysis setup | Query composition and execution |
| **query-lab.spec.ts** | Single query and pipeline modes | Query testing and debugging |
| **dashboard-integration.spec.ts** | Dashboard stats and charts | Overview page functionality |
| **error-handling.spec.ts** | Network errors, API errors | Error states and recovery |

## Test Utilities

Located in `e2e/utils/`:

### test-helpers.ts
Authentication and session utilities:
- `loginAsTestUser()` - Login with test credentials
- `registerTestUser()` - Create test account
- `clearAuthState()` - Clear browser storage and cookies
- `waitForAuthToken()` - Wait for token in localStorage

### api-helpers.ts
Direct API calls for test data setup:
- `createTestCompanyProfile()` - Setup test data
- `createTestPipeline()` - Create pipeline for tests
- `deleteTestData()` - Cleanup test data
- `mockAnalysisResponse()` - Mock LLM responses

### fixtures.ts
Test data constants:
- `TEST_USER_EMAIL` - Test user email
- `TEST_USER_PASSWORD` - Test user password
- `TEST_COMPANY_PROFILE` - Default test profile
- `TEST_QUERY_PROMPT` - Sample analysis prompt

## Environment Configuration

### Default Ports

- **Frontend**: http://localhost:3765 (configurable via BASE_URL in playwright.config.ts)
- **Backend**: http://localhost:8765 (used by test API helpers)

### Test Database

Tests use the same SQLite database as development. Use `api-helpers.ts` to create/cleanup test data:

```typescript
import { createTestCompanyProfile, deleteTestData } from './utils/api-helpers';

test.beforeEach(async () => {
  // Setup
  const profile = await createTestCompanyProfile();

  test.afterEach(async () => {
    // Cleanup
    await deleteTestData(profile.id);
  });
});
```

## Debugging Tests

### Debug Mode (Interactive Inspector)

```bash
pnpm test:e2e:ui
```

The Playwright Inspector allows you to:
- Step through tests line by line
- Inspect elements
- Replay steps
- View network requests

### View Test Report

```bash
pnpm exec playwright show-report
```

Generates and opens an HTML report with test results, screenshots, and videos.

### Enable Verbose Logging

```bash
DEBUG=pw:api pnpm test:e2e
```

Shows detailed Playwright API calls and events.

### Screenshot on Failure

Tests are configured to capture screenshots on failure. Check:
```
test-results/
├── [test-name]-1-webkit/
│   └── test-failed-1.png
└── ...
```

## CI Configuration

### Current Setup

- **Browser**: Chromium only (optimized for speed)
- **Parallelization**: Enabled (multiple tests run simultaneously)
- **Retries**: Failed tests retried once
- **Timeout**: 30 seconds per test, 5 minutes per test file

### Running in CI/CD

```bash
# Install dependencies
pnpm install
pnpm exec playwright install --with-deps chromium

# Run tests (exit code 0 on success, non-zero on failure)
pnpm test:e2e
```

## Test Structure

All tests follow this structure:

```typescript
import { test, expect } from '@playwright/test';
import { loginAsTestUser, clearAuthState } from './utils/test-helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: clear auth, login, navigate
    await clearAuthState(page);
    await loginAsTestUser(page);
    await page.goto('/dashboard');
  });

  test('should perform action', async ({ page }) => {
    // Act
    await page.click('button[aria-label="Action"]');

    // Assert
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup if needed
    await clearAuthState(page);
  });
});
```

## Best Practices

### 1. Use Semantic Selectors

```typescript
// ✅ Good: ARIA labels and test IDs
await page.click('button[aria-label="Save"]');
await page.fill('[data-testid="email-input"]', 'test@example.com');

// ❌ Avoid: CSS selectors dependent on styling
await page.click('div > div > div:nth-child(3) > button');
```

### 2. Wait for Readiness

```typescript
// ✅ Wait for element visibility
await expect(page.locator('.modal')).toBeVisible();

// ❌ Avoid: Hard sleeps
await page.waitForTimeout(2000);
```

### 3. Isolate Tests

Each test should be independent:
- Setup required data in `beforeEach`
- Cleanup in `afterEach`
- No shared state between tests

```typescript
test.beforeEach(async () => {
  // Fresh state for each test
  await createTestCompanyProfile();
});

test.afterEach(async () => {
  // Always cleanup
  await deleteTestData();
});
```

### 4. Test User Actions, Not Implementation

```typescript
// ✅ Test user behavior
test('should save settings when user clicks Save', async ({ page }) => {
  await page.fill('[data-testid="setting-input"]', 'value');
  await page.click('button:has-text("Save")');
  await expect(page.locator('.success')).toBeVisible();
});

// ❌ Don't test implementation details
test('should call updateSettings API', async ({ page }) => {
  // API calls are implementation, not behavior
});
```

## Common Issues

### Issue: "Target page, context or browser has been closed"

**Cause**: Browser closed unexpectedly or page timeout

**Solution**:
```bash
# Increase timeout in playwright.config.ts
timeout: 45000 // 45 seconds instead of 30
```

### Issue: "Locator is not found"

**Cause**: Element not in DOM or test ID changed

**Solution**:
1. Verify element exists in browser: `pnpm test:e2e:ui`
2. Check for timing issues: use `waitForLoadState()`
3. Update selector if UI changed

```typescript
// Add explicit wait
await page.waitForLoadState('networkidle');
await expect(page.locator('[data-testid="save-btn"]')).toBeVisible();
```

### Issue: Tests Pass Locally but Fail in CI

**Cause**: Timing or environment differences

**Solution**:
1. Increase timeouts for CI: `test.setTimeout(60000)`
2. Add explicit waits before assertions
3. Mock external services if unreliable

## Maintenance

### Adding New Tests

1. Create new `.spec.ts` file in `e2e/` directory
2. Import helpers from `e2e/utils/`
3. Follow test structure and naming conventions
4. Run `pnpm test:e2e` to verify

### Updating Tests

When UI components change:
1. Identify affected test files
2. Update selectors using Playwright Inspector (`pnpm test:e2e:ui`)
3. Re-run tests to verify
4. Commit changes with clear messages

### Keeping Tests Fast

- Reuse test data where possible
- Use `apiRequestContext` for data setup instead of UI navigation
- Minimize browser page navigation
- Run only affected tests during development

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Project Configuration](./playwright.config.ts)

## Questions?

For issues or questions:
1. Check the Playwright Inspector: `pnpm test:e2e:ui`
2. Review test reports: `pnpm exec playwright show-report`
3. Consult project CLAUDE.md for GEO Sensor-specific guidance
