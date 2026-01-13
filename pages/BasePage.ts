import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = "") {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickElement(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async fillInput(locator: Locator, text: string) {
    await locator.waitFor({ state: "visible" });
    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return (await locator.textContent()) || "";
  }

  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: "visible" });
  }

  parsePrice(priceText: string): number {
    const cleanPrice = priceText.replace(/[^0-9.]/g, "");
    return parseFloat(cleanPrice);
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}
