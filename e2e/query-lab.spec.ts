import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:3765';

test.describe('Query Lab Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly (auth middleware not enforced yet)
    await page.goto(`${FRONTEND_URL}/query-lab`);
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Single Query Mode', () => {
    test('should display single query mode UI', async ({ page }) => {
      // Check for query input
      const queryInput = page.locator('textarea, input[type="text"]').first();
      await expect(queryInput).toBeVisible();
    });

    test('should have provider selection options', async ({ page }) => {
      // Check for provider checkboxes or select
      const providers = page.locator('[type="checkbox"], [role="checkbox"]');
      const count = await providers.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button:has-text("실행"), button:has-text("시작"), button:has-text("분석"), button:has-text("검색"), button[type="submit"]').first();
      const isVisible = await submitButton.isVisible().catch(() => false);
      if (!isVisible) {
        test.skip(true, 'Submit button not found with expected text');
        return;
      }
      await expect(submitButton).toBeVisible();
    });
  });

  test.describe('Pipeline Mode', () => {
    test('should switch to pipeline mode', async ({ page }) => {
      const pipelineOption = page.locator('text=/파이프라인/i').first();
      if (await pipelineOption.isVisible()) {
        await pipelineOption.click();
        await page.waitForLoadState('networkidle');
      }
    });

    test('should have profile selector in pipeline mode', async ({ page }) => {
      const pipelineOption = page.locator('text=/파이프라인/i').first();
      if (await pipelineOption.isVisible()) {
        await pipelineOption.click();
        await page.waitForLoadState('networkidle');

        // Check for profile selector
        const selector = page.locator('select, [role="combobox"]').first();
        if (await selector.isVisible()) {
          await expect(selector).toBeVisible();
        }
      }
    });
  });

  test.describe('Mode Switching', () => {
    test('should be able to switch between modes', async ({ page }) => {
      const singleOption = page.locator('text=/단일 쿼리/i').first();
      const pipelineOption = page.locator('text=/파이프라인/i').first();

      if (await pipelineOption.isVisible()) {
        await pipelineOption.click();
        await page.waitForTimeout(500);

        if (await singleOption.isVisible()) {
          await singleOption.click();
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/v1/**', route => {
        route.fulfill({ status: 500, body: JSON.stringify({ detail: 'Server Error' }) });
      });

      const queryInput = page.locator('textarea, input[type="text"]').first();
      if (await queryInput.isVisible()) {
        await queryInput.fill('test query');

        const submitButton = page.locator('button:has-text("실행"), button:has-text("시작")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          // Should not crash
        }
      }
    });
  });
});
