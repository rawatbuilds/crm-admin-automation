import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ENV } from '../config/env';
import fs from 'fs';
import path from 'path';
import {
  CreateProductTestData,
  generateUniqueCreateProductData,
} from '../test-data/create-product.testdata';

test('TC03 - Create Product Successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const productsPage = new ProductsPage(page);

  const uniqueProduct = generateUniqueCreateProductData();

  // ======================================
  // TC01 - Login Validation
  // ======================================
  await loginPage.login(
    ENV.credentials.email,
    ENV.credentials.password,
    ENV.credentials.otp
  );

  await expect(page).toHaveURL(/executive-summary/);
  console.log('✅ User landed on Executive Summary');

  await expect(
    page.getByRole('menuitem', { name: /executive summary/i })
  ).toBeVisible();
  console.log('✅ Executive Summary menu visible');

  // ======================================
  // TC02 - Merchant Switch Validation
  // ======================================
  await dashboardPage.switchMerchant(ENV.merchant.id);

  await expect(page.locator('body')).toContainText(ENV.merchant.id);
  console.log('✅ Merchant ID switched successfully');

  // ======================================
  // TC03 - Navigate to Products Page
  // ======================================
  await productsPage.navigateToProducts();

  await expect(page).toHaveURL(
    new RegExp(`/gk-pages/store/${ENV.merchant.id}/products`)
  );
  console.log('✅ Products page URL verified');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Products' })
  ).toBeVisible();
  console.log('✅ Products page header visible');

  // ======================================
  // TC04 - Create Product
  // ======================================
  await productsPage.clickAddProduct();

  await productsPage.fillBasicDetails(
    uniqueProduct.name,
    CreateProductTestData.baseProduct.description
  );

  await productsPage.fillPricing(
    CreateProductTestData.baseProduct.price,
    CreateProductTestData.baseProduct.comparePrice,
    CreateProductTestData.baseProduct.cost
  );

  await productsPage.fillInventory(
    uniqueProduct.sku,
    uniqueProduct.barcode
  );

  await productsPage.fillShipping(
    CreateProductTestData.baseProduct.weight
  );

  await productsPage.saveProductAndGoToListing(ENV.merchant.id);

  console.log('✅ Product creation submitted successfully');

  // ======================================
  // TC05 - Validate Product in Listing
  // ======================================
  await expect(page).toHaveURL(
    new RegExp(`/gk-pages/store/${ENV.merchant.id}/products`)
  );
  console.log('✅ Returned to Products listing page');

  const productRow = page
    .getByRole('row')
    .filter({ hasText: uniqueProduct.name });

  await expect(productRow).toBeVisible();
  console.log('✅ Product appears in listing');

  await expect(productRow).toContainText('Active');
  console.log('✅ Product status is Active');

  // ======================================
  // Save product name for read + update tests
  // ======================================
  const filePath = path.resolve(
    __dirname,
    '../test-data/latest-product.json'
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify({ productName: uniqueProduct.name }, null, 2)
  );

  console.log(`✅ Product name saved to latest-product.json: ${uniqueProduct.name}`);
});




