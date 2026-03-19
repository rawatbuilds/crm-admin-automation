import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ENV } from '../config/env';
import fs from 'fs';
import path from 'path';

test('TC09 - Delete Product via More Actions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const productsPage = new ProductsPage(page);

  const filePath = path.resolve(
    __dirname,
    '../test-data/latest-product.json'
  );

  const { productName } = JSON.parse(
    fs.readFileSync(filePath, 'utf-8')
  );

  // ===============================
  // Login
  // ===============================
  await loginPage.login(
    ENV.credentials.email,
    ENV.credentials.password,
    ENV.credentials.otp
  );

  await dashboardPage.assertExecutiveSummaryVisible();
  await dashboardPage.switchMerchant(ENV.merchant.id);

  console.log('✅ Login and merchant switch successful');

  // ===============================
  // Step 1 - Navigate to Products
  // ===============================
  await productsPage.navigateToProducts();
  console.log('✅ Products page loaded');

  // ===============================
  // Step 2 - Search Product
  // ===============================
  await productsPage.searchProduct(productName);
  console.log(`✅ Product "${productName}" found`);

  // ===============================
  // Step 3 - Select Checkbox
  // ===============================
  await productsPage.selectProductCheckbox(productName);
  console.log('✅ Product selected via checkbox');

  // ===============================
  // Step 4 - Click More Actions
  // ===============================
  await page
    .locator('[data-test-id="bulk_action_toolbar_more_actions_button"]')
    .click();

  console.log('✅ More actions dropdown opened');

  // ===============================
  // Step 5 - Click Delete products
  // ===============================
  await page
    .getByRole('menuitem', { name: 'Delete products' })
    .click();

  console.log('✅ Delete products option clicked');

  // ===============================
  // Step 6 - Confirm Delete Modal
  // ===============================
  await expect(
    page.locator('.ant-modal-footer').getByRole('button', { name: 'OK' })
  ).toBeVisible({ timeout: 10000 });

  await page
    .locator('.ant-modal-footer')
    .getByRole('button', { name: 'OK' })
    .click();

  console.log('✅ Delete confirmed');

  // ===============================
  // Step 7 - Verify Product Removed
  // ===============================

  // Navigate to a clean listing page
  await page.goto(`/gk-pages/store/${ENV.merchant.id}/products`);

  await expect(
    page.locator('[data-test-id="products_header_title"]')
  ).toBeVisible({ timeout: 15000 });

  // Search for the deleted product
  const searchInput = page.locator(
    '[data-test-id="products_search_input"]'
  );

  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await searchInput.click({ clickCount: 3 });
  await searchInput.fill('');
  await searchInput.pressSequentially(productName, { delay: 50 });

  // Wait for table to settle then assert row is gone
  await expect(
    page.locator('tr', { has: page.getByText(productName) })
  ).toHaveCount(0, { timeout: 15000 });

  console.log('✅ Product successfully deleted and not visible in listing');
});
