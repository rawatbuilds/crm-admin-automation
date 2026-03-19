import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ENV } from '../config/env';

setup('Prepare authenticated session', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Login
  await loginPage.login(
    ENV.credentials.email,
    ENV.credentials.password,
    ENV.credentials.otp
  );

  await page.waitForLoadState('networkidle');

  // Switch merchant
  await dashboardPage.switchMerchant(ENV.merchant.id);

  await page.waitForLoadState('networkidle');

  // Save state
  await page.context().storageState({ path: 'storageState.json' });

});