import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  async addProductToCart(index: number) {
    await this.inventoryList.nth(index).locator('button:has-text("Add to cart")').click();
  }

  async removeProductFromCart(index: number) {
    await this.inventoryList.nth(index).locator('button:has-text("Remove")').click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async getProductName(index: number): Promise<string> {
    return await this.inventoryList.nth(index).locator('.inventory_item_name').innerText();
  }
}