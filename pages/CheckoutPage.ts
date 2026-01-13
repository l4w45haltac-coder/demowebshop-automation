import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  readonly countrySelect: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly billingContinueButton: Locator;
  readonly shippingContinueButton: Locator;
  readonly shippingMethodOption: Locator;
  readonly shippingMethodContinue: Locator;
  readonly paymentMethodOption: Locator;
  readonly paymentMethodContinue: Locator;
  readonly paymentInfoContinue: Locator;
  readonly confirmButton: Locator;
  readonly successMessage: Locator;
  readonly orderNumber: Locator;

  constructor(page: Page) {
    super(page);

    this.countrySelect = page.locator("#BillingNewAddress_CountryId");
    this.cityInput = page.locator("#BillingNewAddress_City");
    this.address1Input = page.locator("#BillingNewAddress_Address1");
    this.zipCodeInput = page.locator("#BillingNewAddress_ZipPostalCode");
    this.phoneInput = page.locator("#BillingNewAddress_PhoneNumber");
    this.billingContinueButton = page.locator(
      '#billing-buttons-container input[value="Continue"]'
    );

    this.shippingContinueButton = page.locator(
      '#shipping-buttons-container input[value="Continue"]'
    );

    this.shippingMethodOption = page
      .locator('input[name="shippingoption"]')
      .first();
    this.shippingMethodContinue = page.locator(
      '#shipping-method-buttons-container input[value="Continue"]'
    );

    this.paymentMethodOption = page
      .locator('input[name="paymentmethod"]')
      .first();
    this.paymentMethodContinue = page.locator(
      '#payment-method-buttons-container input[value="Continue"]'
    );

    this.paymentInfoContinue = page.locator(
      '#payment-info-buttons-container input[value="Continue"]'
    );

    this.confirmButton = page.locator(
      '#confirm-order-buttons-container input[value="Confirm"]'
    );
    this.successMessage = page.locator(".order-completed");
    this.orderNumber = page.locator('ul.details li:has-text("Order number:")');
  }

  async fillBillingAddress(data?: {
    country?: string;
    city?: string;
    address1?: string;
    zipCode?: string;
    phone?: string;
  }) {
    const newAddressForm = this.page.locator("#billing-new-address-form");

    if (data && (await newAddressForm.isVisible())) {
      if (data.country) {
        await this.countrySelect.selectOption(data.country);
      }
      await this.fillInput(this.cityInput, data.city!);
      await this.fillInput(this.address1Input, data.address1!);
      await this.fillInput(this.zipCodeInput, data.zipCode!);
      await this.fillInput(this.phoneInput, data.phone!);
    }

    await this.billingContinueButton.click();
  }

  async selectShippingAddress() {
    await this.clickElement(this.shippingContinueButton);
    await this.page.waitForTimeout(1000);
  }

  async selectShippingMethod() {
    await this.shippingMethodOption.check();
    await this.clickElement(this.shippingMethodContinue);
    await this.page.waitForTimeout(3000);
  }

  async selectPaymentMethod() {
    await this.paymentMethodOption.check();
    await this.clickElement(this.paymentMethodContinue);
    await this.page.waitForTimeout(1000);
  }

  async confirmPaymentInfo() {
    await this.clickElement(this.paymentInfoContinue);
    await this.page.waitForTimeout(1000);
  }

  async confirmOrder() {
    await this.clickElement(this.confirmButton);
    await this.waitForPageLoad();
  }

  async getOrderNumber(): Promise<string> {
    await this.successMessage.waitFor({ state: "visible" });
    const orderText = await this.getText(this.orderNumber);
    return orderText.replace("Order number: ", "");
  }

  async isOrderSuccessful(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async completeCheckout(billingData: {
    country?: string;
    city: string;
    address1: string;
    zipCode: string;
    phone: string;
  }) {
    await this.fillBillingAddress(billingData);
    await this.selectShippingAddress();
    await this.selectShippingMethod();
    await this.selectPaymentMethod();
    await this.confirmPaymentInfo();
    await this.confirmOrder();
  }
}
