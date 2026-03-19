import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly otpInput: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', { name: /example@email.com/i });
    this.passwordInput = page.locator('input[type="password"]');
    this.otpInput = page.getByRole('textbox', { name: /\*+/ });
    this.nextButton = page.getByRole('button', { name: /next/i });
  }

  async navigateToLogin() {
    await this.page.goto('/login');
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
    await this.nextButton.click();
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
    await this.nextButton.click();
  }

  async enterOTP(otp: string) {
    await this.otpInput.fill(otp);
    await this.nextButton.click();
  }

  async assertLoginSuccessful() {
    await expect(this.page).toHaveURL(/store|dashboard/);
  }

  async login(email: string, password: string, otp: string) {
    await this.navigateToLogin();
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.enterOTP(otp);
    await this.assertLoginSuccessful();
  }
}