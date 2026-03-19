import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ENV } from '../config/env';

test('TC01 & TC02 - Login, Land on Executive Summary and Select Merchant', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // ===============================
  // TC01 - Login
  // ===============================
  await loginPage.login(
    ENV.credentials.email,
    ENV.credentials.password,
    ENV.credentials.otp
  );

  await expect(page).toHaveURL(/executive-summary/, { timeout: 15000 });
  console.log('✅ Login successful');

  // ===============================
  // TC01 - Verify Executive Summary
  // ===============================
  await dashboardPage.assertExecutiveSummaryVisible();
  console.log('✅ Executive Summary visible');

  // ===============================
  // TC02 - Switch Merchant
  // ===============================
  await dashboardPage.switchMerchant(ENV.merchant.id);

  await expect(page.locator('body')).toContainText(ENV.merchant.id);
  console.log('✅ Merchant switched successfully');

  // ===============================
  // TC02 - Navigate to GK Pages > Products
  // ===============================
  await page.getByText('GK Pages').click();

  await Promise.all([
    page.waitForURL(new RegExp(`/gk-pages/store/${ENV.merchant.id}/products`)),
    page.locator('.ant-menu-title-content', { hasText: 'Products' }).click(),
  ]);

  console.log('✅ Navigated to Products page');

  // ===============================
  // TC02 - Validate Products Page
  // ===============================
  await expect(
    page.getByRole('heading', { level: 1, name: 'Products' })
  ).toBeVisible({ timeout: 15000 });

  console.log('✅ Products page heading verified');
});
