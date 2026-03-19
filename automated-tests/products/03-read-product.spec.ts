import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ENV } from '../config/env';

test('TC07 - Read / Verify Latest Created Product', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const productsPage = new ProductsPage(page);

  const filePath = path.resolve(__dirname, '../test-data/latest-product.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('❌ latest-product.json not found. Run create-product.spec.ts first.');
  }

  const { productName } = JSON.parse(
    fs.readFileSync(filePath, 'utf-8')
  );

  // TC07 - Login
  await loginPage.login(
    ENV.credentials.email,
    ENV.credentials.password,
    ENV.credentials.otp
  );
  await expect(page).toHaveURL(/executive-summary/);
  console.log('✅ Login successful');

  // TC08 - Merchant Switch
  await dashboardPage.switchMerchant(ENV.merchant.id);
  console.log('✅ Merchant switched');

  // TC09 - Navigate to Products
  await productsPage.navigateToProducts();
  console.log('✅ Products page opened');

  // TC10 - Search Product
  await productsPage.searchProduct(productName);
  console.log('✅ Product searched');

  // TC11 - Validate Product Details
  await productsPage.verifyProductRowDetails(
    productName,
    'Active',
    '1 variants'
  );
  console.log('✅ Product validated successfully');
});