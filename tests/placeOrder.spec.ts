import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { DataReader, Product } from "../utils/dataReader";
import { PriceCalculator } from "../utils/priceCalculator";

test.describe("Place Order with Multiple Products", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let products: Product[];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await homePage.navigateToHome();
  });

  test("should place order with products from JSON and validate price calculations", async () => {
    products = DataReader.getProductsFromJSON("products.json");

    const email = process.env.TEST_USER_EMAIL || "testuser@example.com";
    const password = process.env.TEST_USER_PASSWORD || "Test@123";

    // Step 1: Login
    await test.step("Login to application", async () => {
      await loginPage.login(email, password);
      expect(await loginPage.isLoggedIn()).toBeTruthy();
    });

    // Step 2: Add products to cart
    await test.step("Add multiple products to cart", async () => {
      for (const product of products) {
        await homePage.navigateToHome();
        await homePage.searchProduct(product.name);
        await productPage.selectProductFromList(product.name);

        const actualPrice = await productPage.getProductPrice();
        expect(
          PriceCalculator.pricesMatch(actualPrice, product.price),
          `Price mismatch for ${product.name}`
        ).toBeTruthy();

        await productPage.addToCart(product.quantity);
        await productPage.closeSuccessMessage();
      }
    });

    // Step 3: Validate cart calculations
    await test.step("Validate cart price calculations", async () => {
      await homePage.navigateToCart();

      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBeGreaterThan(0);

      for (const item of cartItems) {
        const expectedItemTotal = PriceCalculator.calculateItemTotal(
          item.unitPrice,
          item.quantity
        );

        expect(
          PriceCalculator.pricesMatch(expectedItemTotal, item.totalPrice),
          `Item total mismatch for ${item.name}`
        ).toBeTruthy();
      }

      const actualSubTotal = await cartPage.getSubTotal();
      const expectedSubTotal = PriceCalculator.calculateSubTotal(cartItems);

      expect(
        PriceCalculator.pricesMatch(expectedSubTotal, actualSubTotal),
        `Subtotal mismatch`
      ).toBeTruthy();
    });

    // Step 4: Checkout (grand total implicitly validated by success)
    await test.step("Complete checkout process", async () => {
      await cartPage.proceedToCheckout();

      await checkoutPage.completeCheckout({
        country: "1",
        city: "New York",
        address1: "123 Test Street",
        zipCode: "10001",
        phone: "1234567890",
      });

      const isSuccess = await checkoutPage.isOrderSuccessful();
      expect(isSuccess).toBeTruthy();

      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test("should place order with products from CSV", async () => {
    products = DataReader.getProductsFromCSV("products.csv");

    const email = process.env.TEST_USER_EMAIL || "testuser@example.com";
    const password = process.env.TEST_USER_PASSWORD || "Test@123";

    await loginPage.login(email, password);
    expect(await loginPage.isLoggedIn()).toBeTruthy();

    const product = products[0];
    await homePage.searchProduct(product.name);
    await productPage.selectProductFromList(product.name);
    await productPage.addToCart(product.quantity);

    await homePage.navigateToCart();
    const cartItems = await cartPage.getCartItems();

    const actualSubTotal = await cartPage.getSubTotal();
    const expectedSubTotal = PriceCalculator.calculateSubTotal(cartItems);

    expect(
      PriceCalculator.pricesMatch(expectedSubTotal, actualSubTotal)
    ).toBeTruthy();
  });
});
