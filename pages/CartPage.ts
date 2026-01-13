import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface CartItem {
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly subTotal: Locator;
  readonly shippingCost: Locator;
  readonly totalPrice: Locator;
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly updateCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator(".cart");
    this.cartItems = page.locator(".cart-item-row");
    this.subTotal = page.locator('tr:has-text("Sub-Total:") .product-price');
    this.shippingCost = page.locator('tr:has-text("Shipping:") .product-price');
    this.totalPrice = page.locator(".order-total");

    this.termsCheckbox = page.locator("#termsofservice");
    this.checkoutButton = page.locator("#checkout");
    this.updateCartButton = page.locator('input[name="updatecart"]');
  }

  async getCartItems(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const count = await this.cartItems.count();

    for (let i = 0; i < count; i++) {
      const row = this.cartItems.nth(i);

      const nameEl = row.locator(".product-name");
      const name = await this.getText(nameEl);

      const unitPriceEl = row.locator(".unit-price");
      const unitPriceText = await this.getText(unitPriceEl);
      const unitPrice = this.parsePrice(unitPriceText);

      const qtyEl = row.locator(".qty-input");
      const qtyValue = await qtyEl.inputValue();
      const quantity = parseInt(qtyValue);

      const totalPriceEl = row.locator(".subtotal");
      const totalPriceText = await this.getText(totalPriceEl);
      const totalPrice = this.parsePrice(totalPriceText);

      items.push({ name, unitPrice, quantity, totalPrice });
    }

    return items;
  }

  async getSubTotal(): Promise<number> {
    const subTotalText = await this.getText(this.subTotal);
    return this.parsePrice(subTotalText);
  }

  async getShippingCost(): Promise<number> {
    try {
      const row = this.page
        .locator("table.cart-total tr")
        .filter({ hasText: "Shipping:" });
      await row.waitFor({ state: "visible" });
      const priceEl = row.locator(".product-price");
      if ((await priceEl.count()) > 0) {
        const text = await this.getText(priceEl);
        return this.parsePrice(text);
      }

      // Fallback: read the whole cell text
      const cellText = await row.locator("td.cart-total-right").innerText();
      if (cellText.toLowerCase().includes("calculated")) {
        return 0; // treat "Calculated during checkout" as 0 for now
      }

      return this.parsePrice(cellText);
    } catch {
      return 0;
    }
  }

  async getTotalPrice(): Promise<number> {
    try {
      const row = this.page
        .locator("table.cart-total tr")
        .filter({ hasText: "Total:" });
      await row.waitFor({ state: "visible" });

      const priceEl = row.locator(".product-price.order-total, .order-total");
      if ((await priceEl.count()) > 0) {
        const text = await this.getText(priceEl);
        return this.parsePrice(text);
      }

      // Fallback: read the whole cell text
      const cellText = await row.locator("td.cart-total-right").innerText();
      if (cellText.toLowerCase().includes("calculated")) {
        return 0; // treat "Calculated during checkout" as 0 until checkout
      }

      return this.parsePrice(cellText);
    } catch {
      return 0;
    }
  }

  async updateQuantity(itemIndex: number, quantity: number) {
    const qtyInput = this.cartItems.nth(itemIndex).locator(".qty-input");
    await this.fillInput(qtyInput, quantity.toString());
    await this.clickElement(this.updateCartButton);
    await this.waitForPageLoad();
  }

  async removeItem(itemIndex: number) {
    const removeCheckbox = this.cartItems
      .nth(itemIndex)
      .locator(".remove-from-cart input");
    await removeCheckbox.check();
    await this.clickElement(this.updateCartButton);
    await this.waitForPageLoad();
  }

  async proceedToCheckout() {
    await this.termsCheckbox.check();
    await this.clickElement(this.checkoutButton);
    await this.waitForPageLoad();
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      const emptyMsg = this.page.locator(
        '.order-summary-content:has-text("Your Shopping Cart is empty!")'
      );
      await emptyMsg.waitFor({ state: "visible", timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}
