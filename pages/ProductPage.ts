import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly productPrice: Locator;
  readonly productTitle: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page
      .locator('[id^="add-to-cart-button-"], input[value="Add to cart"]')
      .first();

    this.quantityInput = page.locator(".qty-input");
    this.productPrice = page
      .locator('[class^="price-value-"], .product-price')
      .first();

    this.productTitle = page.locator('.product-name h1, h1[itemprop="name"]');
    this.successMessage = page.locator(".bar-notification.success");
  }

  async selectProductFromList(productName: string) {
    const productLink = this.page.getByRole("link", {
      name: productName,
      exact: true,
    });
    await this.clickElement(productLink);
    await this.waitForPageLoad();
  }

  async getProductPrice(): Promise<number> {
    const priceText = await this.getText(this.productPrice);
    return this.parsePrice(priceText);
  }

  async getProductName(): Promise<string> {
    return await this.getText(this.productTitle);
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.waitFor({ state: "visible" });
    await this.quantityInput.fill(quantity.toString());
  }

  async addToCart(quantity: number = 1) {
    if (quantity > 1) {
      await this.setQuantity(quantity);
    }
    await this.clickElement(this.addToCartButton);
    await this.waitForSuccessMessage();
  }

  async waitForSuccessMessage() {
    try {
      await this.successMessage.waitFor({ state: "visible", timeout: 5000 });

      await this.page.waitForTimeout(1000);
    } catch {}
  }

  async closeSuccessMessage() {
    const closeButton = this.page.locator(".close");
    try {
      await closeButton.click({ timeout: 2000 });
    } catch {}
  }
}
