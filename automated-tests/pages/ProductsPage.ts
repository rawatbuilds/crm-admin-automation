import { Page, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ================================
  // NAVIGATION
  // ================================

  async navigateToProducts() {
    await this.page.getByText('GK Pages').click();

    // Scoped to menu item to avoid strict mode violation
    await this.page
      .locator('.ant-menu-title-content', { hasText: 'Products' })
      .click();

    // Wait for the products header to confirm page loaded
    await expect(
      this.page.locator('[data-test-id="products_header_title"]')
    ).toBeVisible({ timeout: 15000 });
  }

  // ================================
  // CREATE PRODUCT FLOW
  // ================================

  async clickAddProduct() {
    await this.page.locator('[data-test-id="products_add_button"]').click();
  }

  async fillBasicDetails(title: string, description: string) {
    await this.page.locator('[data-test-id="title_input"]').fill(title);
    await this.page.locator('.ql-editor').first().fill(description);
  }

  async fillPricing(price: string, comparePrice: string, cost: string) {
    await this.page
      .locator('[data-test-id="pricing_card_price_input"]')
      .fill(price);

    await this.page
      .locator('[data-test-id="pricing_card_compare_price_input"]')
      .fill(comparePrice);

    await this.page
      .locator('[data-test-id="pricing_card_cost_input"]')
      .fill(cost);
  }

  async fillInventory(sku: string, barcode: string) {
    await this.page
      .locator('[data-test-id="inventory_card_sku_input"]')
      .fill(sku);

    await this.page
      .locator('[data-test-id="inventory_card_barcode_input"]')
      .fill(barcode);
  }

  async fillShipping(weight: string) {
    await this.page
      .locator('[data-test-id="shipping_card_weight_input"]')
      .fill(weight);
  }

  async saveProductAndGoToListing(merchantId: string) {
    await this.page
      .locator('[data-test-id="create_product_submit_button"]')
      .click();

    // Wait for detail page to confirm save succeeded
    await this.page.waitForURL(/\/products\/\d+/, { timeout: 15000 });

    // Navigate directly to listing
    await this.page.goto(`/gk-pages/store/${merchantId}/products`);

    await expect(
      this.page.locator('[data-test-id="products_header_title"]')
    ).toBeVisible({ timeout: 15000 });

    console.log('✅ Product saved — redirected to listing');
  }

  // ================================
  // COMMON VALIDATION METHOD
  // ================================

  async verifyProductRowDetails(
    productName: string,
    expectedStatus: string,
    expectedVariants: string
  ) {
    const row = this.page.locator('tr', {
      has: this.page.getByText(productName),
    });

    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(expectedStatus);
    await expect(row).toContainText(expectedVariants);

    console.log('✅ Product Name Verified');
    console.log('✅ Product Status Verified');
    console.log('✅ Product Variant Count Verified');
  }

  // ================================
  // SEARCH (READ FLOW)
  // ================================

  async searchProduct(productName: string) {
    const searchInput = this.page.locator(
      '[data-test-id="products_search_input"]'
    );

    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // Triple-click selects all text in the field reliably
    await searchInput.click({ clickCount: 3 });
    await searchInput.fill('');

    // pressSequentially fires React onChange on every keystroke
    await searchInput.pressSequentially(productName, { delay: 50 });

    // Wait for the matching row to appear — avoids networkidle hanging
    await expect(
      this.page.locator('tr', {
        has: this.page.getByText(productName),
      })
    ).toBeVisible({ timeout: 20000 });

    console.log(`✅ Product "${productName}" found in listing`);
  }

  // ================================
  // BULK EDIT (UPDATE FLOW)
  // ================================

  async selectProductCheckbox(productName: string) {
    const row = this.page.locator('tr', {
      has: this.page.getByText(productName),
    });

    await expect(row).toBeVisible({ timeout: 15000 });

    await row.locator('input[type="checkbox"]').check();

    console.log('✅ Product checkbox selected');
  }

  async clickBulkEdit() {
    await this.page
      .locator('[data-test-id="header_action_button_bulkEdit"]')
      .click();

    console.log('✅ Bulk Edit clicked');
  }

  async waitForBulkEditTable() {
    await expect(
      this.page.locator('[data-test-id="bulk_product_edit_table"]')
    ).toBeVisible({ timeout: 15000 });

    console.log('✅ Bulk edit table visible');
  }

  async appendTitleInBulkEdit(suffix: string): Promise<string> {
    const titleCell = this.page.locator(
      '[data-test-id^="bulk_product_edit_cell_"][data-test-id$="_title"]'
    );

    await expect(titleCell).toBeVisible({ timeout: 10000 });

    await titleCell.dblclick();

    const input = this.page.locator('.cell-input');

    await expect(input).toBeVisible({ timeout: 5000 });

    const existingValue = await input.inputValue();
    const updatedName = `${existingValue}${suffix}`;

    await input.fill(updatedName);
    await input.press('Enter');

    console.log(`✅ Title updated to: ${updatedName}`);

    return updatedName;
  }

  async confirmBulkEditModal() {
    const okButton = this.page
      .locator('.ant-modal-footer')
      .getByRole('button', { name: 'OK' });

    await expect(okButton).toBeVisible({ timeout: 10000 });

    await okButton.click();

    // Wait for modal to close
    await expect(okButton).not.toBeVisible({ timeout: 10000 });

    console.log('✅ Bulk edit confirmed (OK clicked)');
  }

  async verifyUpdatedProductInListing(productName: string) {
    const row = this.page.locator('tr', {
      has: this.page.getByText(productName),
    });

    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText('Active');

    console.log('✅ Updated product verified in listing');
  }
}
// import { Page, expect } from '@playwright/test';

