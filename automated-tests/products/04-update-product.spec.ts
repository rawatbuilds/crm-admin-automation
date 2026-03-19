import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ENV } from '../config/env';
import fs from 'fs';
import path from 'path';

test('TC08 - Update Product via Bulk Edit', async ({ page }) => {
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

  // Login
  await loginPage.login(
    ENV.credentials.email,
    ENV.credentials.password,
    ENV.credentials.otp
  );

  await dashboardPage.assertExecutiveSummaryVisible();
  await dashboardPage.switchMerchant(ENV.merchant.id);

  await productsPage.navigateToProducts();

  // Search original product
  await productsPage.searchProduct(productName);

  // Bulk edit flow
  await productsPage.selectProductCheckbox(productName);
  await productsPage.clickBulkEdit();
  await productsPage.waitForBulkEditTable();

  const updatedName = await productsPage.appendTitleInBulkEdit(
    '_rajatEdit'
  );

  // No separate Save step — modal appears immediately after cell edit
  await productsPage.confirmBulkEditModal();

  console.log(`✅ Product updated to: ${updatedName}`);

  // Navigate directly via URL to get a clean page (no stale search chip)
  await page.goto(`/gk-pages/store/${ENV.merchant.id}/products`);
  await page.waitForLoadState('networkidle');

  // Search and verify updated product
  await productsPage.searchProduct(updatedName);
  await productsPage.verifyUpdatedProductInListing(updatedName);

  // Save updated name for next tests
  fs.writeFileSync(
    filePath,
    JSON.stringify({ productName: updatedName }, null, 2)
  );

  console.log('✅ Updated product name saved for future tests');
});