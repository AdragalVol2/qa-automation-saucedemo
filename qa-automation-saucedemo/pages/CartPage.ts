import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async removeItem(index: number) {
    await this.cartItems.nth(index).locator('button:has-text("Remove")').click();
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemName(index: number): Promise<string> {
    return await this.cartItems.nth(index).locator('.inventory_item_name').innerText();
  }
}
