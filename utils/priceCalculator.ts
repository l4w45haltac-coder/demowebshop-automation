export class PriceCalculator {
  /**
   * Calculate total price for a single item
   */
  static calculateItemTotal(unitPrice: number, quantity: number): number {
    return this.roundPrice(unitPrice * quantity);
  }

  /**
   * Calculate subtotal from multiple items
   */
  static calculateSubTotal(
    items: Array<{ unitPrice: number; quantity: number }>
  ): number {
    const total = items.reduce((sum, item) => {
      return sum + this.calculateItemTotal(item.unitPrice, item.quantity);
    }, 0);
    return this.roundPrice(total);
  }

  /**
   * Calculate grand total including shipping
   */
  static calculateGrandTotal(subTotal: number, shipping: number): number {
    return this.roundPrice(subTotal + shipping);
  }

  /**
   * Round price to 2 decimal places
   */
  static roundPrice(price: number): number {
    return Math.round(price * 100) / 100;
  }

  /**
   * Compare two prices with tolerance for floating point errors
   */
  static pricesMatch(
    price1: number,
    price2: number,
    tolerance: number = 0.01
  ): boolean {
    return Math.abs(price1 - price2) <= tolerance;
  }

  /**
   * Format price as currency string
   */
  static formatPrice(price: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  }

  /**
   * Validate cart calculations
   */
  static validateCartCalculations(
    items: Array<{ unitPrice: number; quantity: number; totalPrice: number }>,
    expectedSubTotal: number,
    shippingCost: number,
    expectedGrandTotal: number
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate each item's total
    items.forEach((item, index) => {
      const calculatedTotal = this.calculateItemTotal(
        item.unitPrice,
        item.quantity
      );
      if (!this.pricesMatch(calculatedTotal, item.totalPrice)) {
        errors.push(
          `Item ${index + 1}: Expected ${calculatedTotal}, got ${
            item.totalPrice
          }`
        );
      }
    });

    // Validate subtotal
    const calculatedSubTotal = this.calculateSubTotal(items);
    if (!this.pricesMatch(calculatedSubTotal, expectedSubTotal)) {
      errors.push(
        `Subtotal: Expected ${calculatedSubTotal}, got ${expectedSubTotal}`
      );
    }

    // Validate grand total
    const calculatedGrandTotal = this.calculateGrandTotal(
      expectedSubTotal,
      shippingCost
    );
    if (!this.pricesMatch(calculatedGrandTotal, expectedGrandTotal)) {
      errors.push(
        `Grand Total: Expected ${calculatedGrandTotal}, got ${expectedGrandTotal}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