// export class ProductsPage {
//   readonly page: Page;

//   constructor(page: Page) {
//     this.page = page;
//   }

//   // ================================
//   // NAVIGATION
//   // ================================

//   async navigateToProducts() {
//     await this.page.getByText('GK Pages').click();

//     // Scope to the menu popup to avoid strict mode violation
//     // when "Products" text appears elsewhere on the page
//     await this.page
//       .locator('.ant-menu-title-content', { hasText: 'Products' })
//       .click();

//     await this.page.waitForLoadState('networkidle');
//   }

//   // ================================
//   // CREATE PRODUCT FLOW
//   // ================================

//   async clickAddProduct() {
//     await this.page.locator('[data-test-id="products_add_button"]').click();
//   }

//   async fillBasicDetails(title: string, description: string) {
//     await this.page.locator('[data-test-id="title_input"]').fill(title);
//     await this.page.locator('.ql-editor').first().fill(description);
//   }

//   async fillPricing(price: string, comparePrice: string, cost: string) {
//     await this.page
//       .locator('[data-test-id="pricing_card_price_input"]')
//       .fill(price);

//     await this.page
//       .locator('[data-test-id="pricing_card_compare_price_input"]')
//       .fill(comparePrice);

//     await this.page
//       .locator('[data-test-id="pricing_card_cost_input"]')
//       .fill(cost);
//   }

//   async fillInventory(sku: string, barcode: string) {
//     await this.page
//       .locator('[data-test-id="inventory_card_sku_input"]')
//       .fill(sku);

//     await this.page
//       .locator('[data-test-id="inventory_card_barcode_input"]')
//       .fill(barcode);
//   }

//   async fillShipping(weight: string) {
//     await this.page
//       .locator('[data-test-id="shipping_card_weight_input"]')
//       .fill(weight);
//   }

//   async saveProductAndGoToListing(merchantId: string) {
//     await this.page
//       .locator('[data-test-id="create_product_submit_button"]')
//       .click();

//     // Wait for detail page to confirm save succeeded
//     await this.page.waitForURL(/\/products\/\d+/, { timeout: 15000 });

//     // Navigate directly to listing
//     await this.page.goto(`/gk-pages/store/${merchantId}/products`);

