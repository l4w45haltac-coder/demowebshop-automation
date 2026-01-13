import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly loginLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutLink: Locator;
  readonly accountLink: Locator;

  constructor(page: Page) {
    super(page);
    this.loginLink = page.locator("a.ico-login");
    this.emailInput = page.locator("#Email");
    this.passwordInput = page.locator("#Password");
    this.loginButton = page.locator('input[value="Log in"]');
    this.logoutLink = page.locator("a.ico-logout");
    this.accountLink = page.locator("a.account");
  }

  async navigateToLogin() {
    await this.clickElement(this.loginLink);
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.navigateToLogin();
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.logoutLink.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async logout() {
    if (await this.isLoggedIn()) {
      await this.clickElement(this.logoutLink);
      await this.waitForPageLoad();
    }
  }

  async getLoggedInEmail(): Promise<string> {
    return await this.getText(this.accountLink);
  }
}
