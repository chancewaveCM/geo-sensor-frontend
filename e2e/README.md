# E2E Tests for GEO Sensor Frontend

## Overview

This directory contains end-to-end tests using Playwright for the GEO Sensor frontend application.

## Test Files

- **auth.spec.ts** - Authentication flow tests (login, registration, validation)
- **dashboard.spec.ts** - Dashboard page tests (stats, navigation)
- **analysis.spec.ts** - Analysis feature tests (wizard, form validation)

## Running Tests

### Prerequisites

Install dependencies first:

```bash
npm install
npx playwright install chromium
```

### Run Tests

```bash
# Run all tests (headless)
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run with headed browser (visible)
npm run test:e2e:headed
```

## Test Structure

Tests follow these conventions:

- Use Korean text assertions to verify localization
- Use `page.getByRole()` and `page.getByText()` for accessibility-first selectors
- Organized with `test.describe()` blocks
- Include graceful failure handling for async validation

## Configuration

Test configuration is in `playwright.config.ts`:

- Base URL: `http://localhost:3000`
- Browser: Chromium only (for speed)
- Screenshots: On failure only
- Timeout: 30s per test
- Auto-starts dev server before tests

## Notes

- Tests assume the frontend is running on port 3000
- Some tests use graceful failure handling to accommodate async features
- Korean text patterns are used to verify proper localization