//     await this.page.waitForLoadState('networkidle');

//     console.log('✅ Product saved — redirected to listing');
//   }

//   // ================================
//   // COMMON VALIDATION METHOD
//   // ================================

//   async verifyProductRowDetails(
//     productName: string,
//     expectedStatus: string,
//     expectedVariants: string
//   ) {
//     const row = this.page.locator('tr', {
//       has: this.page.getByText(productName),
//     });

//     await expect(row).toBeVisible({ timeout: 15000 });
//     await expect(row).toContainText(expectedStatus);
//     await expect(row).toContainText(expectedVariants);

//     console.log('✅ TC - Product Name Verified');
//     console.log('✅ TC - Product Status Verified');
//     console.log('✅ TC - Product Variant Count Verified');
//   }

//   // ================================
//   // SEARCH (READ FLOW)
//   // ================================

//   async searchProduct(productName: string) {
//     const searchInput = this.page.locator(
//       '[data-test-id="products_search_input"]'
//     );

//     await expect(searchInput).toBeVisible({ timeout: 10000 });

//     // Focus, select all existing text, delete it
//     await searchInput.click();
//     await this.page.keyboard.press('Meta+A');
//     await this.page.keyboard.press('Backspace');

//     // pressSequentially fires React onChange on every keystroke
//     await searchInput.pressSequentially(productName, { delay: 50 });

//     await this.page.waitForLoadState('networkidle');

//     await expect(
//       this.page.locator('tr', {
//         has: this.page.getByText(productName),
//       })
//     ).toBeVisible({ timeout: 15000 });

//     console.log(`✅ Product "${productName}" found in listing`);
//   }

//   // ================================
//   // BULK EDIT (UPDATE FLOW)
//   // ================================

//   async selectProductCheckbox(productName: string) {
//     const row = this.page.locator('tr', {
//       has: this.page.getByText(productName),
//     });

//     await expect(row).toBeVisible({ timeout: 15000 });

//     await row.locator('input[type="checkbox"]').check();

//     console.log('✅ Product checkbox selected');
//   }

//   async clickBulkEdit() {
//     await this.page
//       .locator('[data-test-id="header_action_button_bulkEdit"]')
//       .click();

//     console.log('✅ Bulk Edit clicked');
//   }

//   async waitForBulkEditTable() {
//     await expect(
//       this.page.locator('[data-test-id="bulk_product_edit_table"]')
//     ).toBeVisible({ timeout: 15000 });

//     console.log('✅ Bulk edit table visible');
//   }

//   async appendTitleInBulkEdit(suffix: string): Promise<string> {
//     const titleCell = this.page.locator(
//       '[data-test-id^="bulk_product_edit_cell_"][data-test-id$="_title"]'
//     );

//     await expect(titleCell).toBeVisible({ timeout: 10000 });

//     await titleCell.dblclick();

//     const input = this.page.locator('.cell-input');

//     await expect(input).toBeVisible({ timeout: 5000 });

//     const existingValue = await input.inputValue();
//     const updatedName = `${existingValue}${suffix}`;

//     await input.fill(updatedName);
//     await input.press('Enter');

//     console.log(`✅ Title updated to: ${updatedName}`);

//     return updatedName;
//   }

//   async confirmBulkEditModal() {
//     const okButton = this.page
//       .locator('.ant-modal-footer')
//       .getByRole('button', { name: 'OK' });

//     await expect(okButton).toBeVisible({ timeout: 10000 });

//     await okButton.click();

//     await this.page.waitForLoadState('networkidle');

//     console.log('✅ Bulk edit confirmed (OK clicked)');
//   }

//   async verifyUpdatedProductInListing(productName: string) {
//     const row = this.page.locator('tr', {
//       has: this.page.getByText(productName),
//     });

//     await expect(row).toBeVisible({ timeout: 15000 });
//     await expect(row).toContainText('Active');

//     console.log('✅ Updated product verified in listing');
//   }
// }




