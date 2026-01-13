import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartLink: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator("#small-searchterms");
    this.searchButton = page.locator('input[value="Search"]');
    this.cartLink = page.locator("#topcartlink a.ico-cart");

    this.cartQuantity = page.locator(".cart-qty");
  }

  async navigateToHome() {
    await this.navigate("/");
  }

  async searchProduct(productName: string) {
    await this.fillInput(this.searchInput, productName);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  async navigateToCategory(categoryName: string) {
    const categoryLink = this.page
      .locator(`a:has-text("${categoryName}")`)
      .first();
    await this.clickElement(categoryLink);
    await this.waitForPageLoad();
  }

  async getCartItemCount(): Promise<number> {
    try {
      const qtyText = await this.getText(this.cartQuantity);
      const match = qtyText.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    } catch {
      return 0;
    }
  }

  async navigateToCart() {
    await this.clickElement(this.cartLink);
    await this.waitForPageLoad();
  }
}
