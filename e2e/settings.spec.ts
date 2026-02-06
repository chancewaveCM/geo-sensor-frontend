import { test, expect } from '@playwright/test';
import { loginWithTestUser, clearAuthState } from './utils/test-helpers';

const FRONTEND_URL = 'http://localhost:3765';

// Run tests serially to avoid rate limiting on login endpoint
test.describe.configure({ mode: 'serial' });

test.describe('Settings Page - 기업 프로필 관리', () => {
  test.beforeAll(async () => {
    // Check if backend is available
    try {
      const response = await fetch('http://localhost:8765/api/v1/health');
      if (!response.ok) test.skip(true, 'Backend not available');
    } catch {
      test.skip(true, 'Backend not available');
    }
  });

  test.beforeEach(async ({ page }) => {
    // Login first to access protected page
    await clearAuthState(page);
    await loginWithTestUser(page);

    // Navigate to settings
    await page.goto(`${FRONTEND_URL}/settings`);
    await page.waitForLoadState('networkidle');
  });

  test('페이지 로드 및 기본 UI 요소 표시', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /설정/i })).toBeVisible();
    const profileTab = page.getByRole('tab', { name: /기업 프로필/i });
    await expect(profileTab).toBeVisible();
  });

  test('빈 상태에서 새 프로필 추가 버튼 표시', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /새 프로필 추가|프로필 추가/i });
    await expect(addButton).toBeVisible();
  });

  test('새 프로필 추가 모달 열기 및 닫기', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Find and click the add button
    const addButton = page.locator('button:has-text("새 프로필 추가")');
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // Wait for modal to appear (shadcn Dialog uses data-state="open")
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Cancel button closes modal (text is "취소")
    const cancelButton = modal.locator('button:has-text("취소")');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('프로필 폼 필드 확인', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button:has-text("새 프로필 추가")');
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // Wait for modal
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Check form fields exist (기업명 input)
    await expect(modal.locator('input').first()).toBeVisible();
  });

  test('비활성 프로필 토글 기능', async ({ page }) => {
    // Look for inactive toggle
    const toggle = page.locator('text=/비활성 프로필 표시|비활성 포함|Show Inactive/i');
    if (await toggle.isVisible()) {
      await toggle.click();
    }
  });
});
