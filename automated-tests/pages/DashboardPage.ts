import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  readonly executiveSummaryLink: Locator;
  readonly switchMerchantButton: Locator;
  readonly merchantSearchInput: Locator;
  readonly setMerchantButton: Locator;
  readonly gkPagesMenu: Locator;
  readonly productsMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    this.executiveSummaryLink = page.getByRole('link', { name: /executive summary/i });
    this.switchMerchantButton = page.getByText(/switch merchant/i);
    this.merchantSearchInput = page.getByRole('textbox');
    this.setMerchantButton = page.getByRole('button', { name: /set merchant/i });
    this.gkPagesMenu = page.getByText(/gk pages/i);
    this.productsMenu = page.getByText(/products/i);
  }

  async assertExecutiveSummaryVisible() {
    await this.executiveSummaryLink.waitFor({ state: 'visible' });
  }

  async switchMerchant(merchantId: string) {
    await this.page.waitForLoadState('networkidle');
    await this.switchMerchantButton.waitFor({ state: 'visible' });

    await this.switchMerchantButton.click();
    await this.merchantSearchInput.fill(merchantId);

    await this.page
      .getByRole('radio', { name: new RegExp(merchantId) })
      .check();

    await this.setMerchantButton.click();
  }

  async navigateToProducts() {
    await this.gkPagesMenu.click();
    await this.productsMenu.click();
  }

  async assertProductsPageLoaded(merchantId: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForURL(
      new RegExp(`/gk-pages/store/${merchantId}/products`)
    );
  }
}