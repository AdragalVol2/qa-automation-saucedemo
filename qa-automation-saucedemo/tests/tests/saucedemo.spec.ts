import { test, expect } from '@playwright/test';
import { LoginPage } from 'pages/LoginPage';
import { InventoryPage } from 'pages/InventoryPage';
import { CartPage } from 'pages/CartPage';
import { CheckoutPage } from 'pages/CheckoutPage';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.USER_NAME || 'standard_user';
const password = process.env.PASSWORD || 'secret_sauce';

test.describe('Saucedemo QA Automation Challenge', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Inicio de sesión exitoso', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('2. Inicio de sesión con credenciales incorrectas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('usuario_invalido', 'clave_invalida');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user');
  });

  test('3. Agregar un producto al carrito', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(username, password);
    await inventoryPage.addProductToCart(0);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('4. Completar una compra', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(username, password);
    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('5. Agregar dos productos, eliminar uno y validar el contenido del carrito', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(username, password);

    // Agregar dos productos
    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // Ir al carrito y verificar cantidad
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(2);

    // Eliminar un producto
    await cartPage.removeItem(0);

    // Validar que queda 1 y que el badge se actualiza
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});