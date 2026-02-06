# E2E Test Suite Summary

**Created:** 2026-02-05  
**Total Tests:** 127 tests across 11 spec files  
**Framework:** Playwright with Chromium browser

## Test Files Created

| File | Tests | Description |
|------|-------|-------------|
| `auth.spec.ts` | 5 | Basic auth UI rendering |
| `auth-flow.spec.ts` | 13 | Complete authentication flows |
| `dashboard.spec.ts` | 4 | Dashboard UI verification |
| `dashboard-integration.spec.ts` | 20 | Dashboard integration tests |
| `analysis.spec.ts` | 5 | Analysis page tests |
| `analysis-wizard.spec.ts` | 15 | Analysis wizard flow tests |
| `company-profiles.spec.ts` | 13 | Company profile CRUD operations |
| `error-handling.spec.ts` | 18 | Error handling and recovery |
| `navigation.spec.ts` | 22 | Navigation and protected routes |
| `settings.spec.ts` | 5 | **NEW** Settings page tests |
| `query-lab.spec.ts` | 7 | **NEW** Query Lab tests |

## Coverage by Feature

### Authentication (18 tests)
- Login/registration flows
- Token persistence
- Logout functionality
- Protected route access

### Dashboard (24 tests)
- Stats cards display
- Charts rendering
- Data loading states
- Layout responsiveness
- Navigation

### Analysis (20 tests)
- 3-step wizard flow
- Form validation
- Query generation
- Query editing

### Company Profiles (13 tests)
- CRUD operations
- Soft delete/reactivate
- Form validation
- Profile listing

### Settings (5 tests)
- Profile management UI
- Add/edit profile modal
- Inactive profile toggle

### Query Lab (7 tests)
- Single query mode
- Pipeline mode
- Mode switching
- Provider selection

### Error Handling (18 tests)
- Network errors (timeout, disconnect)
- API errors (400, 401, 403, 404, 500, 502)
- Form validation errors
- Error recovery and retry

### Navigation (22 tests)
- Protected routes
- Auth state transitions
- Deep linking
- Edge cases

## Running Tests

```bash
# All tests (headless)
pnpm test:e2e

# Interactive UI mode
pnpm test:e2e:ui

# With browser visible
pnpm test:e2e:headed

# Specific file
pnpm exec playwright test e2e/settings.spec.ts

# List all tests
pnpm exec playwright test --list
```

## Test Utilities

Located in `e2e/utils/`:
- `test-helpers.ts` - Auth helpers, test user creation
- `api-helpers.ts` - Direct API calls for setup
- `fixtures.ts` - Test data fixtures

## Notes

- All tests use `setupAuthenticatedState()` for authenticated tests
- Tests use Korean localization patterns for UI validation
- Error handling tests include API mocking
- Some tests marked as TODO require backend completion
